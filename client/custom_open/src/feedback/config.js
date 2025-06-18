import dotenv from 'dotenv';
dotenv.config();

class APP {
    static ERROR = 404;
    static HOST = "0.0.0.0";
    static PORT = 5454;
    static ACCESS_URL = process.env.ACCESS_URL;
}

class NUMBERS {
    static ONE = 1;
    static ZERO = 0;
}

class Paths {
    static DB_FILE = "../app/backend/data/webui.db";
    static DIRECTORY = "/app";
    static EXCEL_FILE = "./output/feedback_report.xlsx";
    static NOT_FOUND = "File not found";
    static ROUTE = "/download/feedback-report";
    static FEEDBACK_NOT_FOUND = "no feedback found";
}

class SqlQueries {
    static FEEDBACK_TABLE = "SELECT * FROM feedback;";
    static USERNAME = "SELECT name FROM user WHERE id = ?;";
}

class RECORDS {
    static ASSISTANT_MESSAGE = "assistant_message";
    static CHAT = "chat";
    static COMMENT = "comment";
    static CONTENT = "content";
    static DETAILS = "details";
    static DETAILS_RATING = "details_rating";
    static EMPTY = "";
    static HISTORY = "history";
    static MESSAGES = "messages";
    static MESSAGE_ID = "message_id";
    static PARENT_ID = "parentId";
    static RATING = "rating";
    static REASON = "reason";
    static TITLE = "title";
    static USER_MESSAGE = "user_message";
    static USER_NAME = "user_name";
    static V = "V";
    static X = "X";
}

export { APP, NUMBERS, Paths, SqlQueries, RECORDS };
