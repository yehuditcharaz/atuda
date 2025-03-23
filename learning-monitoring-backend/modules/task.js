const { createRecord, readRecord, updateRecord, deleteRecord } = require("../services/sql/sql-operations");
const table = 'tasks'
const validation = require("../services/validation")
const { createNotification } = require("./notifications")


async function create(data) {
    const obj = { table, columns: Object.keys(data), values: Object.values(data) }
    const validate = validation.validateTasksTable(data, 'create');
    if (Object.values(validate).every(item => item === "")) {
        const response = await createRecord(obj);
        const notificationData = {}
        notificationData.table = table
        notificationData.users = [
            { role: 'מנטור', link: `/mentor/tasksList/task/${data.label}` },
            { role: 'מנהל', link: `/manager/tasksList/task/${data.label}` }
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
    const obj = { table, columns: Object.keys(data.data), values: Object.values(data.data), condition: `ID =${data.data.id}` };
    const validate = validation.validateTasksTable(data, "update")
    if (Object.values(validate).every(item => item === "")) {
        const response = await updateRecord(obj);
        return response.rows[0];
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