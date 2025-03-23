const express = require('express');
const router = express.Router();
const { getColumnNames, getTableName, getEnumValues, getTable } = require('../modules/config');

router.get('/getColumnNames/:tableName', (req, res) => {
    try {
        const { tableName } = req.params;
        const columnNames = getColumnNames(tableName);
        res.status(200).json({ table: tableName, columns: columnNames });
    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred while processing the request' });
    }
});

router.get('/:tableName', (req, res) => {
    try {
        const { tableName } = req.params;
        const hebrewTableName = getTableName(tableName);
        res.status(200).send(hebrewTableName);
    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred while processing the request' });
    }
});

router.get('/getEnumValues/:tableName/:columnName', (req, res) => {    
    try {
        const tableName = req.params.tableName;
        const columnName = req.params.columnName;
        
        const enumValues = getEnumValues(tableName, columnName);        
        res.status(200).json({ table: tableName, values: enumValues });
    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred while processing the request' });
    }
});

router.get('/getTable/:tableName', (req, res) => {
    try {        
        const { tableName } = req.params;
        const table = getTable(tableName);
        res.status(200).send(table);
    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred while processing the request' });
    }
});

module.exports = router;