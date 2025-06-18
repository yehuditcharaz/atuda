import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';
import { Paths,  NUMBERS, RECORDS, SqlQueries } from './config.js'; 

import { DBConnect } from './sql_queries.js';

async function createFeedbackReportFromRows(outputPath) {
    const outputDir = path.dirname(outputPath);
    fs.mkdirSync(outputDir, { recursive: true });
    
    const rows = await DBConnect(SqlQueries.FEEDBACK_TABLE);
    const feedbackRecords = await Promise.all(rows.map(async (row) => {
        return parseFeedbackRow(row);
    }));
    if(feedbackRecords[0] == null || undefined){
        return Paths.FEEDBACK_NOT_FOUND;
    }
    await createExcelWorksheet(feedbackRecords, outputPath);
    return outputPath;
}

async function parseFeedbackRow(row) {
    let data, meta, snapshot;
    try {
        data = JSON.parse(row.data);
        meta = JSON.parse(row.meta);
        snapshot = JSON.parse(row.snapshot);
    } catch (e) {
        return {};
    }

    const record = await getRecord(row.user_id, snapshot, data);
    const messagesDict = getMessageDict(snapshot);
    const messageId = meta[RECORDS.MESSAGE_ID];
    const assistantMsg = messagesDict[messageId];
    return updateRecordMessages(record, assistantMsg, messagesDict);
}

async function getRecord(userId, snapshot, data) {
    let result = await DBConnect(SqlQueries.USERNAME, [userId]);
    return {
        [RECORDS.USER_NAME]: result[0].name,
        [RECORDS.RATING]: data[RECORDS.RATING] === NUMBERS.ONE ? RECORDS.V : RECORDS.X,
        [RECORDS.REASON]: data[RECORDS.REASON],
        [RECORDS.COMMENT]: data[RECORDS.COMMENT] || RECORDS.EMPTY,
        [RECORDS.DETAILS_RATING]: data[RECORDS.DETAILS]?.[RECORDS.RATING],
        [RECORDS.TITLE]: snapshot[RECORDS.CHAT]?.[RECORDS.TITLE] || RECORDS.EMPTY,
        [RECORDS.USER_MESSAGE]: RECORDS.EMPTY,
        [RECORDS.ASSISTANT_MESSAGE]: RECORDS.EMPTY,
    };
}

function getMessageDict(snapshot) {
    return snapshot[RECORDS.CHAT]?.[RECORDS.CHAT]?.[RECORDS.HISTORY]?.[RECORDS.MESSAGES] || {};
}

function updateRecordMessages(record, assistantMsg, messagesDict) {
    if (assistantMsg) {
        record[RECORDS.ASSISTANT_MESSAGE] = assistantMsg[RECORDS.CONTENT] || RECORDS.EMPTY;
        const parentId = assistantMsg[RECORDS.PARENT_ID];
        const userMsg = messagesDict[parentId];
        if (userMsg) {
            record[RECORDS.USER_MESSAGE] = userMsg[RECORDS.CONTENT] || RECORDS.EMPTY;
        }
    }
    return record;
}

async function createExcelWorksheet(feedbackRecords, outputPath){
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Feedback Report');
    worksheet.columns = Object.keys(feedbackRecords[0]).map(key => ({ header: key, key }));

    feedbackRecords.forEach(record => {
        worksheet.addRow(record);
    });

    await workbook.xlsx.writeFile(outputPath);
}

export { createFeedbackReportFromRows };
