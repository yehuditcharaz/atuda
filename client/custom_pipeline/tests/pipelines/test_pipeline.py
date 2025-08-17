import json

from pipelines.pipeline import Pipeline, convert_to_md, get_chat_response
from .stub import Responses, SystemMessagesTest, UtilsTest


def test_pipe_success(mock_get_chat_response_success):
    pipeline = Pipeline()
    history_json = json.dumps({"messages": UtilsTest.HISTORY})
    result = pipeline.pipe(
        UtilsTest.USER_MESSAGE,
        UtilsTest.MODEL_NAME,
        UtilsTest.HISTORY,
        UtilsTest.EMPTY_BODY,
    )
    assert Responses.SUCCESS_RESPONSE["answer"] in result
    assert Responses.SUCCESS_RESPONSE["links"][0] in result
    assert Responses.SUCCESS_RESPONSE["images"][0] in result
    mock_get_chat_response_success.assert_called_once_with(pipeline, history_json)


def test_pipe_failure(mock_get_chat_response_exception):
    pipeline = Pipeline()
    result = pipeline.pipe(
        UtilsTest.USER_MESSAGE,
        UtilsTest.MODEL_NAME,
        UtilsTest.EMPTY_MESSAGES,
        UtilsTest.EMPTY_BODY,
    )
    assert result == SystemMessagesTest.ERROR_MESSAGE
    mock_get_chat_response_exception.assert_called_once()


def test_get_chat_response_success(mock_pipeline, mock_requests_post):
    result = get_chat_response(mock_pipeline, f"{UtilsTest.EMPTY_BODY}")
    assert result == Responses.SUCCESS_RESPONSE


def test_get_chat_response_failure(mock_get_chat_response_server_failure):
    pipeline = Pipeline()
    result = pipeline.pipe(
        UtilsTest.USER_MESSAGE,
        UtilsTest.MODEL_NAME,
        UtilsTest.EMPTY_MESSAGES,
        UtilsTest.EMPTY_BODY,
    )
    assert result == SystemMessagesTest.SERVER_FAILURE_MESSAGE
    mock_get_chat_response_server_failure.assert_called_once()


def test_convert_to_md_success():
    result = convert_to_md(Responses.SUCCESS_RESPONSE)
    assert Responses.SUCCESS_RESPONSE["answer"] in result
    assert Responses.SUCCESS_RESPONSE["links"][0] in result
    assert Responses.SUCCESS_RESPONSE["images"][0] in result


def test_convert_to_md_failure():
    result = convert_to_md(None)
    assert SystemMessagesTest.ERROR_MESSAGE in result
