import React, { useState, useEffect, useContext } from 'react';
import { Card } from 'primereact/card';
import { Timeline } from 'primereact/timeline';
import { Button } from 'primereact/button';
import { getData } from '../../services/axios';
import './TaskSequence.css';
import { UserContext } from '../../contexts/UserContext/UserContext';
import DynamicForm from '../../components/DynamicForm/DynamicForm';

function TaskSequence({ progress, trainingStudent }) {
    const [data, setData] = useState([]);
    const { user } = useContext(UserContext);
    const [showForm, setShowForm] = useState(false);
    const [task_id, setTaskId] = useState(null);
    const [formKey, setFormKey] = useState(0);
    
    const fetchData = async () => {
        try {
            const condition = trainingStudent ? trainingStudent.id : user.id;
            progress = progress.filter(row => row.trainig_student_id == condition).map(item => {
                if (item.end_date && item.end_date.includes(":")) {
                    const date = new Date(item.end_date);
                    item.end_date = date.toLocaleDateString('en-GB');
                }
                if (item.start_date && item.start_date.includes(":")) {
                    const date = new Date(item.start_date);
                    item.start_date = date.toLocaleDateString('en-GB');
                }
                return item;
            });
            let feedbacks = await getData('tasks_feedback/read', { condition: `trainig_student_id=${condition}` })
            let response = await getData('task/read');
            response = response.data.sort((a, b) => a.id - b.id);
            const task = response.map((data) => {
                const progressRow = progress.find(obj => obj.task_id === data.id);
                const feedback = feedbacks.data.find(feed => feed.task_id === data.id)
                const doneValue = progressRow?.done;
                return {
                    label: data.label,
                    icon: doneValue ? 'pi pi-check' : 'pi pi-times',
                    color: doneValue ? 'var(--main-color)' : 'var(--gray-color)',
                    start_date: progressRow?.start_date,
                    end_date: progressRow?.end_date,
                    done: doneValue,
                    feedback: feedback ? false : true,
                    task: data.id
                };
            });
            setData(task);
        } catch (error) {
            console.error(error.message);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);


    const customizedMarker = (item) => {
        return (
            <span style={{ backgroundColor: item.color }}>
                <i className={item.icon}></i>
            </span>
        );
    };

    const addFeedback = (task) => {
        setTaskId(task)
        setShowForm(true);
        setFormKey(prevKey => prevKey + 1);
    };

    const customizedContent = (item) => {
        return (
            <div>
                <Card title={item.label}>
                    {item.start_date ? <p ><i className='pi pi-calendar'></i> תאריך התחלה: {item.start_date}</p> : ''}
                    {item.end_date ? <p ><i className='pi pi-calendar'></i> תאריך סיום: {item.end_date}</p> : ''}
                    {item.done && user.role == 'מוכשרת' && item.feedback && <Button className='add-feedback' label='הוספת משוב' onClick={() => addFeedback(item.task)}></Button>}
                </Card>
            </div>
        );
    };

    return (
        <div className='wrap'>
            <Timeline value={data} className="customized-timeline" align="left" marker={customizedMarker} content={customizedContent} />
            {showForm ? <DynamicForm key={formKey} table_name={'tasks_feedback'} fetchData={fetchData} route_name={'tasks_feedback'} initializeFormData={{task_id: task_id}}></DynamicForm> : ''}
        </div>
    );
}

export default TaskSequence;
