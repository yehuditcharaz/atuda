from services.extraction import (
    get_chunks,
    get_document_chunks,
    get_files_pathes,
)

from .stub import TextChunks, ImageChunks


def test_get_chunks_success(
    patch_extraction_dependencies,
    mock_get_files_pathes,
    mock_partition_pdf,
    mock_encode_image,
    mock_config_extraction,
    mock_chunks,
):
    chunks = get_chunks()
    assert isinstance(chunks, list)
    for c in chunks:
        print(type(c))
    assert any(isinstance(c, TextChunks.MockTextChunk) for c in chunks)
    assert any(isinstance(c, ImageChunks.MockImageChunk) for c in chunks)


def test_get_chunks_exception(
    patch_extraction_dependencies,
    mock_get_files_pathes,
    mock_config_extraction,
    mock_logger,
):
    result = get_chunks()
    assert result is None
    print(mock_logger)
    print(mock_logger.error)
    assert mock_logger.error.called
    assert "failure" in str(mock_logger.error.call_args[0][0])


def test_get_files_pathes(patch_extraction_dependencies, tmp_path):
    file1 = tmp_path / "a.txt"
    file2 = tmp_path / "b.txt"
    file1.write_text("1")
    file2.write_text("2")

    paths = get_files_pathes(str(tmp_path))
    assert len(paths) == 2
    assert any("a.txt" in p for p in paths)
    assert any("b.txt" in p for p in paths)


def test_get_document_chunks(patch_extraction_dependencies, mock_partition_pdf):
    dummy_path = "/docs/doc1.pdf"
    result = get_document_chunks(dummy_path)
    mock_partition_pdf.assert_called_with(
        filename=dummy_path,
        strategy="hi_res",
        extract_images_in_pdf=False,
        extract_image_block_to_payload=False,
        infer_table_structure=True,
        chunking_strategy="by_title",
        max_characters=4000,
        new_after_n_chars=3800,
        combine_text_under_n_chars=2000,
        unique_element_ids=True,
    )
    assert isinstance(result, list)
