import datetime
import re
import json
import urllib.parse


from google.cloud import storage
from google.oauth2 import service_account
from config import UtilsConfig

def create_storage_client():
    credentials_info = json.loads(UtilsConfig.GOOGLE_APPLICATION_CREDENTIALS)
    credentials = service_account.Credentials.from_service_account_info(credentials_info)
    storage_client = storage.Client(credentials=credentials)
    return storage_client

def generate_signed_url(bucket_name, blob_name):
    storage_client = create_storage_client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(blob_name)
    print("Created bucket and blob")
    url = blob.generate_signed_url(
        version="v4",
        expiration=datetime.timedelta(minutes=15),
        method="GET",
    )

    return url


def contain_hebrew(text):
    return re.search(r'[\u0590-\u05FF]', text) is not None


def extract_bucket_and_blob(parts):
    bucket_name = '/'.join(parts[:-1])
    blob_name = parts[-1]
    return bucket_name, blob_name


def get_bucket_and_blob_name(url):
    parser_url = urllib.parse.unquote(url)
    parts = parser_url.split('/')
    index = next((i for i, s in enumerate(parts) if re.search(r'[\u0590-\u05FF]', s)), None)
    
    if index is not None:
        bucket_name = '/'.join(parts[:index])
        blob_name = '/'.join(parts[index:])
        return bucket_name, blob_name
    
    return extract_bucket_and_blob(parts)
