require('dotenv').config();
const config = require('../../config/config');
const { getPool } = require('./sql-connection');
const { sendQuery } = require('./sql-init');
const { createRecord } = require('./sql-operations');
async function deleteDBTable(tableName) {
    try {
        const deleteTableQuery = `DROP TABLE IF EXISTS ${tableName};`;
        await sendQuery(deleteTableQuery, `Table ${tableName} deleted successfully`);
    } catch (error) {
        console.log("Error deleting table:", error);
    }
}

async function deleteDBTableData(tableName) {
    try {
        const deleteTableQuery = `DO $$
BEGIN
IF EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = '${tableName}') THEN
    EXECUTE 'TRUNCATE TABLE ${tableName}';
END IF;
END $$;`;
        await sendQuery(deleteTableQuery, `Data in the table ${tableName} has been successfully deleted.`);
    } catch (error) {
        console.log("Error deleting table:", error);
    }
}

async function deleteAllDBTables() {
    try {
        const tablesToDelete = config.map(table => table.table_name);
        for (const tableName of tablesToDelete) {
            await deleteDBTable(tableName);
        }
        console.log("All tables deleted successfully");
    } catch (error) {
        console.log("Error deleting tables:", error);
    }
}

async function deleteAllData() {
    try {
        const tablesToDelete = config.map(table => table.table_name);
        for (const tableName of tablesToDelete) {
            await deleteDBTableData(tableName);
        }
        console.log("All data deleted successfully");
    } catch (error) {
        console.log("Error deleting tables:", error);
    }
}

async function createManager() {
    try {
        const managerObj  = {
            name:process.env.MANAGER_NAME,
            password: process.env.MANAGER_PASSWORD,
            email:process.env.MANAGER_EMAIL,
            phone:process.env.MANAGER_PHONE,
            user_name:process.env.MANAGER_USERNAME,
            role:'מנהל'
            };
        await createRecord({table:'users',columns:Object.keys(managerObj),values:Object.values(managerObj)});
        console.log('Manger data inserted successfully');
    } catch (error) {
        console.error('Error inserting data:', error);
    }
}
module.exports = { deleteAllDBTables,deleteAllData, createManager }