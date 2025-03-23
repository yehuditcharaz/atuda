import React, { useState, useContext, useEffect, useRef } from 'react';
import { postData } from '../../services/axios';
import { UserContext } from '../../contexts/UserContext/UserContext';
import { Editor } from 'primereact/editor';
import { Button } from 'primereact/button';
import './Conclusions.css';
import { TaskContext } from '../../contexts/TaskContext/TaskContext';
import { Toast } from 'primereact/toast';

const Conclusions = () => {
    const toast = useRef(null);
    const { user } = useContext(UserContext);
    const { task } = useContext(TaskContext);
    const [conclusions, setConclusions] = useState(task.conclusions);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setConclusions('')
    }, [task.id]);

    useEffect(() => {
        setConclusions(task.conclusions);
        setIsEditing(false);
    }, [task.conclusions]);
    const saveChanges = async () => {
        let flag = true;
        if (conclusions?.length > 120000) {
            toast.current.show({ severity: 'error', summary: 'שגיאה', detail: 'לא ניתן לשמור קובץ בגודל זה' });
            flag = false;
        }
        if (flag) {
            if (conclusions === null) setConclusions('');
            try {
                const response = await postData('task/update', {
                    data: {
                        'id': task.id,
                        'label': task.label,
                        'conclusions': conclusions,
                    },
                    users: {
                        arrUsers: [
                            { role: 'מוכשרת', link: "http://localhost:3000/trainingStudent/generalInformation" },
                            { role: 'מנטור', link: "http://localhost:3000/mentor/tasksList" },
                            { role: 'מנהל', link: "http://localhost:3000/manager/tasksList" }
                        ]
                    }
                })
                if (response.status == 200) toast.current.show({ severity: 'success', summary: 'אישור', detail: 'העדכון נשמר בהצלחה' });
            } catch (error) {
                flag = false;
                toast.current.show({ severity: 'error', summary: 'שגיאה', detail: 'לא ניתן לשמור קובץ בגודל זה' });

            }
            return flag;
        }
    }
    return (
        <>
            <Toast ref={toast} />
            <div className="cons">
                <div>
                    {user.role === "מנהל" && !isEditing && (
                        <Button label="עריכה" severity="secondary" text raised className="edit-btn" onClick={() => setIsEditing(true)} />
                    )}
                    {isEditing ? (
                        <div>
                            <Button label="שמירה" severity="secondary" text raised className="edit-btn" onClick={async () => { await saveChanges() ? setIsEditing(false) : setIsEditing(true); }} />
                            <Editor className='edit' dir="rtl" maxLength={500} style={{ border: "none" }} value={conclusions} onTextChange={(e) => setConclusions(e.htmlValue)} />
                        </div>
                    ) : (
                        <div className='read-con' dangerouslySetInnerHTML={{ __html: conclusions }} />
                    )}
                </div>
            </div>
        </>
    );
};

export default Conclusions;