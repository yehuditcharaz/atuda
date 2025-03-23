const { createRecord, readRecord, updateRecord, deleteRecord } = require("../services/sql/sql-operations");
const table = 'statuses'
const validation = require("../services/validation")
const { sendMail } = require('../services/utils/mail')

async function create(data) {
    const { email, ...rest } = data
    //  sendMail({ recipient: email, subject: 'status start day ', body: rest })
    const obj = { table, columns: Object.keys(rest), values: Object.values(rest) }
    const validate = validation.validateStatusesTable(data, "create");
    if (Object.values(validate).every(item => item === "")) {
        const response = await createRecord(obj)
        return response.rows[0];
    }
    else {
        Object.keys(validate).forEach(value => validate[value] !== "" ? console.log(`${value} : ${validate[value]}`) : null);
        return false;
    }
}

async function update(data) {
    const { email, ...rest } = data.set
    const obj = { table, columns: Object.keys(rest), values: Object.values(rest), condition: data.condition }
    //  sendMail({ recipient: email, subject: 'status end day', body: rest })
    const validate = validation.validateStatusesTable(data, "update")
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