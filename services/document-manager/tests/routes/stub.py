class StatusCodes:
    HTTP_STATUS_OK = 200
    HTTP_STATUS_REDIRECT = 302
    HTTP_STATUS_ERROR = 500


class URLs:
    MOCK_IMAGE_URL = "http://mock-signed-url.com/image"
    MOCK_DOCUMENT_URL = "http://mock-signed-url.com/document"
    EXAMPLE_IMAGE_URL = "http://example.com/image"
    GET_IMAGE_URL = f"/sign_url/get_image?url={EXAMPLE_IMAGE_URL}"
    GET_LINK_URL = f"/sign_url/get_link?url={MOCK_DOCUMENT_URL}&page=1"
    EXPECTED_DOCUMENT_LOCATION = "http://mock-signed-url.com/document#page=1"


class Utils:
    ERROR_GENERATING_SIGNED_URL = "Error generating signed URL"
    FAKE_IMAGE_DATA = b"fake_image_data"
    CONTENT_TYPE_IMAGE_JPEG = "image/jpeg"
