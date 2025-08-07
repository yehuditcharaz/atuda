import docx
from docx import Document
from model.dropbox import upload_file
import os
from model.ai_functions import get_resume_matches,get_job_description_matches, read_file
from model.get_match_resumes import find_and_evaluate_resumes
from dotenv import load_dotenv
load_dotenv()
        
def upload_file(data):
        try:
            num_top_resumes = int(data.args.get('num_top_resumes', 20)) 
            threshold_percentage = float(data.args.get('threshold_percentage', 0)) 
            if 'fileToUpload' not in data.files:
                return ({'error': 'No file part'}), 400

            file = data.files.get('fileToUpload')
            if file.filename == '':
                return ({'error': 'No selected file'}), 400
            if file:
                filename = file.filename
                print(filename)
                local_path=os.path.join("CV", filename)
                file.save(local_path)
                dropbox_file_path=upload_file(local_path)
                return get_job_description_matches(False,local_path,num_top_resumes, threshold_percentage,dropbox_file_path)
        except Exception as e:
                return f'Error reading file: {str(e)}'

def get_params_of_resume(data):
    num_top_resumes = int(data.args.get('num_top_resumes', 20)) 
    threshold_percentage = float(data.args.get('threshold_percentage', 0))
    dropbox_file_path=data.args.get('path')
    local_path=os.path.join("cv", data.args.get('name'))
    return get_job_description_matches(True,local_path,num_top_resumes, threshold_percentage)

def get_resume_matches_by_parameters(data):
    try:
        # if 'fileToUpload' in data.files:
        #     file = data.files.get('fileToUpload')
        #     if file.filename == '':
        #         return ({'error': 'No selected file'}), 400
        #     if file:
        #         filename = file.filename
        #         local_path=os.path.join("jobs", filename)
        #         file.save(local_path)
        #         job_description=read_file(local_path)
        # else:
        job_description=data["job_description"]
        num_top_resumes = data['num_top_job_descriptions']
        threshold_percentage = float(data['threshold_percentage'])
        all_resume_matches=find_and_evaluate_resumes(job_description, num_top_resumes, threshold_percentage)
        return all_resume_matches
    except Exception as e:
        return f'Error to finding a match : {str(e)}'
    
# import docx
# from docx import Document
# from model.dropbox import upload_file
# import os
# from model.ai_functions import get_resume_matches,get_job_description_matches, read_file
# from dotenv import load_dotenv
# load_dotenv()

# def upload_file(data):
#         try:
#             num_top_resumes = data['num_top_job_resumes']
#             threshold_percentage = data['threshold_percentage']
#             if 'myFile' not in data.files:
#                 return ({'error': 'No file part'}), 400

#             file = data.files.get('myFile')
#             if file.filename == '':
#                 return ({'error': 'No selected file'}), 400
#             print(file)
#             if file:
#                 filename = file.filename
#                 local_path=os.path.join("CV", filename)
#                 file.save(local_path)
#                 upload_file(local_path)
#                 dropbox_file_path = os.path.join('/cv/',filename)
#                 return get_job_description_matches(False,local_path,num_top_resumes, threshold_percentage,dropbox_file_path)
#         except Exception as e:
#                 return f'Error reading file: {str(e)}'

# def get_params_of_resume(data):
#     num_top_resumes = data['num_top_job_descriptions']
#     threshold_percentage = data['threshold_percentage']
#     dropbox_file_path = data['url']
#     local_path=os.path.join("cv", data['name'])
#     return get_job_description_matches(True,local_path,num_top_resumes, threshold_percentage)

# def get_resume_matches_by_parameters(data):
#     try:
#         num_top_resumes = data['num_top_job_descriptions']
#         threshold_percentage = data['threshold_percentage']
#         if 'jobFile' in data.files:
#             file = data.files.get('jobFile')
#             print(data.files)
#             if file.filename == '':
#                 return ({'error': 'No selected file'}), 400
#             if file:
#                 filename = file.filename
#                 local_path = os.path.join("jobs", filename)
#                 file.save(local_path)
#                 job_description = read_file(local_path)
#         else:
#             job_description = data.get('job_description')
#         print(job_description)
#         all_resume_matches = get_resume_matches(job_description, num_top_resumes, threshold_percentage)
#         return all_resume_matches
#     except Exception as e:
#         return f'Error to finding a match : {str(e)}'    
