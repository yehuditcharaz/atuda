import React, { useEffect, useState, useCallback, useContext, useRef } from 'react';
import { getData, postData } from '../../services/axios';
import { UserContext } from '../../contexts/UserContext/UserContext'
import { TaskContext } from '../../contexts/TaskContext/TaskContext'
import { TaskNotesContext } from '../../contexts/TaskNotesContext/TaskNotesContext.jsx';
import { Button } from 'primereact';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './TaskNotes.css';
import { validateEmptyString } from '../../validations/client-validation'
import { Toast } from 'primereact/toast';


const TaskNotes = () => {
    const toast = useRef(null);
    const { user } = useContext(UserContext);
    const { task } = useContext(TaskContext);
    const { taskNotes, setTaskNotes } = useContext(TaskNotesContext);
    const [taskNotesList, setTaskNotesList] = useState([]);
    const [taskNotesText, setTaskNotesText] = useState('');
    const [editingTaskNotes, setEditingTaskNotes] = useState(null);

    const fetchTaskNotes = useCallback(async () => {
        try {
            setTaskNotesText('')
            const condition = `task_id=${task.id}`;
            let task_notes = await getData('taskNotes/read', { condition: condition });
            if (task_notes.data.length>=0) {
                const writers = await getData('user/read');
                task_notes = task_notes.data.map(note => ({ ...note, written_id: writers.data.find(writer => writer.id == note.written_id)?.name }))
                setTaskNotesList(task_notes);
            }
            else{
                setTaskNotesList([]);
            }
        } catch (error) {
            console.error('Error fetching taskNotes:', error);
        }
    }, [task.id]);

    useEffect(() => {
        fetchTaskNotes();
    }, [fetchTaskNotes]);

    const handleAddTaskNotes = async () => {
        try {
            if (user.role !== 'מנטור' && user.role !== 'מנהל') {
                console.error('Only mentors and managers can add taskNote');
                return;
            }
            const validate = validateEmptyString(taskNotesText);
            if (validate != '') {
                toast.current.show({ severity: 'error', summary: 'שגיאה', detail: validate })
            }
            else {
                if (editingTaskNotes) {
                    await postData('taskNotes/update', {
                        id: editingTaskNotes.id,
                        note: taskNotesText,
                        task_id: editingTaskNotes.task_id,
                        written_id: user.id,

                    });

                } else {
                    await postData('taskNotes/create', {
                        note: taskNotesText,
                        written_id: user.id,
                        task_id: task.id,
                    });
                    setTaskNotes(taskNotes + 1)
                }
                setTaskNotesText('');
                setEditingTaskNotes(null);
                fetchTaskNotes();
            }

        } catch (error) {
            console.error('Error saving taskNotes:', error);
        }
    };

    const handleEditTaskNotes = (tasknote) => {
        setTaskNotesText(tasknote.note);
        setEditingTaskNotes(tasknote);
    };

    const handleDeleteTaskNotes = async (id) => {
        try {
            await postData('taskNotes/delete', { id });
            fetchTaskNotes();
        } catch (error) {
            console.error('Error deleting taskNote:', error);
        }
        setTaskNotes(taskNotes - 1);
    };

    return (
        <>
            <Toast ref={toast} />
            <div className='display-tasknotes'>
                {(user.role === 'מנטור' || user.role === 'מנהל') && (
                    <div className="tasknote-input-containers">
                        <input
                            type="text"
                            value={taskNotesText}
                            onChange={(e) => setTaskNotesText(e.target.value)}
                            placeholder="הכנס הדגש"
                            className="tasknote-input"
                        />
                        <br></br>
                        <Button label="שמירה" severity="secondary" text raised onClick={handleAddTaskNotes} className="tasknote-save-button" />
                    </div>
                )}
                <div className="tasknotes">
                    {taskNotesList.length > 0 ? (
                        taskNotesList.map((item) => (
                            <div key={item.id} className="tasknote-item">
                                <div className="tasknote-actions">
                                    {(user.role === 'מנטור' || user.role === 'מנהל') && user.name === item.written_id && (
                                        <>
                                            <Button
                                                icon="pi pi-trash"
                                                onClick={() => handleDeleteTaskNotes(item.id)}
                                                className="tasknote-action-button"
                                            />
                                            <Button
                                                icon="pi pi-pencil"
                                                onClick={() => handleEditTaskNotes(item)}
                                                className="tasknote-action-button"
                                            />
                                        </>
                                    )}
                                </div>
                                <div className="tasknote-text">
                                {item.note} <div className="writer-info">נכתב ע&rdquo;י: {item.written_id}</div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>לא נמצאו הדגשים</div>
                    )}
                </div>
            </div>
        </>
    );
}

export default TaskNotes;