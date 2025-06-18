from utils.dictionary import dictionary
from .stub import Dictionary


def test_dictionary_contains_expected_keys():
    for key in Dictionary.EXPECTED_KEYS:
        assert key in dictionary


def test_dictionary_contains_expected_values():
    for key, expected_value in Dictionary.EXPECTED_VALUES.items():
        assert dictionary[key] == expected_value


def test_dictionary_no_duplicate_keys():
    assert len(dictionary) == len(set(dictionary.keys()))


def test_dictionary_non_existent_key():
    assert Dictionary.NONE_EXISTENT_KEY not in dictionary
