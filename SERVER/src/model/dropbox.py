import dropbox
import os
from dotenv import load_dotenv
load_dotenv()

def dropbox_connect():
    dbx=dropbox.Dropbox("sl.u.AFf09ssdQrQJ3UL0_F1kBi0knL201zswFTV_-euHoCnqQoXlMEcCL5Vhmp4flUWp099Hz2japf_pPfiAiXehMk4MtK2wc5XFV-eRkveUllFiIjCb3ztqubLKUDwFWhxM3QEyq9lHUvrKmdF9rq0RjeKf5Q3iP-DB9CrQXxecnt6oEw1OHZg-3ZO4lNxHs1KoWffLoL-aYyBOg3KCbM0_lKeb-GXfybw8q7qiqhKkAkkj80JrKCtD2hL1Ezn0VY-y145-bOiBhE0IrrW3xrcu32WbOE8n0vxxehC3xUEk_K0GBzp225SWHizVfx97hedl6Q-6-rOt3IPfBc1GvjzkfBhvykZxk0baWP72SBAbPVgJZiD8bpJAbQg60hgOgphqiIOANUblAuyGBFWzfEtpAM-Ec0a7OMnVPP4QfPHSJ9X3S43-KhcXJum02lJCCHn-habQXOLEcBxX1ce3egjj9Vgmdw74hrYKgPFjxm-VwjW7MpdSHxIgN-Uys_ryUgaiUklL_Z0ZHpBg2y9IS50wax6eBwP2U7WwAJDl37O-OvHFlgIMsxWpJY55qIXSZ3beiddtKNrOD0vuCQM5RMbV7MqCKiNuLt5j274UX1ePGIdXm1RDVxSSqgPQYFLonPy4kDcF0A3ZO-a22Nl0OvK64gGm-CSBB90gIJPkdOR_Azv8unY8G5EC1DX4UKqsK999fqxBmQA5_YigsYPetJhsBeF1tARad8-PWX6_gPtWG2VeKU0vit6FwulNadxDzDqBa_5l9CVNAyt-tck-2BPAk4bpdmwJj_tOoz8jizzWsU4ioU9-HDstpJi0Qt4bnJVmVlks5KHYF6IqbG6bHS43dWrvEwu2AnKlCfxQ3kUnbpxrvYH-eOiGBDQt-KvJFsXrrGqDXjnqt7GFcZRLg7Y9Kf9Kpzl2l8B1ke0cIk_xCumEgnc7HI8ZWaAQTEyw_cSOnBopyVpsCD5IIBcdBAnl17VQdMfew9B33ktTkJxX6nwMsR-IXNErqcd689uD9jUgGXAa-8xRG3cjzSA-LGnfpmuo8LclBtfVu6o155AW6fVhwK3EQ4qnPikZllqQWXtCxOuHSp3aPy-SgDBfbGoTOYBk-f6p8yleIpMRButmknEN1pW2geBT5BbV7Ls_kfhBF5xVtllQe1BQFxyjzN6TXNlax6p8lly8y5J3LGfpFmAZiUftAGgUaSO3XDXlFbNFIHh9bwNo0Od35_QUzR2mUcEqyVrjyaOp2v_YHimiT82KbZGpXhwzT4pDxUQZk9Cs3jxRVAu4pa4FvLor-eh1nTwO60tHdhbK7Tr4veuBNkcF7SLZXcz3OwaiHkWl9n1pG61ZOrFg3MWQqmBj_3EeQlgUg_f6pCwu2RJchMyPygi5rvp58tykfeLYL0qv6bJyI0klfOA8mWY9MCEI1bnk3Aieb7J_W6fKw0fpmg40x02JoZRfoB54ic0o4H7G_HHjzUk")
    return dbx

def upload_file(local_path, dropbox_path):
    dbx=dropbox_connect()
    with open(local_path, "rb") as f:
      dbx.files_upload(f.read(), dropbox_path)
    print(f"Uploaded {local_path} to {dropbox_path}!")

def download_file(dropbox_path, local_path):
    dbx=dropbox_connect()
    with open(local_path, "wb") as f:
        metadata, res = dbx.files_download(path=dropbox_path)       
        f.write(res.content)
    print(f"Downloaded {dropbox_path} to {local_path}!")

def get_shared_link(url):
    print(url)
    try:
        dbx=dropbox_connect()
        shared_link_metadata = dbx.sharing_list_shared_links(path=url,direct_only=True)
        if(shared_link_metadata.links==[]):
            return create_shared_link(url)
        print(shared_link_metadata.links[0].url)
        return shared_link_metadata.links[0].url
    except Exception as e:
        print(f"Error: {e}")
    
def create_shared_link(file_path):
    try:
        dbx=dropbox_connect()
        shared_link = dbx.sharing_create_shared_link_with_settings(file_path)
        print(f"Shared link: {shared_link.url}")
        return shared_link.url
    except dropbox.exceptions.ApiError as e:
        return e
    except Exception as e:
        print(f"Error: {e}")

def dropbox_list_files(path):

    dbx = dropbox_connect()
    try:
        files = dbx.files_list_folder(path).entries
        files_list = []
        for file in files:
            if isinstance(file, dropbox.files.FileMetadata):
                files_list.append(file.name)
        return files_list 
    except Exception as e:
        print('Error getting list of files from Dropbox: ' + str(e))


# def upload_file_if_not_exist(local_path):
#     file_name=local_path[local_path.rfind('/')+1:]
#     dir_path=local_path[:local_path.rfind('/')]
#     dir_name=dir_path[local_path.rfind('/')+1:]
#     path=os.path.join("/APPS/MachPoint",dir_name)
#     files=dropbox_list_files(path)
#     if file_name not in files:
#         upload_file(local_path,os.path.join(path,file_name))
#     return os.path.join(path,file_name)

def download_all_files(local_path):
    path=os.path.join("/",local_path)
    if not os.path.exists(local_path):
            os.makedirs(local_path)
    files=dropbox_list_files(path)
    for file in files:
        download_file(os.path.join(path,file), os.path.join(local_path,file))