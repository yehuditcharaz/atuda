from uuid import uuid4

from services.ai_services.summarizer import summarize_text
from services.ai_services.extract_data import extract_text
from services.ai_services.qdrant import upsert_documents, search_similar_by_id
from services.ai_services.evaluate import evaluate_with_gemini
from services.jobs import create_job
from services.resumes import get_resume_by_id


def summarize_and_vector(file, user_id, name, num_top, threshold):
    file_bytes = file.read()
    file_text = extract_text(file_bytes, file.filename)
    job, resumes = process_job_and_match_resumes(file_text.page_content, user_id ,name, num_top, threshold)
    return job, resumes


def process_job_and_match_resumes(text, user_id, job_name, num_top, threshold, requirements=None):
    try:
        summary = summarize_text("jobs", text)

        uuid = str(uuid4())
        job = prepare_create_job(user_id, job_name, num_top, threshold, requirements or summary, summary, uuid)

        upsert_documents([{ "id": uuid, "text": summary, "db_id": job["id"] }], "jobs")

        resumes = find_matching_resumes(uuid, num_top, requirements or summary, threshold)

        return job, resumes
    except Exception as e:
        print(e)


def prepare_create_job(user_id, name, num_top, threshold, requirements, summary, vector_id):
    try:
        job_obj = {
            'name':name,
            'num_top_resumes': num_top,
            'threshold_percentage': threshold,
            'requirements': requirements,
            'summary': summary,
            'vector_id': vector_id,
            'user_id': user_id
        }
        
        resume = create_job(job_obj)
        return resume
    except Exception as e:
        print(e)


def find_matching_resumes(uuid, num_top, job_description, threshold):
    resumes_data = search_similar_by_id(uuid, "jobs", "resumes", num_top)

    resumes = fetch_resumes_by_ids(resumes_data)

    evaluated_resumes = evaluate_resumes(resumes, job_description, threshold)

    return evaluated_resumes

def fetch_resumes_by_ids(resumes_data):
    resumes = []
    for resume_id, _, _ in resumes_data:
        resume_data = get_resume_by_id(resume_id)
        if resume_data is not None:
            resumes.append(resume_data)

    return resumes


def evaluate_resumes(resumes, job_description, threshold):
    evaluated_resumes = []

    for resume in resumes:
        gemini_evaluation = evaluate_with_gemini(job_description, resume["summary"])

        ## TODO ##
        # if gemini_evaluation[0] == 1 and float(gemini_evaluation[1]) >= threshold:        
        evaluated_resumes.append({
            'name': resume['name'],
            'url': resume['url'],
            'mark': gemini_evaluation[1],
            'explanation': gemini_evaluation[2] 
        })
            
    evaluated_resumes_sorted = sorted(evaluated_resumes, key=lambda x: x['mark'], reverse=True)
    
    return evaluated_resumes_sorted
