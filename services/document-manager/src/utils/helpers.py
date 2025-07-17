import unicodedata


def is_hebrew(string):
    if isinstance(string, str):
        return any(
            (
                unicodedata.name(char).startswith("HEBREW")
                if unicodedata.category(char) in ["Lo", "Lm"]
                else False
            )
            for char in string
        )
    return False
