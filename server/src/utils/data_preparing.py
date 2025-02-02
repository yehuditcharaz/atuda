def is_image_chunk(chunk):
    return "models.image_chunk.ImageChunk" in str(type(chunk))
