import pytest
import sys
from unittest.mock import MagicMock
from fastapi.testclient import TestClient  # <-- FastAPI TestClient

from .stub import MockChainResponses


@pytest.fixture
def client():
    from routes.chat import app

    with TestClient(app) as c:  # <-- שימוש ב-TestClient
        yield c


@pytest.fixture(autouse=True)
def patch_chain_module_dependencies(monkeypatch):
    monkeypatch.setitem(sys.modules, "services.chain_multimodal.chain", MagicMock())


@pytest.fixture
def mock_chain_multimodal_rag(monkeypatch):
    mock_chain = MagicMock()
    mock_chain.with_retry.return_value.invoke.return_value = (
        MockChainResponses.CHAIN_MULTIMODAL_RAG
    )
    monkeypatch.setattr("routes.chat.chain_multimodal_rag", mock_chain)
    return mock_chain


@pytest.fixture
def mock_chain_with_grpc_error(monkeypatch):
    mock_chain = MagicMock()
    mock_chain.with_retry.return_value.invoke.return_value = (
        MockChainResponses.CHAIN_WITH_GRPC_ERROR
    )
    monkeypatch.setattr("routes.chat.chain_multimodal_rag", mock_chain)
    return mock_chain
