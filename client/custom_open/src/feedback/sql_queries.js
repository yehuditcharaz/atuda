import sqlite3 from 'sqlite3';
import { Paths } from './config.js';

function DBConnect(query, userId = null) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(Paths.DB_FILE, (err) => {
            if (err) {
                reject(err);
            }
        });

        db.all(query, userId ? userId : [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
            db.close();
        });
    });
}

export { DBConnect };
