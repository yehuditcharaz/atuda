# from langchain_core.messages import HumanMessage

# from langchain_google_vertexai import ChatVertexAI
# from langchain_google_vertexai import VertexAI

# from sklearn.metrics.pairwise import cosine_similarity
# from google.cloud import aiplatform
# from config import AIConfig
# from google.oauth2 import service_account

from model.gemini_api import generate_text

# class AIConfig:
#     PROJECT_ID = "sublime-vine-445509-s8"  
#     LOCATION = "us-central1"  
#     MODEL_NAME = "gemini-1.5-flash"  
#     GEMINI_OUTPUT_TOKEN_LIMIT = 8192
#     GEMINI_API_KEY="AIzaSyBn4FyCuU_Tm7kFN1LJE2pOZH6mcyBq4DY"
    
# def connect_to_vertexai():
#     credentials = service_account.Credentials.from_service_account_file('../sublime-vine-445509-s8-23f0c62fe46b.json')
#     aiplatform.init(project=AIConfig.PROJECT_ID, location=AIConfig.LOCATION, credentials=credentials)
#     print(f"Vertex AI initialized with project: {AIConfig.PROJECT_ID} and location: {AIConfig.LOCATION}")

import time

def summarize_text(resume_text: str) -> str:
    instructions = (
        """
        המטרה היא לייצר סיכום מקצועי וממוקד של קורות חיים, תוך התאמה לתחום ההתמחות של המועמד. הסיכום צריך להיות כללי ומובנה כך שיוכל לשמש כבסיס להתאמה למגוון משרות בתחומים שונים.  

        **הוראות סיכום:**  
        1. **משפט פתיחה:**  
            התחל את הסיכום במשפט קצר וברור המתאר את תחום ההתמחות של המועמד. לדוגמה: "מומחה בפיתוח תוכנה", "פסיכולוגית קלינית מנוסה", "עורך דין בעל ניסיון בדיני עבודה".  
        
        2. **מבנה הסיכום:**  
            חלק את הסיכום לקטגוריות הבאות:  
            - **השכלה:** תארים אקדמיים, תעודות מקצועיות והכשרות משמעותיות.  
            - **ניסיון מקצועי:** תפקידים קודמים, תחומי אחריות מרכזיים והישגים בולטים.  
            - **כישורים:** כישורים טכניים ורכים, כגון שפות תכנות, כלי עבודה מקצועיים או מיומנויות בינאישיות.  
            - **שפות:** ציין שפות שהמועמד שולט בהן, כולל רמת השליטה.  

        3. **תמצות מידע:**  
            - שמור על סיכום קצר וברור (במקסימום 2-3 נקודות לכל קטגוריה).  
            - העדף מידע מהשנים האחרונות או הרלוונטי ביותר.  

        4. **שפה מקצועית ונקייה:**  
            - השתמש בשפה מקצועית ונטולת חזרות.  
            - אל תכלול הערות, הסברים, או סיכומים מסכמים של המודל עצמו.  
        """    )
    # model = ChatVertexAI(model_name=AIConfig.MODEL_NAME, max_output_tokens=AIConfig.GEMINI_OUTPUT_TOKEN_LIMIT)
    prompt = f"{instructions}\n\nקורות חיים:\n{resume_text}"

    time.sleep(1)
    # response = model.invoke(
    #     [
    #         HumanMessage(
    #             content=prompt
    #         )
    #     ]
    # )
    response = generate_text(prompt)
    print(response)
    return response    


def summarize_job_description(job_description: str) -> str:
    """
    Summarizes a job description into a concise, structured format.

    Args:
        job_description (str): The full text of the job description.

    Returns:
        str: A summarized version of the job description.
    """
    # Instructions for the model
    instructions = ("""
    אנא סכם את תיאור המשרה בצורה ממצה ומובנית, תוך זיהוי והכללת רק את הדרישות והפרטים הרלוונטיים לבדיקת התאמת מועמדים למשרה. הסיכום יכלול את החלקים הבאים:
    1.	מהות המשרה: תאר בקצרה את מטרת התפקיד, כפי שמופיעה בתיאור המשרה.
    2.	תחומי אחריות: פרט את המשימות המרכזיות של התפקיד.
    3.	דרישות חובה: ציין את השכלה, כישורים וניסיון הנדרשים לפי המפורט בתיאור המשרה. אם מופיעה אפשרות של השכלה חילופין או ניסיון חלופי, סכם זאת בהתאם.
    4.	דרישות רצויות: ציין את הכישורים והניסיון המהווים יתרון. אם המשרה כוללת אפשרויות חלופיות (כגון ניסיון או השכלה אחרת), ציין את האפשרויות השונות.
    5.	כישורים אישיים: פרט את התכונות האישיות שחשובות להצלחה בתפקיד.
    6.	שפות נדרשות: אם בתיאור המשרה מצוין שהמועמד נדרש לשלוט בשפות מסוימות, ציין זאת בצורה ברורה.
    הנחיות נוספות:
    •	התעלם מפרטים שאינם רלוונטיים לתפקיד עצמו.
    """
)

    # Prepare prompt for the model
    prompt = f"{instructions}\n\nתיאור משרה:\n{job_description}"

    # Assuming the use of a large language model (like Gemini or OpenAI)
    # model = ChatVertexAI(model_name=AIConfig.MODEL_NAME, max_output_tokens=AIConfig.GEMINI_OUTPUT_TOKEN_LIMIT)
    
    time.sleep(1)
    # Send the request to the model
    # response = model.invoke(
    #     [
    #         HumanMessage(
    #             content=prompt
    #         )
    #     ]
    # )

    # return response.content
    response = generate_text(prompt)
    print(response)
    
    return response