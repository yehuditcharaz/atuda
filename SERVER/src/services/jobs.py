from models.job import Job
from .db import db


def create_job(data):
    job = Job(**data)
    db.session.add(job)
    db.session.commit()
    return job.to_dict()


def get_job(job_id):
    job = Job.query.get(job_id)
    return job.to_dict()


def get_user_jobs(user_id):
    jobs = Job.query.filter(Job.user_id == user_id).all()
    return [job.to_dict() for job in jobs]


def get_job_by_id(resume_id: int) -> dict | None:
    resume = Job.query.get(resume_id)
    return resume.to_dict() if resume else None


def get_all_jobs():
    jobs = Job.query.all()
    return [job.to_dict() for job in jobs]


def update_job(job_id, data):
    job = Job.query.get(job_id)
    for key, value in data.items():
        setattr(job, key, value)
    db.session.commit()
    return job.to_dict()


def delete_job(job_id):
    job = Job.query.get(job_id)
    db.session.delete(job)
    db.session.commit()
    return "delete job"