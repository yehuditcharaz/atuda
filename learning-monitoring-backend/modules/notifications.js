const { createRecord, readRecord, deleteRecord } = require("../services/sql/sql-operations");
const table = 'notifications'
const config = require("../config/config.json")

async function createNotification(data) {
  const responses = []
  const content = data.content ? data.content : config.find(obj => obj.table_name == data.table).notification_content
  for (const user of data.users) {
    let message = { content: content, link: user.link, date: `${new Date().toLocaleDateString('en-GB')}  ${new Date().toLocaleTimeString('he-IL', { timeZone: 'Asia/Jerusalem' })}` };
    user.user_id ? message.user_id = user.user_id : message.role = user.role;
    const obj = { table: 'notifications', columns: Object.keys(message), values: Object.values(message) };
    const validate = true;
    if (validate === true) {
      const response = await createRecord(obj);
      message.id = response.rows[0].id
      responses.push(message);
    }
    else
      return validate
  }
  return responses;
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

module.exports = { createNotification, read, deleteRow };