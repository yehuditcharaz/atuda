import json
from .stub import (
    MockResponses,
    ResponseKeys,
    QueryParameters,
)


def test_chat_success(client, mock_chain_multimodal_rag):
    response = client.post(QueryParameters.ENDPOINT, json=QueryParameters.QUERY_JSON)

    assert response.status_code == MockResponses.STATUS_CODE_SUCCESS
    assert response.json() == {
        ResponseKeys.STATUS_CODE_KEY: MockResponses.STATUS_CODE_SUCCESS,
        ResponseKeys.MOCKED_ANSWER_KEY: MockResponses.ANSWER,
    }


def test_chat_failure(client, mock_chain_with_grpc_error):
    response = client.post(
        QueryParameters.ENDPOINT, json=json.loads(QueryParameters.QUERY_STRING)
    )
    assert (
        response.json()[ResponseKeys.STATUS_CODE_KEY]
        == MockResponses.STATUS_CODE_FAILURE
    )
    assert ResponseKeys.ERROR_KEY in response.json()
    assert response.json()[ResponseKeys.ERROR_KEY] == MockResponses.ERROR


def test_chat_response_structure_success(client, mock_chain_multimodal_rag):
    response = client.post(QueryParameters.ENDPOINT, json=QueryParameters.QUERY_JSON)
    json_data = response.json()
    assert isinstance(json_data, dict)
    assert ResponseKeys.STATUS_CODE_KEY in json_data
    assert isinstance(json_data[ResponseKeys.STATUS_CODE_KEY], int)
    assert ResponseKeys.MOCKED_ANSWER_KEY in json_data
