const { createRecord, readRecord, updateRecord, deleteRecord } = require("../services/sql/sql-operations");
const table = 'tasks_feedback'
const { createNotification } = require("./notifications");

async function create(data) {
    const obj = { table, columns: Object.keys(data), values: Object.values(data) }
    const validate = true;
    if (validate === true) {
        const response = await createRecord(obj);
        return response;
    }
    return validate
}

async function update(data) {

    const obj = { table, columns: Object.keys(data), values: Object.values(data), condition: `ID =${data.id}` };
    const validate = true;
    if (validate === true) {
        const response = await updateRecord(obj)
        return response
    }
    return validate
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