from flask import Blueprint, request, jsonify
from services.resumes import (
    create_resume,
    get_resume,
    get_user_resume,
    update_resume,
    update_user_resume,
    delete_resume,
    get_all_resumes,
)

resumes = Blueprint("resumes", __name__)


@resumes.route("/resumes", methods=["POST"])
def add_resume():
    data = request.get_json(force=True)
    resume = create_resume(data)
    return jsonify(resume), 201


@resumes.route("/resumes/<int:resume_id>", methods=["GET"])
def fetch_resume(resume_id):
    resume = get_resume(resume_id)
    return jsonify(resume)


@resumes.route("/user_resume/<int:user_id>", methods=["GET"])
def fetch_user_resume(user_id):
    resume = get_user_resume(user_id)
    return jsonify(resume)


@resumes.route("/resumes", methods=["GET"])
def fetch_all_resumes():
    resumes = get_all_resumes()
    return jsonify(resumes)


@resumes.route("/resumes/<int:resume_id>", methods=["PUT"])
def modify_resume(resume_id):
    data = request.get_json(force=True)
    resume = update_resume(resume_id, data)
    return jsonify(resume)


@resumes.route("/user_resume/<int:user_id>", methods=["PUT"])
def modify_user_resume(user_id):
    data = request.get_json(force=True)
    resume = update_user_resume(user_id, data)
    return jsonify(resume)


@resumes.route("/resumes/<int:resume_id>", methods=["DELETE"])
def remove_resume(resume_id):
    resume = delete_resume(resume_id)
    return "DELETE"