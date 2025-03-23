import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { getData, postData } from '../../services/axios';
import { FileUpload } from 'primereact/fileupload';
import { TaskContext } from '../../contexts/TaskContext/TaskContext';
import { AttachmentsContext } from '../../contexts/AttachmentsContext/AttachmentsContext';
import { UserContext } from '../../contexts/UserContext/UserContext';
import './UploadAndDownloadFiles.css';
import { NotificationContext } from '../../contexts/NotificationContext/NotificationContext'
import { useLocation } from 'react-router-dom';


export default function UploadAndDownloadFiles({ role }) {
    const location = useLocation();
    const { user } = useContext(UserContext);
    const { notification, setNotification } = useContext(NotificationContext);
    const fileUploadRef = useRef(null);
    const [files, setFiles] = useState([]);
    const [addFile, setAddFile] = useState(false);
    const { task } = useContext(TaskContext);
    const { attachments, setAttachments } = useContext(AttachmentsContext);
    const condition = `task_id=${task.id}`;

    const clearSelectedFiles = () => {
        if (fileUploadRef.current) {
            fileUploadRef.current.clear();
        }
    };

    const fetchFiles = useCallback(async () => {
        clearSelectedFiles();
        const data = await getData('attachment/read', { condition: condition });
        setAddFile(false)
        setFiles(data.data);
    }, [task.id])

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles, addFile]);

    const handleDownload = async (id) => {
        try {
            const dowloadfile = files.filter((f) => id === f.id)[0]
            const unit8 = new Uint8Array(dowloadfile.file);
            const blob = new Blob([unit8]);
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = dowloadfile.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        }
        catch (error) {
            console.error('Error downloading file:', error);
        }
    }
    const handleUpload = async (event) => {
        const file = event.files[0];
        const formData = new FormData();
        formData.append('name', file.name);
        formData.append('file', file);
        formData.append('task_id', task.id);
        formData.append('link', location.pathname);

        try {
            const res = await postData('attachment/create', formData, 'multipart/form-data');
            res.data.notifications.forEach(value => { if (user.role === value.role || user.id === value.id) setNotification([...notification, value]) });

            setAddFile(true)
            setAttachments(attachments + 1);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    }

    const deleteFile = async (rowData) => {
        const res = await postData('attachment/delete', { id: rowData.id });
        if (res.status == 200) {
            setAttachments(attachments - 1);
            const updateFiles = files.filter(row => row.id != rowData.id);
            setFiles(updateFiles);
        }
    }

    return (
        <div className='attachments'>
            <div id='down'>
                <DataTable value={files} className="custom-datatable">
                    <Column field="name" header="שם הקובץ" className="custom-column"></Column>
                    <Column
                        body={(rowData) => (
                            <Button label="הורדה" severity="secondary" text raised className="download-file" onClick={() => handleDownload(rowData.id)} />
                        )}
                    ></Column>
                    <Column
                        body={(rowData) => (
                            <Button label="מחיקה" severity="secondary" text raised className="download-file" onClick={() => deleteFile(rowData)} />
                        )}
                    ></Column>

                </DataTable>
            </div >
            {role === 'manager' ?
                <div>
                    <FileUpload name="demo[]" ref={fileUploadRef} customUpload={true} uploadHandler={handleUpload} emptyTemplate={<p className="m-0">גרור ושחרר קבצים לכאן כדי להעלות.</p>} />
                </div> : ''
            }
        </div>
    )
}