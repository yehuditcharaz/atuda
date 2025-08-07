from datetime import date
from flask import abort
from uuid import uuid4

from services.ai_services.extract_data import extract_text
from services.ai_services.qdrant import upsert_documents, search_similar_by_id
from services.ai_services.summarizer import summarize_text
from services.s3.s3_actions import save_file, read_file_from_bucket
from services.resumes import create_resume
from services.jobs import get_job_by_id


def data_preparation(file, user_id):
    presigned_url = upload_to_minio(file)
    file_data = read_file(file)
    summary = summarize_text("resumes", file_data)
    uuid = str(uuid4())
    resume = prepare_create_resume(file, user_id, presigned_url, summary, uuid)
    upsert_documents([{'id':uuid, 'text':summary, "db_id": resume["id"]}], "resumes")
    jobs = find_matching_jobs(uuid)
    return resume, jobs

def upload_to_minio(file) -> str:

    presigned_url = save_file(file, "resumes", file.filename)
    if presigned_url is None:
        abort(500, description="Could not generate presigned URL.")

    return presigned_url

def read_file(file):
    file_data = read_file_from_bucket("resumes", file.filename)
    if file_data:
        text_data = extract_text(file_data, file.filename)
    return text_data


def prepare_create_resume(file, user_id, url, summary, uuid):
    resume_obj = {
        'name':file.filename,
        'upload_date': date.today(),
        'url':url,
        'summary':summary,
        'vector_id':uuid,
        'user_id':user_id
    }
    
    resume = create_resume(resume_obj)
    return resume

def find_matching_jobs(uuid):
    jobs_data = search_similar_by_id(uuid, "resumes", "jobs")
    
    jobs = fetch_jobs_by_ids(jobs_data)
    return jobs

def fetch_jobs_by_ids(resumes_data):
    resumes = []
    for resume_id, _, _ in resumes_data:
        resume_data = get_job_by_id(resume_id)
        if resume_data is not None:
            resumes.append(resume_data)

    return resumes
