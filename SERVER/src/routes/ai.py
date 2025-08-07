# from flask import Blueprint, request, jsonify
# from services.ai import get_resume_matches_by_parameters,upload_file,get_params_of_resume
# ai = Blueprint("ai", __name__)


# @ai.route('/search_job', methods=[ 'POST'])
# def upload_files():
#     job=upload_file(request)
#     return jsonify(job), 201

# @ai.route('/search_job_to_exist_user', methods=[ 'POST'])
# def get_job_description():
#     job=get_params_of_resume(request)
#     return jsonify(job), 201


# @ai.route('/search_worker', methods=['POST'])
# def get_resume_matches():
#     print('start')
#     data = request.get_json(force=True)
#     print(data)
#     resumes = get_resume_matches_by_parameters(data)
#     print(resumes)
#     return resumes, 201
