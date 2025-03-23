const config = require('../config/config.json');

function getColumnNames(tableName) {
    const tableConfig = config.find(table => table.table_name === tableName);
    if (!tableConfig) {
        return [];
    }
    const columns = tableConfig.columns.map(column => ({
        name: column.name,
        translate: column.translate
    }));
    return columns;
}

function getEnumValues(tableName, columnName) {
    const tableConfig = config.find(table => table.table_name === tableName);
    if (!tableConfig) {
        return [];
    }
    
    const columnConfig = tableConfig.columns.find(column => column.name === columnName);
    if (!columnConfig || !columnConfig.enum_values) {
        return [];
    }
    
    const enumValues = columnConfig.enum_values.map(value => ({
        value: value
    }));
    
    return enumValues;
}


function getTableName(tableName) {
    const tableConfig = config.find(table => table.table_name === tableName);
    if (!tableConfig) {
        return [];
    }
    return tableConfig.translate;
}

function getTable(tableName) {
    const tableConfig = config.find(table => table.table_name === tableName);
    if (!tableConfig) {
        return [];
    }
   
    return tableConfig;
}

module.exports = { getColumnNames, getTableName, getEnumValues, getTable };
