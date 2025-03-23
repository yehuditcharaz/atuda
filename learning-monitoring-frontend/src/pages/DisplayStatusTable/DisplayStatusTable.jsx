import React, { useContext, useEffect, useState } from 'react';
import DynamicTable from '../../components/DynamicTable/DynamicTable';
import { getData } from '../../services/axios';
import { UserContext } from '../../contexts/UserContext/UserContext';
import Navigator from '../../components/Navigator/Navigator';
import './DisplayStatusTable.css';

const StatusTable = ({ trainingStudent, role }) => {
    const [data, setData] = useState([]);
    const { user } = useContext(UserContext);

    const fetchData = async (selectedStudent) => {
        try {
            const condition = `trainig_student_id=${selectedStudent.id}`;
            let responseData = await getData('status/read', { condition: condition, select: ['id', 'date', 'start_status', 'end_status'] });
            responseData = responseData.data.map(item => item.date ? { ...item, date: item.date.substring(0, 10) } : item);
            setData(responseData);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        const selectedStudent = trainingStudent === undefined ? user : trainingStudent;
        fetchData(selectedStudent);
    }, []);

    return (
        <>
            {role === 'trainingStudent' ? <Navigator user={role} student_id={trainingStudent ? trainingStudent.id : user.id} /> : ''}
            {data?.length ? <div className="status-table" >
                <DynamicTable
                    data={data}
                    tableName='statuses'
                    routerName='status'
                />
            </div > : ''}
        </>
    );
};

export default StatusTable;
