from models.resume import Resume
from .db import db


def create_resume(data):
    resume = Resume(**data)
    db.session.add(resume)
    db.session.commit()
    return resume.to_dict()


def get_resume(resume_id):
    resume = Resume.query.get(resume_id)
    return resume.to_dict()


def get_user_resume(user_id):
    resume = Resume.query.filter(Resume.user_id == user_id).first()
    return resume.to_dict()


def get_resume_by_id(resume_id: int) -> dict | None:
    resume = Resume.query.get(resume_id)
    return resume.to_dict() if resume else None


def get_all_resumes():
    resumes = Resume.query.all()
    return [resume.to_dict() for resume in resumes]


def update_resume(resume_id, data):
    resume = Resume.query.get(resume_id)
    for key, value in data.items():
        setattr(resume, key, value)
    db.session.commit()
    return resume.to_dict()


def update_user_resume(user_id, data):
    resume = Resume.query.filter(Resume.user_id == user_id).first()
    for key, value in data.items():
        setattr(resume, key, value)
    db.session.commit()
    return resume.to_dict()


def delete_resume(resume_id):
    resume = Resume.query.get(resume_id)
    db.session.delete(resume)
    db.session.commit()
    return resume.to_dict()