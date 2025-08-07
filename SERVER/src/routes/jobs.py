from flask import Blueprint, request, jsonify
from services.jobs import (
    create_job,
    get_job,
    get_user_jobs,
    update_job,
    delete_job,
    get_all_jobs,
)

jobs = Blueprint("jobs", __name__)


@jobs.route("/jobs", methods=["POST"])
def add_job():
    data = request.get_json(force=True)
    job = create_job(data)
    return jsonify(job), 201


@jobs.route("/jobs/<int:job_id>", methods=["GET"])
def fetch_job(job_id):
    job = get_job(job_id)
    return jsonify(job)


@jobs.route("/user_jobs/<int:user_id>", methods=["GET"])
def fetch_user_jobs(user_id):
    job = get_user_jobs(user_id)
    return jsonify(job)


@jobs.route("/jobs", methods=["GET"])
def fetch_all_jobs():
    jobs = get_all_jobs()
    return jsonify(jobs)


@jobs.route("/jobs/<int:job_id>", methods=["PUT"])
def modify_job(job_id):
    data = request.get_json(force=True)
    job = update_job(job_id, data)
    return jsonify(job)


@jobs.route("/jobs/<int:job_id>", methods=["DELETE"])
def remove_job(job_id):
    job = delete_job(job_id)
    return jsonify(job), 204