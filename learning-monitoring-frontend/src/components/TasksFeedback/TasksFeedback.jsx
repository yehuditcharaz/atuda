import React, { useEffect, useState } from 'react';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './TasksFeedback.css'
import DynamicTable from '../DynamicTable/DynamicTable';
import { getData } from '../../services/axios';

const TasksFeedback = ({ trainig_student }) => {
    const [data, setData] = useState([]);

    const fetchData = async () => {
        const data = await getData('tasks_feedback/read', { condition: `trainig_student_id=${trainig_student.id}` });
        const tasks = await getData('task/read');
        const updateData = data.data.map(item => {
            return {
                ...item,
                task_id: { id: item.task_id, value: tasks.data.find(task => task.id == item.task_id)?.label },
                date: item.date.slice(0, 10)
            };
        });
        setData(updateData);
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <>
            <div className='tasks-feedback-table'>
                <DynamicTable
                    data={data}
                    tableName='tasks_feedback'
                    routerName='tasks_feedback'
                    disabledColumns={['task_id']}
                />
            </div>

        </>
    );
}

export default TasksFeedback;