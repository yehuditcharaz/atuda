from .stub import StatusCodes, URLs, Utils


def test_get_image_success(client, mock_generate_signed_url_success, mock_requests_get):
    response = client.get(URLs.GET_IMAGE_URL)

    assert response.status_code == StatusCodes.HTTP_STATUS_OK
    assert response.mimetype == Utils.CONTENT_TYPE_IMAGE_JPEG
    assert response.data == Utils.FAKE_IMAGE_DATA
    mock_generate_signed_url_success.assert_called_once_with(URLs.EXAMPLE_IMAGE_URL)
    mock_requests_get.assert_called_once_with(URLs.MOCK_IMAGE_URL, verify=False)


def test_get_image_failure(client, mock_generate_signed_url_failure):
    response = client.get(URLs.GET_IMAGE_URL)

    assert response.json["status_code"] == StatusCodes.HTTP_STATUS_ERROR
    assert Utils.ERROR_GENERATING_SIGNED_URL.encode() in response.data


def test_get_link_success(client, mock_generate_signed_url_success):
    response = client.get(URLs.GET_LINK_URL)

    assert response.status_code == StatusCodes.HTTP_STATUS_REDIRECT
    assert response.location == URLs.EXPECTED_DOCUMENT_LOCATION

    mock_generate_signed_url_success.assert_called_once_with(URLs.MOCK_DOCUMENT_URL)


def test_get_link_failure(client, mock_generate_signed_url_failure):
    response = client.get(URLs.GET_LINK_URL)

    assert response.json["status_code"] == StatusCodes.HTTP_STATUS_ERROR
    assert Utils.ERROR_GENERATING_SIGNED_URL.encode() in response.data
