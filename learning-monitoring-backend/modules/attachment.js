const fs = require('fs');
const { createRecord, readRecord, updateRecord, deleteRecord } = require("../services/sql/sql-operations");
const table = 'attachments'
const validation = require("../services/validation")
const { createNotification } = require("./notifications")


async function create(formData) {
    const data = {
        ...formData.body,
        file: formData.file.path
    };
    const { link, ...rest } = data
    const filePath = rest.file
    const fileBoffer = fs.readFileSync(filePath)
    const fileHex = fileBoffer.toString('hex')
    dataWithConvertedFile = { ...rest, file: fileHex }
    const obj = { table, columns: Object.keys(dataWithConvertedFile), values: Object.values(dataWithConvertedFile) }
    const validate = validation.validateAttachmentsTable(data, "create")
    if (Object.values(validate).every(item => item === "")) {
        const response = await createRecord(obj)

        const notificationData = {}
        notificationData.table = table
        notificationData.users = [
            { role: 'מנטור', link: link },
            { role: 'מנהל', link: link }
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
    const validate = validation.validateAttachmentsTable(data, "update")
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
    const newResponse = response.rows.map((e) => {
        return {
            ...e, file: Buffer.from(e.file, 'hex').toString().split('').reduce((arr, item, index, origin) => {
                if (index % 2 === 0) {
                    const str = item.toString() + origin[index + 1].toString()
                    arr.push(parseInt(str, 16))
                }
                return arr
            }, [])
        };
    })
    return newResponse
}

async function deleteRow(data) {
    const obj = { table, condition: `ID =${data.id}` }
    const response = await deleteRecord(obj)
    return response
}

module.exports = { create, read, update, deleteRow };