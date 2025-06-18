class MockResponses:
    ANSWER = "This is a mocked answer"
    ERROR = "Mocked RPC error"
    STATUS_CODE_SUCCESS = 200
    STATUS_CODE_FAILURE = 500


class QueryParameters:
    QUERY_STRING = '{"key": "value"}'
    QUERY_JSON = {"key": "value"}
    QUERY_PARAM = "query"
    ENDPOINT = "/chat"


class ResponseKeys:
    STATUS_CODE_KEY = "status_code"
    ERROR_KEY = "error"
    MOCKED_ANSWER_KEY = "mocked_answer"


class MockChainResponses:
    CHAIN_MULTIMODAL_RAG = {ResponseKeys.MOCKED_ANSWER_KEY: MockResponses.ANSWER}
    CHAIN_WITH_GRPC_ERROR = {
        ResponseKeys.ERROR_KEY: MockResponses.ERROR,
        ResponseKeys.STATUS_CODE_KEY: MockResponses.STATUS_CODE_FAILURE,
    }
