from services.s3.s3_connection import s3_connection
from utils.logger import logger


s3_client = s3_connection()

def save_file(file, bucket_name, file_key) -> str:

    try:
        s3_client.upload_fileobj(file, bucket_name, file_key)
        return get_file_url(bucket_name, file_key)
    except Exception as e:
        logger.error(f"An error occurred while uploading the file: {str(e)}")
        raise


def get_file_url(bucket_name: str, object_name: str) -> str:
    return f"http://minio-service:9001/browser/{bucket_name}/{object_name}"
    # return f"https://{s3_client.meta.endpoint_url}/{bucket_name}/{object_name}"


def read_file_from_bucket(bucket_name: str, file_key: str) -> bytes:
    try:
        response = s3_client.get_object(Bucket=bucket_name, Key=file_key)
        file_data = response['Body'].read()
        return file_data
    except Exception as error:
        logger.error(f"An error occurred while reading the file {file_key} from bucket {bucket_name}: {error}")
        return None


def create_bucket(bucket_name) -> None:
    try:
        if is_bucket_exists(bucket_name):
            logger.info(f"The bucket {bucket_name} already exists.")
        else:
            s3_client.create_bucket(Bucket=bucket_name)
            logger.info(f"The bucket {bucket_name} was successfully created")
    except Exception as error:
        logger.error(f"An error occurred while creating a bucket {bucket_name}")


def list_buckets() -> list[str]:
    try:
        response = s3_client.list_buckets()
        buckets = [bucket["Name"] for bucket in response["Buckets"]]
        return buckets
    except Exception as error:
        logger.error(f"An error occurred while checking the bucket list: {error}")


def get_url_to_download(bucket_name: str, file_name: str) -> str:
    try:
        url = s3_client.generate_presigned_url(
            "get_object",
            Params={"Bucket": bucket_name, "Key": file_name},
            ExpiresIn=3600,
        )
        logger.info(f"Succeeded getting download URL for file {file_name}")
        return url
    except Exception as error:
        logger.error("An error occurred while trying to get file url to download.")


def get_items_from_bucket(bucket_name: str) -> list[tuple] | None:
    try:
        if not is_bucket_exists(bucket_name):
            logger.warn(f"The bucket {bucket_name} does not exists.")
            return []
        response = s3_client.list_objects_v2(Bucket=bucket_name)
        if "Contents" in response:
            return [(obj["Key"], obj["LastModified"]) for obj in response["Contents"]]
        else:
            return []
    except Exception as error:
        logger.error(f"An error occurred while listing files in bucket '{bucket_name}': {error}")


def is_bucket_exists(bucket_name: str) -> bool:
    return bucket_name in list_buckets()