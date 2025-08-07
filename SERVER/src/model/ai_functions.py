import os
import pathlib
from PyPDF2 import PdfReader
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from dotenv import load_dotenv
import numpy as np
from docx import Document
from model.summarizer import summarize_text,summarize_job_description
from model.dropbox import get_shared_link
# from services.jobs import get_all_jobs
from google.oauth2 import service_account
# from vertexai.language_models import TextEmbeddingModel
from sentence_transformers import SentenceTransformer

import requests

# from config import AIConfig
load_dotenv()

class AIConfig:
    PROJECT_ID = "sublime-vine-445509-s8"  
    LOCATION = "us-central1"  
    MODEL_NAME = "gemini-1.5-flash"  
    GEMINI_OUTPUT_TOKEN_LIMIT = 8192
    # GEMINI_API_KEY="AIzaSyBn4FyCuU_Tm7kFN1LJE2pOZH6mcyBq4DY"

# def connect_to_vertexai():
#     credentials = service_account.Credentials.from_service_account_file('../sublime-vine-445509-s8-23f0c62fe46b.json')
#     aiplatform.init(project=AIConfig.PROJECT_ID, location=AIConfig.LOCATION, credentials=credentials)
#     print(f"Vertex AI initialized with project: {AIConfig.PROJECT_ID} and location: {AIConfig.LOCATION}")

def extract_text_from_pdf(pdf_path):
    reader = PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text

def extract_text_from_docx(filepath):
    try:
        doc = Document(filepath)
        fullText = []
        for para in doc.paragraphs:
            fullText.append(para.text)
        return '\n'.join(fullText)
    except Exception as e:
        print(f"An error occurred: {e}")
        return None
    
def extract_text_from_txt(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as file:
            text = file.read()
        return text
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

def embed_text(text):
    return model.encode([text])[0]

# model = SentenceTransformer('sentence-transformers/LaBSE')
# def embed_text(text, model):
#     response = model.get_embeddings([text]) 
#     return response[0].values

# model = TextEmbeddingModel.from_pretrained('text-multilingual-embedding-002')

model = SentenceTransformer('all-MiniLM-L6-v2')


def summarize_document(document_path):
    print("++++++++++")
    document_text = read_file(document_path)
    document_summary = summarize_text(document_text)
    return document_summary

def summarize_document_job_description(document_path):
    document_text = read_file(document_path)
    document_summary = summarize_job_description(document_text)
    return document_summary


def read_file(document_path):
    document_path = pathlib.Path(document_path)
    document_text = ""
    if document_path.is_file() and document_path.suffix.lower() in ('.doc', '.docx'):
        document_text = extract_text_from_docx(str(document_path))
    elif document_path.is_file() and document_path.suffix.lower() in ('.pdf'):
         document_text = extract_text_from_pdf(str(document_path))
    elif document_path.is_file() and document_path.suffix.lower() in ('.txt'):
         document_text = extract_text_from_txt(str(document_path))
    return document_text

# def get_resumes_from_db():
#     resumes=requests.get("https://127.0.0.1:8080/resumes", verify=False)
#     resume_vectors = [embed_text(resume.summary) for resume in resumes]
#     return resumes,resume_vectors

def get_jobs_from_db():
    response=requests.get("http://104.155.153.158:8080/jobs", verify=False)
    print(response)
    jobs=response.json()
    print(jobs)
    job_descirption_vectors = [embed_text(job.summary) for job in jobs]
    return jobs,job_descirption_vectors


def format_number(number):
    try:
        number = float(number)
        percentage = number * 100
        return f"{percentage:.2f}%"
    except ValueError:
        return "Invalid Number" 

def get_last_folder(file_path):
    folder_name = os.path.basename(os.path.dirname(file_path))
    return folder_name

def get_resume_matches(job_description, num_top_resumes, threshold):
    resumes,resumes_vectors=get_resumes_from_db()
    job_summary=summarize_job_description(job_description)
    job_vector = embed_text(job_summary)
    similarities = cosine_similarity([job_vector], resume_vectors)[0]
    top_indices = np.argsort(similarities)[::-1][:num_top_resumes]
    all_cv = [{'name': os.path.basename(resumes[idx]),
               'mark': format_number(similarities[idx]),
               'path': get_shared_link(os.path.join("/cv/",resumes[idx]))}
                for idx in top_indices]
    filtered_resumes = [all_cv[idx] for idx in range(len(all_cv)) if similarities[top_indices[idx]] > threshold]
    return filtered_resumes

def get_job_description_matches(user_exist,local_path, num_top_job_descriptions, threshold,dropbox_file_path=None):
    with open(local_path, 'rb') as f:  
        document_text = read_file(local_path)
    jobs,job_descirption_vectors = get_jobs_from_db()
    resume_summary = summarize_text(document_text)
    resume_vector = embed_text(resume_summary)
    similarities = cosine_similarity([resume_vector], job_descirption_vectors)[0]
    top_indices = np.argsort(similarities)[::-1][:num_top_job_descriptions]
    all_job_descriptions = [{'job_id':get_job_id(jobs,idx),
                            "mark":format_number(similarities[idx])}
                            for idx in top_indices if similarities[top_indices[idx]]*100 > threshold and similarities[top_indices[idx]] > 0.7]
    if(user_exist):
        return {"jobs":all_job_descriptions}
    user_details = {"name":dropbox_file_path[dropbox_file_path.rfind('/')+1:dropbox_file_path.rfind('.')+1:],
                    "url":get_shared_link(dropbox_file_path),
                    "summary":summarize_document(os.path.join("cv",dropbox_file_path[dropbox_file_path.rfind('/')+1:]))}
    print(user_details,)
    filtered_job_descriptions = [{"jobs":[all_job_descriptions[idx] for idx in range(len(all_job_descriptions)) if similarities[top_indices[idx]]*100 > threshold and similarities[top_indices[idx]] > 0.7],"resume":user_details}]
    return filtered_job_descriptions

def get_job_id(jobs, job_summary):
    for job in jobs:
        if job.get('summary') == job_summary:
            return job.job_id
    return None

def get_resumes_from_db():
    response = requests.get("http://104.155.153.158:8080/resumes", verify=False)
    resumes=response.json()
    resume_vectors = [embed_text(resume['summary']) for resume in resumes]
    return resumes ,resume_vectors

def get_jobs_from_db():
    response = requests.get("http://104.155.153.158:8080/jobs", verify=False)
    jobs = response.json()
    job_descirption_vectors = [embed_text(job['summary']) for job in jobs]
    return jobs,job_descirption_vectors