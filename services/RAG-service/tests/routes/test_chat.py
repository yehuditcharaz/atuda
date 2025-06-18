import json
from .stub import (
    MockResponses,
    ResponseKeys,
    QueryParameters,
)


def test_chat_success(client, mock_chain_multimodal_rag):
    response = client.get(
        QueryParameters.ENDPOINT,
        query_string={
            QueryParameters.QUERY_PARAM: json.dumps(QueryParameters.QUERY_JSON)
        },
    )

    assert response.status_code == MockResponses.STATUS_CODE_SUCCESS
    assert response.json == {
        ResponseKeys.STATUS_CODE_KEY: MockResponses.STATUS_CODE_SUCCESS,
        ResponseKeys.MOCKED_ANSWER_KEY: MockResponses.ANSWER,
    }


def test_chat_failure(client, mock_chain_with_grpc_error):
    response = client.get(
        QueryParameters.ENDPOINT,
        query_string={QueryParameters.QUERY_PARAM: QueryParameters.QUERY_STRING},
    )
    assert (
        response.json[ResponseKeys.STATUS_CODE_KEY] == MockResponses.STATUS_CODE_FAILURE
    )
    assert ResponseKeys.ERROR_KEY in response.json
    assert response.json[ResponseKeys.ERROR_KEY] == MockResponses.ERROR


def test_chat_response_structure_success(client, mock_chain_multimodal_rag):
    response = client.get(
        QueryParameters.ENDPOINT,
        query_string={
            QueryParameters.QUERY_PARAM: json.dumps(QueryParameters.QUERY_JSON)
        },
    )
    assert isinstance(response.json, dict)
    assert ResponseKeys.STATUS_CODE_KEY in response.json
    assert isinstance(response.json[ResponseKeys.STATUS_CODE_KEY], int)
    assert ResponseKeys.MOCKED_ANSWER_KEY in response.json
