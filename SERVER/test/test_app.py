# import os
# import pytest
# from src.app import app

# @pytest.fixture
# def client():
#     with app.test_client() as client:
#         yield client

# def test_index(client):
#     """Test the /api route"""
#     response = client.get('/api')
#     assert response.status_code == 200
#     assert response.data.decode() == "matchPoint"

# def test_environment_variables():
#     """Test if environment variables are correctly loaded"""
#     assert os.getenv("HOST") is not None
#     assert os.getenv("PORT") is not None

# TODO: Reconcile with the updated code