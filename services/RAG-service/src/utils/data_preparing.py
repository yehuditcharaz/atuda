def is_image_chunk(chunk):
    return "models.image_chunk.ImageChunk" in str(type(chunk))


def is_hebrew(text):
    return any("\u0590" <= letter <= "\u05EA" for letter in text)
