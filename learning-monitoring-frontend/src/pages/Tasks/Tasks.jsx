
import { React, useEffect, useState, useRef, useContext } from 'react';
import Navigator from '../../components/Navigator/Navigator';
import { useNavigate, useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { TabView, TabPanel } from 'primereact/tabview';
import { Menu } from 'primereact/menu';
import { ContextMenu } from 'primereact/contextmenu';
import { getData, postData } from '../../services/axios';
import { TaskContext } from '../../contexts/TaskContext/TaskContext';
import './Tasks.css';
import { TaskNotesContext } from '../../contexts/TaskNotesContext/TaskNotesContext.jsx';
import { AttachmentsContext } from '../../contexts/AttachmentsContext/AttachmentsContext';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import GitHubLink from '../../components/GitHubLink/GitHubLink';
import TemplateEmail from '../../components/TemplateEmail/TemplateEmail';
import UploadAndDownloadFiles from '../../components/UploadAndDownloadFiles/UploadAndDownloadFiles';
import Conclusions from '../../components/Conclusions/Conclusions';
import CodeReview from '../../components/CodeReview/CodeReview';
import TaskNotes from '../../components/TaskNotes/TaskNotes';
import DynamicForm from '../../components/DynamicForm/DynamicForm';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

const Tasks = ({ role }) => {
    const { title } = useParams()
    const location = useLocation();
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const [label, setLabel] = useState(title);
    const [items, setItems] = useState([])
    const [, setSelectTask] = useState('');
    const [newTask, setNewTask] = useState(false);
    const { task, setTask } = useContext(TaskContext);
    const { taskNotes, setTaskNotes } = useContext(TaskNotesContext);
    const { attachments, setAttachments } = useContext(AttachmentsContext);
    const [formKey, setFormKey] = useState(0);
    const contextMenuRef = useRef(null);
    const [editLabel, setEditLabel] = useState(false);

    let menuModel = [
        {
            label: 'העתקה',
            icon: 'pi pi-copy',
            className: 'copy-value',
            command: () => navigator.clipboard.writeText(label)
        },
        {
            label: 'עריכה',
            icon: 'pi pi-pencil',
            className: 'copy-value',
            command: () => { setEditLabel(true); }
        }
    ];

    const handleEditLabel = async () => {
        setEditLabel(false);
        await postData('task/update', { data: { ...task, label: label } });
        setTask({ ...task, label: label });
        location.pathname = `/manager/tasksList/task/${label}`;
        fetchData();
    }

    const handleTaskSelection = async (currentTask) => {
        setSelectTask(currentTask.label);
        const response = await getData('/taskNotes/read', { condition: `task_id=${currentTask.id}` });
        setTaskNotes(response.data.length);
        const result = await getData('/attachment/read', { condition: `task_id=${currentTask.id}` });
        setAttachments(result.data.length);
        setTask(currentTask);
        currentTask.label ? navigate(`/${role}/tasksList/task/${currentTask.label}`, { state: { label: currentTask.label } }) : navigate(`/${role}/tasksList`);
        setLabel(currentTask.label ? currentTask.label : '');
    };

    const fetchData = async () => {
        const updatedItems = [];
        let tasksList = await getData('task/read');
        if (tasksList.data.length > 0) {
            tasksList = tasksList.data.sort((a, b) => a.id - b.id);
            const taskItems = tasksList.map((item) => ({
                label: item.label,
                className: task && task.label == item.label ? 'p-focus' : '',
                command: () => handleTaskSelection(item)
            }));
            updatedItems.push({
                items: taskItems,
                icon: 'pi pi-clipboard',
                ref: menuRef
            });
        }
        if (role === "manager") {
            updatedItems.push({
                label: '+ משימה חדשה',
                command: () => {
                    setNewTask(true);
                    setFormKey(prevKey => prevKey + 1);
                }
            });
        };
        setItems(updatedItems);
    };

    const setFirstTask = async () => {
        let tasksList = await getData('task/read');
        if (tasksList.data.length > 0) {
            tasksList = tasksList.data.sort((a, b) => a.id - b.id);
            let taskName = location.pathname;
            taskName = taskName.split('/')[taskName.split('/').length - 1];
            const thisTask = tasksList.filter(task => task.label === taskName);
            setTask(thisTask[0]);
            setSelectTask(thisTask[0].label);

            const response = await getData('/taskNotes/read', { condition: `task_id=${thisTask[0].id}` });
            setTaskNotes(response.data.length);
            const result = await getData('/attachment/read', { condition: `task_id=${thisTask[0]?.id}` });
            setAttachments(result.data.length);
        }

    };

    useEffect(() => {
        setLabel(title)
    }, [title])

    useEffect(() => {
        fetchData();
    }, [task]);

    useEffect(() => {
        setFirstTask();
    }, []);

    return (
        <>
            <Navigator user={role} task={task && task.label ? task.label : null} />
            <ContextMenu model={menuModel} ref={contextMenuRef} />
            <div className='tasks-page'>
                <>
                    {label && task ?
                        <div className='task-label'>
                            {editLabel ?
                                <>
                                    <InputText value={label} onChange={(e) => setLabel(e.target.value)}></InputText>
                                    <Button
                                        icon="pi pi-check"
                                        className="p-button-rounded p-button-text"
                                        onClick={() => { handleEditLabel(); }}
                                        aria-label="אישור"
                                    />
                                    <Button
                                        icon="pi pi-times"
                                        className="p-button-rounded p-button-text"
                                        onClick={() => { setEditLabel(false); setLabel(task.label) }}
                                        aria-label="ביטול"
                                    />
                                </>
                                :
                                <h2 onContextMenu={(e) => { contextMenuRef.current.show(e); }} className='task-description'> {label} &nbsp;
                                    <GitHubLink />
                                </h2>}
                        </div> : null}
                    <div className='task'>
                        <Menu model={items} />
                        {label && task ? <div>
                            <TabView>
                                <TabPanel header="Code Review">
                                    <CodeReview></CodeReview>
                                </TabPanel>
                                <TabPanel header="מסקנות">
                                    <Conclusions></Conclusions>
                                </TabPanel>
                                <TabPanel header="תבנית מייל">
                                    <TemplateEmail></TemplateEmail>
                                </TabPanel>
                                <TabPanel header={`הדגשים (${taskNotes})`} >
                                    <TaskNotes />
                                </TabPanel>
                                <TabPanel header={`קבצים מצורפים (${attachments})`}>
                                    <UploadAndDownloadFiles role={role}></UploadAndDownloadFiles>
                                </TabPanel>
                            </TabView>
                        </div> : null}
                    </div>
                </>
                {newTask ? <DynamicForm key={formKey} table_name={'tasks'} route_name={'task'} fetchData={fetchData} /> : ''}
            </div >
        </>
    );
};

export default Tasks;