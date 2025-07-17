import sqlite3
from utils.config import Paths


def DBConnect(query, user_id=""):
    connection = sqlite3.connect(Paths.DB_FILE)
    cursor = connection.cursor()
    cursor.execute(query, user_id)
    result = cursor.fetchall()
    connection.close()
    return result
