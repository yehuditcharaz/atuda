import React, { useState, useContext, useEffect, useRef } from 'react';
import { postData } from '../../services/axios';
import { UserContext } from '../../contexts/UserContext/UserContext';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import './GitHubLink.css'
import { TaskContext } from '../../contexts/TaskContext/TaskContext';
import { Dialog } from 'primereact/dialog';
import { validateUrl } from '../../validations/client-validation'
import { Toast } from 'primereact/toast';

const GitHubLink = () => {
    const toast = useRef(null);
    const { task } = useContext(TaskContext);
    const { user } = useContext(UserContext);
    const [link, setLink] = useState(task.github_link);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setLink(task.github_link);
    }, [task.github_link]);

    const updateGitHubLink = async () => {
        const validate = validateUrl(link);
        if (validate != '') {
            toast.current.show({ severity: 'error', summary: 'שגיאה', detail: validate })
        }
        else {
            await postData('task/update', {
                data: {
                    'id': task.id,
                    'label': task.label,
                    'github_link': link,
                }
            });
            setVisible(!visible);
        }

        
    };

    const footerContent = (
        <div className='link-buttons'>
            <Button label="עדכון" severity="secondary" text raised className="link-button" onClick={updateGitHubLink} />
            <a href={link} target="_blank" rel="noopener noreferrer"><Button label="קישור" severity="secondary" text raised className="link-button"></Button></a>
        </div>
    );

    return (
        <>
            <Toast ref={toast} />
            <div>
                {user.role === 'מנהל' ? <i className="pi pi-github larger-icon" onClick={() => setVisible(!visible)}></i> :
                    <a className='a-link' href={link} target="_blank" rel="noopener noreferrer">
                        <i className="pi pi-github larger-icon"></i>
                    </a>
                }
                {
                    visible && (
                        <>
                            <div className="github-link card">
                                <Dialog className='edit-link' visible={visible} modal footer={footerContent} style={{ width: '20rem' }} onHide={() => { if (!visible) return; setVisible(false); setLink(task.github_link); }}>
                                    <p className="m-0">
                                        <InputText
                                            className='link-input'
                                            type="text"
                                            value={link}
                                            onChange={(e) => setLink(e.target.value)}
                                        ></InputText>
                                    </p>
                                </Dialog>
                            </div>
                        </>)
                }
            </div>
        </>
    );
};

export default GitHubLink;