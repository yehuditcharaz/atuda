import json
import urllib.parse

from google.cloud import storage
from google.oauth2 import service_account
from utils.config import SignUrlConfig, UtilsConfig
from utils.helpers import is_hebrew


def generate_signed_url(url):
    parts = parse_url(url)
    hebrew_index = find_hebrew_index(parts)
    bucket_name = extract_bucket_name(parts, hebrew_index)
    blob_name = extract_blob_name(parts, hebrew_index)
    storage_client = initialize_storage_client()
    blob_client_config = {
        "bucket_name": bucket_name,
        "blob_name": blob_name,
        "storage_client": storage_client,
    }
    blob = get_blob(blob_client_config)
    return generate_url(blob)


def parse_url(url):
    parser_url = urllib.parse.unquote(url)
    parts = parser_url.split("/")
    return parts


def find_hebrew_index(parts):
    return next((i for i, s in enumerate(parts) if is_hebrew(s)), None)


def extract_bucket_name(parts, hebrew_index=None):
    return "/".join(parts[:hebrew_index] if hebrew_index else parts[:-1])


def extract_blob_name(parts, hebrew_index=None):
    return "/".join(parts[hebrew_index:]) if hebrew_index else parts[-1]


def initialize_storage_client():
    credentials = get_credentials()
    storage_client = storage.Client(credentials=credentials)
    return storage_client


def get_credentials():
    credentials_info = json.loads(UtilsConfig.GOOGLE_APPLICATION_CREDENTIALS)
    credentials = service_account.Credentials.from_service_account_info(
        credentials_info
    )
    return credentials


def get_blob(blob_client_config):
    bucket = blob_client_config["storage_client"].bucket(
        blob_client_config["bucket_name"]
    )
    blob = bucket.blob(blob_client_config["blob_name"])
    return blob


def generate_url(blob):
    url = blob.generate_signed_url(
        version=SignUrlConfig.VERSION, expiration=SignUrlConfig.EXPIRATION, method="GET"
    )
    return url
