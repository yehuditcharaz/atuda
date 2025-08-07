from typing import Any
import boto3
import os

def s3_connection() -> Any:
    try:
        s3_client = boto3.client(
            "s3",
            endpoint_url=os.environ['S3_ENTRYPOINT_URL'],
            aws_access_key_id=os.environ['S3_ACCESS_KEY_ID'],
            aws_secret_access_key=os.environ['S3_SECRET_ACCESS_KEY'],
        )
        return s3_client
    except Exception as error:
        print("An error occurred while try to connect to S3.")
