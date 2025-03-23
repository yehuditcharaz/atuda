import React, { useContext, useEffect, useState } from 'react';
import { BreadCrumb } from 'primereact/breadcrumb';
import { getData } from "../../services/axios";
import { useNavigate } from 'react-router-dom';
import './SecondaryRouting.css'
import { TaskContext } from '../../contexts/TaskContext/TaskContext';
import { TaskNotesContext } from '../../contexts/TaskNotesContext/TaskNotesContext.jsx';
import { AttachmentsContext } from '../../contexts/AttachmentsContext/AttachmentsContext';

const SecondaryRouting = ({ user, currentPath, student_id, currentLocation, currentIcon, task1 }) => {
    const [userName, setUserName] = useState('');
    const [encodedLabel, setEncodedLabel] = useState('');
    const navigate = useNavigate();
    const {setTask } = useContext(TaskContext);
    const { setTaskNotes } = useContext(TaskNotesContext);
    const { setAttachments } = useContext(AttachmentsContext);

    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const response = await getData('user/read/');
                const userDetails = response.data;

                if (currentPath === `/${user}/personalFile/${student_id}`) {
                    const user = userDetails.find(user => user.id && user.id.toString() === student_id && student_id.toString());

                    if (user) {
                        setUserName(user.name);
                    } else {
                        console.log('User not found with ID:', student_id);
                    }
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserName();
    }, [student_id]);

    useEffect(() => {
        const fetchEncodedLabel = async () => {
            try {
                const task1 = await getData('task/read', { condition: 'id=1' });
                setEncodedLabel((task1.data[0]));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchEncodedLabel();
    }, []);

    const items = [];

    const updateContextTask = async () => {
        if (encodedLabel) {
            const result = await getData('/attachment/read', { condition: `task_id=${encodedLabel.id}` });
            const response = await getData('/taskNotes/read', { condition: `task_id=${encodedLabel.id}` });
            setTaskNotes(response.data.length);
            setAttachments(result.data.length);
            setTask(encodedLabel);
        }
        else {
            setTask(null);
        }
    }

    if (currentLocation === 'מאגרי ידע למשימה') {
        items.push(
            { label: `${currentLocation}`, icon: `${currentIcon}`, className: 'task', command: () => { encodedLabel && encodedLabel.label ? navigate(`/${user}/tasksList/task/${encodedLabel.label}`) : navigate(`/${user}/tasksList`); updateContextTask(); } },
        );
    } else if (currentLocation === 'מעקב התקדמות') {
        items.push(
            { label: `${currentLocation}`, icon: `${currentIcon}`, command: () => navigate(`/${user}/progressTracking`) },
        );
    } else {
        items.push(
            { label: `${currentLocation}`, icon: `${currentIcon}`, command: () => navigate(currentPath) },
        );
    }

    if (task1) {
        items.push(
            { label: task1, visible: task1 !== '', command: () => { navigate(`/${user}/tasksList/task/${task1}`); } }
        );
    }

    if (userName !== '') {
        items.push(
            { label: userName, visible: userName !== '', command: () => navigate(`/${user}/personalFile/${student_id}`) }
        );
    }    const home = { icon: 'pi pi-home', command: () => navigate('/') };

    return (
        <BreadCrumb model={items} home={home} className='bread-crumb' />
    );
}

export default SecondaryRouting;
