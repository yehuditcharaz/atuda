const { createRecord, readRecord, updateRecord, deleteRecord } = require("../services/sql/sql-operations");
const table = 'general_informations'
const validation = require("../services/validation")
const { createNotification } = require("./notifications")

async function create(data) {

    const obj = { table, columns: Object.keys(data), values: Object.values(data) }
    const validate = validation.validateGeneralInformationTable(data, "create")
    if (Object.values(validate).every(item => item === "")) {
        const response = await createRecord(obj);
        const notificationData = {}
        notificationData.table = table
        notificationData.users = [
            { role: data.information_for, link: `/${data.information_for === 'מנטור' ? 'mentor' : 'trainingStudent'}/generalInformation` }
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
    const validate = validation.validateGeneralInformationTable(data, "update");
    if (Object.values(validate).every(item => item === "")) {
        const response = await updateRecord(obj);
        return response;
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