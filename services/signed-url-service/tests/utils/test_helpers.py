from utils.helpers import is_hebrew

from .stub import (
    HebrewCharacters,
    HebrewStrings,
    NonHebrewCharacters,
    DifferenceLanguage,
    NonHebrewBoundaryCharacters,
    NonStringValues,
)


def test_hebrew_characters():
    assert is_hebrew(HebrewCharacters.FIRST_LETTER)
    assert is_hebrew(HebrewCharacters.SECOND_LETTER)
    assert is_hebrew(HebrewCharacters.BOUNDARY_LETTER)


def test_hebrew_strings():
    assert is_hebrew(HebrewStrings.HEBREW)
    assert is_hebrew(HebrewStrings.HEBREW_AND_ENGLISH)
    assert is_hebrew(HebrewStrings.HEBREW_AND_NUMBERS)


def test_non_hebrew_characters():
    assert not is_hebrew(NonHebrewCharacters.CAPITAL_A)
    assert not is_hebrew(NonHebrewCharacters.SMALL_A)
    assert not is_hebrew(NonHebrewCharacters.SPACE)
    assert not is_hebrew(NonHebrewCharacters.EXCLAMATION_MARK)


def test_different_langueges():
    assert not is_hebrew(DifferenceLanguage.ARAB)
    assert not is_hebrew(DifferenceLanguage.RUSSIAN)
    assert not is_hebrew(DifferenceLanguage.FRENCH)
    assert not is_hebrew(DifferenceLanguage.GIBRISH)


def test_not_hebrew_boundary_characters():
    assert not is_hebrew(NonHebrewBoundaryCharacters.BOUNDARY_COMMA)
    assert not is_hebrew(NonHebrewBoundaryCharacters.BOUNDARY_QUESTION_MARK)


def test_non_string_values():
    assert not is_hebrew(NonStringValues.INTEGER_VALUE)
    assert not is_hebrew(NonStringValues.FLOAT_VALUE)
    assert not is_hebrew(NonStringValues.NONE_VALUE)
    assert not is_hebrew(NonStringValues.EMPTY_LIST)
    assert not is_hebrew(NonStringValues.EMPTY_DICT)
    assert not is_hebrew(NonStringValues.EMPTY_SET)
    assert not is_hebrew(NonStringValues.BOOLEAN_TRUE)
