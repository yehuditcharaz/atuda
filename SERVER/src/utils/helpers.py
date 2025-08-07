import os
import re


def ensure_directory_exist(directory_path):
    os.makedirs(directory_path, exist_ok=True)

def convert_inner_quotes(text):
    matches = list(re.finditer(r'"', text))
    if len(matches) < 2:
        return text

    first_quote_idx = matches[0].start()
    last_quote_idx = matches[-1].start()

    before_first = text[:first_quote_idx + 1] 
    middle = text[first_quote_idx + 1:last_quote_idx]
    after_last = text[last_quote_idx:] 

    middle_fixed = middle.replace('"', "'")

    return f"{before_first}{middle_fixed}{after_last}"
