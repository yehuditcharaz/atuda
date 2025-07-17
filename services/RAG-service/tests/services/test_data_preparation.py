from .stub import Utils


def test_data_preparing(
    patch_services_retriever,
    mock_get_chunks,
    mock_set_summaries,
    mock_store_data,
):
    from services.data_preparation import data_preparing

    none_response = data_preparing(
        Utils.BUCKET_NAME, Utils.FILE_LIST, Utils.FOLDER_NAME, Utils.LOCAL_DIRECTORY
    )
    assert not none_response
