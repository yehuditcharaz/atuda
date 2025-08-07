import ast
import re
from model.ai_functions import read_file, get_resumes_from_db,embed_text,format_number
from model.gemini_api import generate_text
from model.summarizer import summarize_job_description
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from model.dropbox import get_shared_link
import os
import time

def get_file_extension(folder_path, file_name_without_extension):
    for file in os.listdir(folder_path):
        if file.startswith(file_name_without_extension):
            _, extension = os.path.splitext(file)
            return extension
    return None

def convert_inner_quotes(text):
    matches = list(re.finditer(r'"', text))
    if len(matches) < 2:
        return text

    first_quote_idx = matches[0].start()
    last_quote_idx = matches[-1].start()

    before_first = text[:first_quote_idx + 1] 
    middle = text[first_quote_idx + 1:last_quote_idx]
    after_last = text[last_quote_idx:] 

    middle_fixed = middle.replace('"', "'")

    return f"{before_first}{middle_fixed}{after_last}"

def get_job_des(job_description):
    job_summary = summarize_job_description(job_description)
    
    return job_summary

def get_resume_matches(job_summary, num_top_resumes):
    
    resumes,resume_vectors = get_resumes_from_db()
    job_vector = embed_text(job_summary)
    similarities = cosine_similarity([job_vector], resume_vectors)[0]
    top_indices = np.argsort(similarities)[::-1][:num_top_resumes]
    print(resumes[0])
    
    all_cv = [
    {
        'name': os.path.basename(resumes[idx]['name']),
        'local_path': os.path.join(
            "cv/",
            resumes[idx]['name'] + get_file_extension("cv", resumes[idx]['name'])
        ),
        'mark': format_number(similarities[idx]),
        'path': get_shared_link(
            os.path.join(
                "/cv/",
                resumes[idx]['name'] + get_file_extension("cv", resumes[idx]['name'])
            )
        ),
    }
    for idx in top_indices
    ]
    
    filtered_resumes = [all_cv[idx] for idx in range(len(all_cv)) if similarities[top_indices[idx]] >= 0.5]
    print('------------------filtered_resumes')
    print(filtered_resumes)
    
    return filtered_resumes

# def send_to_gemini(prompt):
    # model = ChatVertexAI(model_name=MODEL_NAME, max_output_tokens=1000)
    # time.sleep(1)
    # response = model.invoke([HumanMessage(content=prompt)])
    # return response.content.strip()

def send_to_gemini(prompt):
    time.sleep(1)
    response = generate_text(prompt)
    return response

def evaluate_with_gemini(job_description, resume, max_retries=3):
 
    resume_path = resume['local_path']
    resume_content = read_file(resume_path)

    prompt = f"""
    אנא בדוק את רמת ההתאמה בין תיאור המשרה לבין קורות החיים הבאים.

    תיאור משרה:
    {job_description}

    קורות חיים:
    {resume_content}

    כללים להערכת התאמה:
    1. דרישות סף (חובה) הן קריטיות: אם דרישות אלו אינן מתקיימות, ההתאמה תוגדר כ"לא מתאימה".
    2. דרישות רצויות אינן קריטיות: חסרונן יוריד אחוזי התאמה באופן מתון בלבד.
    3. ניסיון שאינו נדרש אינו מהווה חיסרון ואינו אמור להוריד מהציון.
    4. שים דגש על הכישורים, הניסיון וההשכלה החשובים ביותר לתפקיד.

    פורמט תשובה מבוקש:
    [ מתאים: 1 אם כן, 0 אם לא, אחוז התאמה (מספר שלם בין 0 ל-100), "הסבר ברור ותמציתי עד 5 משפטים"]
    דוגמה לתשובה: [1, 85, "המועמד מתאים עם ניסיון רלוונטי בכל הדרישות."]
    """

    retries = 0
    while retries < max_retries:
        response_content = send_to_gemini(prompt)
        try:
            response_fixed = convert_inner_quotes(response_content)
            gemini_evaluation = ast.literal_eval(response_fixed)
            return gemini_evaluation  # הצלחה
        except (SyntaxError, ValueError):
            retries += 1
            print(f"שגיאה בעיבוד התשובה מהממודל. ניסיון {retries} מתוך {max_retries}...")
            print(response_content)

    # אם כל הניסיונות כשלו
    return [0, 0, "שגיאה בעיבוד התשובה מהממודל לאחר מספר ניסיונות."]

def find_and_evaluate_resumes(job_description, num_top_resumes, threshold):
    job_summary = get_job_des(job_description)
    resumes = get_resume_matches(job_summary, 10)

    evaluated_resumes = []

    for resume in resumes:
        gemini_evaluation = evaluate_with_gemini(job_description, resume)
        print(gemini_evaluation)
        if gemini_evaluation[0] == 1 and float(gemini_evaluation[1]) >= threshold:
            evaluated_resumes.append({
                'name': resume['name'],
                'mark': gemini_evaluation[1],
                'url': resume['path'],
                'explanation': gemini_evaluation[2] 
           })
            
    evaluated_resumes_sorted = sorted(evaluated_resumes, key=lambda x: x['mark'], reverse=True)
    
    filtered_resumes = {'resumes':evaluated_resumes_sorted,'summary':job_summary}
    print(filtered_resumes)
    return evaluated_resumes_sorted
