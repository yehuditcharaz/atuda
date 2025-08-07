from flask import Blueprint, jsonify, abort, request

from services.uploads_resume import data_preparation
from services.upload_job import summarize_and_vector, process_job_and_match_resumes, find_matching_resumes
from utils.file_validate import validate_file

uploads = Blueprint("upload", __name__)

@uploads.route("/upload-resume", methods=["POST"])
def upload_resume():
    try:
        user_id = request.form.get("user_id")
        file = validate_file()
        resume, jobs = data_preparation(file, user_id)
        
        return jsonify({"message": "File uploaded successfully.", "resume": resume, "jobs": jobs})
    except Exception as e:
        abort(500, description=f"An error occurred: {str(e)}")


@uploads.route("/upload-job-file", methods=["POST"])
def upload_job_file():
    try:
        file = request.files.get("jobFile")
        user_id = request.form.get("user_id")
        name = request.form.get("name")
        num_top = request.form.get("num_top_job_descriptions")
        threshold = request.form.get("threshold_percentage")

        job, resumes = summarize_and_vector(file, user_id, name, num_top, threshold)
        return jsonify({"message": "200", "job": job, "resumes":resumes})
    except Exception as e:
        abort(500, description=f"An error occurred: {str(e)}")


@uploads.route("/upload-job-data", methods=["POST", "OPTIONS"])
def upload_job_data():
    if request.method == "OPTIONS":
        return '', 200
    try:
        data = request.get_json()
        job, resumes = process_job_and_match_resumes(
            data["job_description"],
            data["user_id"],
            data["name"],
            data["num_top_job_descriptions"],
            data["threshold_percentage"],
            data["job_description"]
        )
        
        return jsonify({"message": "200", "job": job, "resumes":resumes})
    except Exception as e:
        abort(500, description=f"An error occurred: {str(e)}")


@uploads.route("/search-by-job", methods=["POST"])
def search_by_job():
    try:
        data = request.get_json()

        resumes_data = find_matching_resumes(data["vector_id"], data["num_top"], data["job_description"], data["threshold"])

        return jsonify({"message": "200", "resumes":resumes_data})
    except Exception as e:
        abort(500, description=f"An error occurred: {str(e)}")
