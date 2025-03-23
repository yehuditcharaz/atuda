const { getPool } = require('../../../services/sql/sql-connection.js');
const { readRecord, createRecord, updateRecord, deleteRecord } = require('../../../services/sql/sql-operations');

jest.mock('../../../services/sql/sql-connection', () => ({
    getPool: jest.fn()
}));

const mockData = [{ id: 1, name: 'Test' }];

describe('Database Operations Tests', () => {
    let mockPool;

    beforeEach(() => {
        mockPool = {
            query: jest.fn().mockResolvedValue({ rows: mockData })
        };
        require('../../../services/sql/sql-connection').getPool.mockReturnValue(mockPool);
    });

    describe('CreateRecord Function', () => {
        it('Should successfully create a record in the database and return results', async () => {
            const mockTable = 'example_table';
            const mockColumns = ['name', 'age'];
            const mockValues = ['John', 25];
            const mockPool = {
                query: jest.fn().mockResolvedValue({ rows: mockData })
            };
            require('../../../services/sql/sql-connection').getPool.mockReturnValue(mockPool);
            const result = await createRecord({ table: mockTable, columns: mockColumns, values: mockValues });

            expect(mockPool.query).toHaveBeenCalledWith(`INSERT INTO ${mockTable} (name, age)  VALUES ('John', 25) RETURNING id;`);

            expect(result.rows).toEqual(mockData);
        });

        it('Should handle missing table name parameter', async () => {
            try {
                await createRecord({ table: '', columns: ['name'], values: ['John'] });
            } catch (error) {
                expect(error.message).toBe("Invalid input parameters for database operation");
            }
        });

        it('Should handle missing columns parameter', async () => {
            try {
                await createRecord({ table: 'example_table', columns: [], values: ['John'] });
            } catch (error) {
                expect(error.message).toBe("Invalid input parameters for database operation");
            }
        });

        it('Should handle missing values parameter', async () => {
            try {
                await createRecord({ table: 'example_table', columns: ['name'], values: [] });
            } catch (error) {
                expect(error.message).toBe("Invalid input parameters for database operation");
            }
        });

        it('Should throw an error if database query fails', async () => {
            const mockError = new Error('Database query failed');

            const mockTable = 'example_table';
            const mockColumns = ['name'];
            const mockValues = ['John'];
            const mockPool = {
                query: jest.fn().mockRejectedValue(mockError)
            };
            require('../../../services/sql/sql-connection').getPool.mockReturnValue(mockPool);

            await expect(createRecord({ table: mockTable, columns: mockColumns, values: mockValues })).rejects.toThrowError('Database query failed');
        });
    });

    describe('ReadRecord Function', () => {
        it('Should successfully fetch data from the database based on condition and return results', async () => {
            const mockTable = 'example_table';
            const mockCondition = 'id = 1';
            const mockSelect = '*'
            const mockPool = {
                query: jest.fn().mockResolvedValue({ rows: mockData })
            };
            require('../../../services/sql/sql-connection').getPool.mockReturnValue(mockPool);
            const result = await readRecord({ table: mockTable, condition: mockCondition, select: mockSelect });

            expect(mockPool.query).toHaveBeenCalledWith(`SELECT * FROM ${mockTable} WHERE ${mockCondition};`);

            expect(result.rows).toEqual(mockData);
        });

        it('Should handle missing parameter', async () => {
            try {
                await readRecord({ table: '', condition: 'id = 1' });
            } catch (error) {
                expect(error.message).toBe("Invalid input parameters for database operation");
            }
        });

        it('Should throw an error if database query fails', async () => {
            const mockError = new Error('Database query failed');

            const mockTable = 'example_table';
            const mockCondition = 'id = 1';
            const mockPool = {
                query: jest.fn().mockRejectedValue(mockError)
            };
            require('../../../services/sql/sql-connection').getPool.mockReturnValue(mockPool);

            await expect(readRecord({ table: mockTable, condition: mockCondition })).rejects.toThrowError('Database query failed');
        });
    });

    describe('UpdateRecord Function', () => {
        it('Should successfully update data in the database and return results', async () => {
            const mockTable = 'example_table';
            const mockColumns = ['name', 'age'];
            const mockValues = ['John', 25];
            const mockCondition = 'id = 1';
            const mockPool = {
                query: jest.fn().mockResolvedValue({ rows: mockData })
            };
            require('../../../services/sql/sql-connection').getPool.mockReturnValue(mockPool);
            const result = await updateRecord({ table: mockTable, columns: mockColumns, values: mockValues, condition: mockCondition });

            expect(mockPool.query).toHaveBeenCalledWith(`UPDATE example_table SET name = 'John', age = 25 WHERE id = 1;`);

            expect(result.rows).toEqual(mockData);
        });

        it('Should handle missing table parameter', async () => {
            try {
                await updateRecord({ table: '', columns: ['name'], values: ['John'], condition: 'id = 1' });
            } catch (error) {
                expect(error.message).toBe("Invalid input parameters for database operation");
            }
        });

        it('Should handle missing columns parameter', async () => {
            try {
                await updateRecord({ table: 'example_table', columns: [], values: ['John'], condition: 'id = 1' });
            } catch (error) {
                expect(error.message).toBe("Invalid input parameters for database operation");
            }
        });

        it('Should throw an error if database query fails', async () => {
            const mockError = new Error('Database query failed');

            const mockTable = 'example_table';
            const mockColumns = ['name'];
            const mockValues = ['John'];
            const mockCondition = 'id = 1';
            const mockPool = {
                query: jest.fn().mockRejectedValue(mockError)
            };
            require('../../../services/sql/sql-connection').getPool.mockReturnValue(mockPool);

            await expect(updateRecord({ table: mockTable, columns: mockColumns, values: mockValues, condition: mockCondition })).rejects.toThrowError('Database query failed');
        });
    });

    describe('DeleteRecord Function', () => {
        it('Should successfully delete data from the database based on condition and return results', async () => {
            const mockTable = 'example_table';
            const mockCondition = 'id = 1';
            const mockPool = {
                query: jest.fn().mockResolvedValue({ rows: mockData })
            };
            require('../../../services/sql/sql-connection').getPool.mockReturnValue(mockPool);
            const result = await deleteRecord({ table: mockTable, condition: mockCondition });

            expect(mockPool.query).toHaveBeenCalledWith(`DELETE FROM example_table WHERE id = 1;`);

            expect(result.rows).toEqual(mockData);
        });

        it('Should handle missing table parameter', async () => {
            try {
                await deleteRecord({ table: '', condition: 'id = 1' });
            } catch (error) {
                expect(error.message).toBe("Invalid input parameters for database operation");
            }
        });

        it('Should handle missing condition parameter', async () => {
            try {
                await deleteRecord({ table: 'example_table', condition: '' });
            } catch (error) {
                expect(error.message).toBe("Invalid input parameters for database operation");
            }
        });

        it('Should throw an error if database query fails', async () => {
            const mockError = new Error('Database query failed');

            const mockTable = 'example_table';
            const mockCondition = 'id = 1';
            const mockPool = {
                query: jest.fn().mockRejectedValue(mockError)
            };
            require('../../../services/sql/sql-connection').getPool.mockReturnValue(mockPool);
            await expect(deleteRecord({ table: mockTable, condition: mockCondition })).rejects.toThrowError('Database query failed');
        });
    });
});

