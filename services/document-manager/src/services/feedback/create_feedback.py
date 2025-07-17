import json
import pandas as pd
from pathlib import Path
from utils.config import NUMBERS, Errors, RECORDS, SqlQueries
from services.feedback.sql_queries import DBConnect


async def create_feedback_report_from_rows(output_path):
    rows = DBConnect(SqlQueries.FEEDBACK_TABLE)
    if not rows:
        return Errors.FEEDBACK_NOT_FOUND
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    feedback_records = [
        parsed_row for row in rows if (parsed_row := parse_feedback_row(row))
    ]
    df = pd.DataFrame(feedback_records)
    output_file = Path(output_path)
    df.to_excel(output_file, index=False)
    return output_file


def parse_feedback_row(row):
    (
        _,
        user_id,
        _,
        _,
        data_str,
        meta_str,
        snapshot_str,
        _,
        _,
    ) = row

    try:
        data = json.loads(data_str)
        meta = json.loads(meta_str)
        snapshot = json.loads(snapshot_str)
    except json.JSONDecodeError:
        return {}

    record = get_record(user_id, snapshot, data)
    messages_dict = get_message_dict(snapshot)
    message_id = meta.get(RECORDS.MESSAGE_ID)
    assistant_msg = messages_dict.get(message_id)
    record = update_record_messages(record, assistant_msg, messages_dict)
    return record


def get_record(user_id, snapshot, data):
    record = {
        RECORDS.USER_NAME: list(
            DBConnect(SqlQueries.USERNAME, (user_id,))[NUMBERS.ZERO]
        )[NUMBERS.ZERO],
        RECORDS.RATING: RECORDS.V
        if data.get(RECORDS.RATING) == NUMBERS.ONE
        else RECORDS.X,
        RECORDS.REASON: data.get(RECORDS.REASON),
        RECORDS.COMMENT: data.get(RECORDS.COMMENT, RECORDS.EMPTY),
        RECORDS.DETAILS_RATING: data.get(RECORDS.DETAILS, {}).get(RECORDS.RATING),
        RECORDS.TITLE: snapshot.get(RECORDS.CHAT, {}).get(RECORDS.TITLE, RECORDS.EMPTY),
        RECORDS.USER_MESSAGE: RECORDS.EMPTY,
        RECORDS.ASSISTANT_MESSAGE: RECORDS.EMPTY,
    }
    return record


def get_message_dict(snapshot):
    messages_dict = (
        snapshot.get(RECORDS.CHAT, {})
        .get(RECORDS.CHAT, {})
        .get(RECORDS.HISTORY, {})
        .get(RECORDS.MESSAGES, {})
    )
    return messages_dict


def update_record_messages(record, assistant_msg, messages_dict):
    if assistant_msg:
        record[RECORDS.ASSISTANT_MESSAGE] = assistant_msg.get(
            RECORDS.CONTENT, RECORDS.EMPTY
        )
        parent_id = assistant_msg.get(RECORDS.PARENT_ID)
        user_msg = messages_dict.get(parent_id)
        if user_msg:
            record[RECORDS.USER_MESSAGE] = user_msg.get(RECORDS.CONTENT, RECORDS.EMPTY)
    return record
