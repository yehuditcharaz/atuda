import React, { useState, useContext, useEffect, useRef } from 'react';
import { getData, postData } from '../../services/axios';
import { UserContext } from '../../contexts/UserContext/UserContext';
import PersonalTable from '../../components/PersonalTable/PersonalTable';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { useNavigate } from "react-router-dom";

const FinishTask = (trainingStudent) => {

    const [config, setConfig] = useState();
    const [trainingStudents, setTrainingStudents] = useState()
    const [expandedUserId, setExpandedUserId] = useState()
    const [progressData, setProgressData] = useState();
    const { user } = useContext(UserContext);
    const toast = useRef(null);
    const navigate = useNavigate();

    const changeFormatDate = (value, type) => {
        let formattedDate;
        if (type == 'string') {
            const [day, month, year] = value.split('/');
            formattedDate = `${year}-${month}-${day}`;
        }
        else {
            const date = new Date(value);
            const year = date.getUTCFullYear();
            const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
            const day = date.getUTCDate().toString().padStart(2, '0');
            formattedDate = `${year}-${month}-${day}`;
        }
        return formattedDate;
    }

    const getCurrentDate = () => {
        const currentDate = new Date().toLocaleDateString('en-GB');
        return changeFormatDate(currentDate, 'string');
    }

    const addRow = async (finishedTask) => {
        const mentorId = trainingStudents.filter(training => training.id === finishedTask.trainig_student_id)[0].mentor_id;
        const data = {
            "trainig_student_id": finishedTask.trainig_student_id,
            "mentor_id": mentorId,
            "task_id": finishedTask.task_id + 1,
            "start_date": getCurrentDate(),
            "done": false
        }
        await postData('progress_trackings/create', data)

        if (data.mentor_id != finishedTask.mentor_id) {
            toast.current.show({ severity: 'info', summary: 'שימי לב', detail: 'המנטורית של המשימה החדשה שונה מהמנטורית של המשימה הקודמת' });
        }
    }

    const pressingIcon = async (value) => {
        if (value) toast.current.show({ severity: 'warn', summary: 'אזהרה', detail: 'פעולה זו תקצה למוכשרת משימה חדשה, אנא וודאי לפני האישור' });
        else toast.current.show({ severity: 'warn', summary: 'אזהרה', detail: 'פעולה זו תחזיר את המשימה למצב פיתוח, אנא וודאי לפני האישור' });

    };

    const funcSave = async (value, row_data) => {
        const task_id = row_data.task_id;
        if (value) {
            let finishedTask = progressData.find(obj => obj.id === row_data.id);
            const taskName = finishedTask.task_id.value ? finishedTask.task_id.value : finishedTask.task_id
            finishedTask = { ...finishedTask, task_id: finishedTask.task_id.id ? finishedTask.task_id.id : finishedTask.task_id, mentor_id: finishedTask.mentor_id.id ? finishedTask.mentor_id.id : finishedTask.mentor_id }
            row_data['done'] = true;
            row_data['end_date'] = getCurrentDate();
            await postData('progress_trackings/update', row_data);
            const taskData = await getData('task/read')
            const nextTask = taskData.data.find(obj => obj.id === finishedTask.task_id + 1)
            if (task_id == progressData.length && nextTask) {
                await addRow(finishedTask)
                toast.current.show({ severity: 'success', summary: 'אישור', detail: ` המוכשרת ${trainingStudent.trainingStudent.name} סיימה את משימה ${taskName} בהצלחה ניתן לעבור למשימה הבאה ` })
            }
            else
                if (task_id == progressData.length && nextTask == undefined) {
                    toast.current.show({ severity: 'success', summary: 'אישור', detail: ` המוכשרת ${trainingStudent.trainingStudent.name} סיימה בהצלחה את כלל המשימות!` })
                }
            fetchData()

        }
        else {
            let restoredTask = progressData.find(obj => (obj.task_id.id ? obj.task_id.id : obj.task_id) === task_id);
            const taskName = restoredTask.task_id.value ? restoredTask.task_id.value : restoredTask.task_id
            restoredTask = { ...restoredTask, task_id: restoredTask.task_id.id ? restoredTask.task_id.id : restoredTask.task_id, mentor_id: restoredTask.mentor_id.id ? restoredTask.mentor_id.id : restoredTask.mentor_id }
            restoredTask['done'] = false
            restoredTask['end_date'] = null
            console.log(restoredTask);
            const answer = await postData('progress_trackings/update', restoredTask)
            if (answer.status == 200) {
                fetchData()
                toast.current.show({ severity: 'success', summary: 'אישור', detail: `המשימה ${taskName}  חזרה למצב פיתוח` });
            }

        }
    }

    const deleteLastProgress = () => {
        const role = user.role === 'מנטור' ? 'mentor' : 'manager'
        navigate(`/${role}/progressTracking`);
    }

    const fetchData = async () => {
        const condition = trainingStudent ? `trainig_student_id=${trainingStudent.trainingStudent.id}` : '';
        const tasks = await getData('task/read');
        const users = await getData('user/read');
        setTrainingStudents(users.data)
        let dataResponse = await getData('progress_trackings/read', { condition: condition });
        dataResponse = dataResponse.data.map(progress => ({
            ...progress, mentor_id: { id: progress.mentor_id, value: users.data.find(user => user.id == progress.mentor_id)?.name }, task_id: { id: progress.task_id, value: tasks.data.find(task => task.id == progress.task_id)?.label },
            start_date: changeFormatDate(progress.start_date, 'date')
        }));
        setProgressData(dataResponse);
        const config = await getData('config/getColumnNames/progress_trackings');
        setConfig(config.data);
        setExpandedUserId(dataResponse[dataResponse.length - 1] ? dataResponse[dataResponse.length - 1].trainig_student_id : null);
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <>
            <Toast ref={toast} />
            <ConfirmDialog />
            {
                progressData && config && trainingStudents && expandedUserId && (
                    <PersonalTable
                        details={progressData}
                        config={config}
                        trainingStudents={trainingStudents}
                        expandedUserId={expandedUserId}
                        allowChangeDone={true}
                        pressingIcon={pressingIcon}
                        funcSave={funcSave}
                        deleteLast={deleteLastProgress}
                        editOption={true}
                        fetchDataFunc={fetchData}
                    />
                )
            }
        </>
    )
}

export default FinishTask;