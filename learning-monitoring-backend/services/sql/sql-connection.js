require('dotenv').config();
const { Pool } = require('pg');

let pool = null;

function  connectSql() {
    
    pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    });
    return pool.connect()
        .then(client => {
            console.log('Connected to the database');
            client.release();
        })
        .catch(error => {
            console.error('Error connecting to the database:', error);
        });
        
}
function getPool() {
    return pool;
}

module.exports = { getPool, connectSql };