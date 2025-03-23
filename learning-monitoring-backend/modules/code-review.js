const { createRecord, readRecord, updateRecord, deleteRecord } = require("../services/sql/sql-operations");
const table = 'code_reviews'
const validation = require("../services/validation")
const { createNotification } = require("./notifications")

async function create(data) {
    const { link, ...rest } = data
    const obj = { table, columns: Object.keys(rest), values: Object.values(rest) }
    const validate = validation.validateCodeReviewsTable(data, "create")
    if (Object.values(validate).every(item => item === "")) {
        const response = await createRecord(obj)

        const notificationData = {}
        notificationData.table = table
        notificationData.users = [
            { role: 'מנטור', link: `/mentor/tasksList/task/${link}` },
            { role: 'מנהל', link: `/manager/tasksList/task/${link}` }
        ]
        const messageResponse = await createNotification(notificationData);
        return { table: response.rows[0], notifications: messageResponse };
    }
    else {
        Object.keys(validate).forEach(value => validate[value] !== "" ? console.log(`${value} : ${validate[value]}`) : null);
        return false;
    }
}

async function update(data) {
    const obj = { table, columns: Object.keys(data), values: Object.values(data), condition: `ID =${data.id}` };
    const validate = validation.validateCodeReviewsTable(data, "update")
    if (Object.values(validate).every(item => item === "")) {
        const response = await updateRecord(obj)
        return response
    }
    else {
        Object.keys(validate).forEach(value => validate[value] !== "" ? console.log(`${value} : ${validate[value]}`) : null);
        return false;
    }
}

async function read(data) {
    const obj = { table, select: data.select === undefined ? "*" : data.select, condition: data.condition === undefined ? "1=1" : data.condition }
    const response = await readRecord(obj)
    return response
}

async function deleteRow(data) {
    const obj = { table, condition: `ID =${data.id}` }
    const response = await deleteRecord(obj)
    return response
}

module.exports = { create, read, update, deleteRow };