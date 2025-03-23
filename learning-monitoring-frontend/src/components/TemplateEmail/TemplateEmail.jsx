import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import React, { useState, useContext, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { postData } from '../../services/axios'
import { UserContext } from '../../contexts/UserContext/UserContext';
import { Editor } from 'primereact/editor';
import { TaskContext } from '../../contexts/TaskContext/TaskContext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import "./TemplateEmail.css"

const TemplateEmail = () => {
    const toast = useRef(null);
    const { user } = useContext(UserContext);
    const { task } = useContext(TaskContext);
    const [userBody, setUserBody] = useState('');
    const [userSubject, setUserSubject] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setUserBody('')
    }, [task.id]);

    useEffect(() => {
        setUserSubject(task.mail_template_subject ? task.mail_template_subject : 'נושא');
        setUserBody(task.mail_template_body ? task.mail_template_body : 'גוף המייל');
        setIsEditing(false);
    }, [task.mail_template_subject, task.mail_template_body]);

    const saveChanges = async () => {
        if (userBody && userSubject) {
            const response = await postData('task/update', {
                data: {
                    'id': task.id,
                    'label': task.label,
                    'mail_template_subject': userSubject,
                    'mail_template_body': userBody,
                }
            });
            if (response.status == 200) {
                toast.current.show({ severity: 'success', summary: 'אישור', detail: 'העדכון נשמר בהצלחה' });
            }
        }
    };

    return (
        <>
            <Toast ref={toast} />
            <div className='big'>
                <InputText
                    style={{ 'direction': 'ltr', 'width': '400px' }}
                    value={userSubject}
                    onChange={user.role === "מנהל" ? (e) => setUserSubject(e.target.value) : null}
                    disabled={!isEditing}
                />
                <div className="mail">
                    <div>
                        {user.role === "מנהל" && !isEditing && (
                            <Button label="עריכה" severity="secondary" text raised className="edit-btn" onClick={() => setIsEditing(true)} />
                        )}
                        {isEditing ? (
                            <div>
                                <Button label="שמירה" severity="secondary" text raised className="edit-btn" onClick={() => { setIsEditing(false); saveChanges(); }} />
                                <Editor
                                    className='edit'
                                    dir="rtl"
                                    maxLength={500}
                                    style={{ border: "none" }}
                                    value={userBody}
                                    onTextChange={(e) => setUserBody(e.htmlValue)}
                                />
                            </div>
                        ) : (
                            <div className='read-mail' dangerouslySetInnerHTML={{ __html: userBody }} />
                        )}
                    </div>
                </div>
            </div>
        </>
    )


}

export default TemplateEmail;