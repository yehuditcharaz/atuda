const config = require('../../config/config.json');
const { getPool } = require('./sql-connection');

async function sendQuery(query, message) {
    const pool = getPool();    
    
    return await new Promise((resolve, reject) => {
        pool.query(query, (err, res) => {
            if (err) {
                reject(err);
            } else {
                console.log(message);
                resolve(res);
            }
        });
    });
}

async function buildingDBTables() {
    const pool = getPool();
    try {
        for (const table of config) {
            const tableName = table.table_name;
            const fields = table.columns.map(column => {
                if (column.type == 'ENUM' || column.type == "ENUM NOT NULL") {
                    const enumConstraint = `CHECK (${column.name} IN (${column.enum_values.map(value => `'${value}'`).join(', ')}))`;
                    return `${column.name} ${column.enum_type} ${enumConstraint}`;
                } else {
                    return `${column.name} ${column.type}`;
                }
            }).join(', ');

            const createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (${fields});`
            await sendQuery(createTableQuery,`Table ${tableName} created successfully`)
        }
        console.log("All tables created successfully");
        
    } catch (error) {
        console.log("Error creating tables:", error);
    } finally {
        await updateDBTables();
        console.log("finally the initial of the DB");
    }
    
}

async function updateDBTables() {
    const pool = getPool();

    try {
        for (const table of config) {
            const tableName = table.table_name;

            const existingColumns = await new Promise((resolve, reject) => {
                pool.query(`SELECT column_name FROM information_schema.columns WHERE table_name = '${tableName}';`,
                    (err, res) => {
                        if (err) {
                            reject(err);
                        } else {
                            const columns = res.rows.map(row => row.column_name);
                            resolve(columns);
                        }
                    });
            });

            const columnsToAdd = table.columns.filter(column => !existingColumns.includes(column.name));
            const columnsToRemove = existingColumns.filter(col => !table.columns.some(c => c.name === col));

            for (const column of columnsToRemove) {
                const query = `ALTER TABLE ${tableName} DROP COLUMN ${column}`;
                await sendQuery(query, `Column ${column} removed from table ${tableName}`);
            }

            for (const column of columnsToAdd) {
                let query;
                if (column.type === 'ENUM') {
                    const enumConstraint = `CHECK (${column.name} IN (${column.enum_values.map(value => `'${value}'`).join(', ')}))`;
                    query = `ALTER TABLE ${tableName} ADD COLUMN ${column.name} ${column.enum_type} ${enumConstraint}`;
                } else {
                    query = `ALTER TABLE ${tableName} ADD COLUMN ${column.name} ${column.type}`;
                }
                await sendQuery(query, `Column ${column.name} added to table ${tableName}`);
            }
        }
        console.log("Database tables updated successfully");
    } catch (error) {
        console.error("Error updating database tables:", error);
    }
}

module.exports = { buildingDBTables, sendQuery };
