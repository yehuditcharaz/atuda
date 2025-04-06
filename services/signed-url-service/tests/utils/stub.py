class HebrewCharacters:
    FIRST_LETTER = "א"
    SECOND_LETTER = "ב"
    BOUNDARY_LETTER = "\u05ea"


class HebrewStrings:
    HEBREW = "שלום"
    HEBREW_AND_ENGLISH = "שלום hello"
    HEBREW_AND_NUMBERS = "שלום 123"


class NonHebrewCharacters:
    CAPITAL_A = "A"
    SMALL_A = "a"
    SPACE = " "
    EXCLAMATION_MARK = "!"


class DifferenceLanguage:
    ARAB = "أبا"
    RUSSIAN = "Да, да"
    FRENCH = "Paix à la mère"
    GIBRISH = "សន្តិភាពដល់ម្តាយ"


class NonHebrewBoundaryCharacters:
    BOUNDARY_COMMA = "\u058f"
    BOUNDARY_QUESTION_MARK = "\u05eb"


class NonStringValues:
    INTEGER_VALUE = 123
    FLOAT_VALUE = 12.34
    NONE_VALUE = None
    EMPTY_LIST = []
    EMPTY_DICT = {}
    EMPTY_SET = set()
    BOOLEAN_TRUE = True
