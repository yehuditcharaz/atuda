require('dotenv').config();
const { getPool } = require('./sql-connection');

const createRecord = async (obj) => { 
    const { table, columns, values } = obj;
    try {
        let query = `INSERT INTO ${table} (${columns.join(', ')})  VALUES (${values.map(value => typeof value === 'string' && !value.includes("ARRAY") ? `'${value}'` : value).join(', ')}) RETURNING id;`
        const results = await getPool().query(query);

        return results;
    } catch (error) {        
        throw new Error("Error occurred while creating a record:" + error.message);
    }
}

const readRecord = async (obj) => {
    const { table, condition, select } = obj;
    try {
        const query = `SELECT ${select} FROM ${table} WHERE ${condition};`;        
        const results = await getPool().query(query);        
        return results;
        
    } catch (error) {
        throw new Error("Error occurred while fetching data: " + error.message);
    }
}

const updateRecord = async (obj) => {
    const { table, columns, values, condition } = obj;
    try {
        const setValues = columns.map((col, index) => `${col} = ${typeof values[index] === 'string' && !values[index].includes("ARRAY") ? `'${values[index]}'` : values[index]}`).join(', ');
        const query = `UPDATE ${table} SET ${setValues} WHERE ${condition};`;
        const results = await getPool().query(query);
        return results;

    } catch (error) {
        throw new Error("Error occurred while updating data: " + error.message);
    }
}

const deleteRecord = async (obj) => {
    const { table, condition } = obj;
    try {
        const query = `DELETE FROM ${table} WHERE ${condition};`;
        const results = await getPool().query(query);
        return results;
    } catch (error) {
        throw new Error("Error occurred while deleting data: " + error.message);
    }
}

module.exports = {
    createRecord,
    readRecord,
    updateRecord,
    deleteRecord
};

