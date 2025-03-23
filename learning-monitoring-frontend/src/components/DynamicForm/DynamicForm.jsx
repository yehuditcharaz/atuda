import React, { useState, useEffect, useContext, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { postData, getData } from '../../services/axios';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { Message } from 'primereact/message';
import { Password } from 'primereact/password';
import { Rating } from 'primereact/rating';
import { UserContext } from '../../contexts/UserContext/UserContext';
import { TaskContext } from '../../contexts/TaskContext/TaskContext';
import { NotificationContext } from '../../contexts/NotificationContext/NotificationContext'
import { InputTextarea } from 'primereact/inputtextarea';
import { Tag } from 'primereact/tag';
import { validateUser, validateTask, validateProgressTracking, validateCodeReview } from '../../validations/client-validation'
import './DynamicForm.css';
import { Toast } from 'primereact/toast';
import { Editor } from 'primereact/editor';

const DynamicForm = ({ table_name, route_name, fetchData, initializeFormData }) => {
    const location = useLocation();
    const { user } = useContext(UserContext);
    const { task } = useContext(TaskContext);
    const { notification, setNotification } = useContext(NotificationContext);
    const [title] = useState({});
    const [formFields, setFormFields] = useState([]);
    const [originalFormFields, setOriginalFormFields] = useState([]);
    const [showDialog, setShowDialog] = useState(true);
    const [formTitle, setformTitle] = useState('');
    const [dropdownFields, setDropdownFields] = useState([]);
    const [formData, setFormData] = useState(initializeFormData ? initializeFormData : {});
    const [firstTask, setFirstTask] = useState('');
    const [invalidFields, setInvalidFields] = useState([]);
    const toast = useRef(null);
    const types = {
        TIME: 'time',
        DATE: 'date',
        INT: 'number',
        INT_STAR: 'star',
        VARCHAR: 'text',
        EMAIL: 'email',
        PHONE: 'tel',
        ENUM: 'select',
        BOOLEAN: 'boolean',
        PASSWORD: 'password',
        TEXTAREA: 'textarea',
        TAG: 'tag-select',
        EDITOR: 'editor'
    }

    const getColorByIndex = (index) => {
        const hue = (360 * index / 10) % 360;
        const saturation = 50;
        const lightness = 50;
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };

    const handleChange = (value, name) => {
        if (name === 'role') {
            if (value == 'מוכשרת') {
                const updateFormFields = formFields.map(field => ({ ...field, display: undefined }));
                setFormFields(updateFormFields);
            }
            else {
                setFormFields(originalFormFields);
            }
        }

        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const checkRequiredFields = () => {
        let requiredFields = formFields.filter(field => field.isNotNull)?.map(field => field.name);
        requiredFields = requiredFields.filter(field => !Object.keys(formData).includes(field))
        setInvalidFields(requiredFields);
        return !requiredFields.length;
    }

    const onSubmit = async (e) => {
        let validateFlag = true;
        e.preventDefault();
        if (checkRequiredFields()) {
            try {
                const res = route_name === 'user' ? validateUser(formData, 'create') :
                    route_name === 'task' ? validateTask(formData) :
                        route_name === 'progress_trackings' ? validateProgressTracking(formData) :
                            route_name === 'codeReview' ? validateCodeReview(formData) :
                                null;
                if (res != null) {
                    await res.then((notifications) => {
                        for (let key in notifications) {
                            if (Object.prototype.hasOwnProperty.call(notifications, key)) {
                                const value = notifications[key];
                                if (value != '') {
                                    validateFlag = false;
                                    toast.current.show({ severity: 'error', summary: 'שגיאה', detail: value, life: 5000 })
                                }
                            }
                        }
                    }).catch((error) => {
                        console.log("error ", error);
                    });
                }

                if (validateFlag) {
                    const res = await postData(`/${route_name}/create`, formData);
                    if (res.data.notifications) {
                        res.data.notifications.forEach(value => {
                            if (value.user_id === user.id || value.role === user.role) {
                                setNotification([...notification, value])
                            }
                        })
                    }
                    setShowDialog(false);
                    if (route_name == 'progress_trackings') {
                        const mentorId = await getData('user/read', { condition: `id=${formData.trainig_student_id}` })
                        if (mentorId != formData.mentor_id) {
                            await postData('user/update', {
                                id: formData.trainig_student_id,
                                mentor_id: formData.mentor_id
                            })
                        }
                    }
                    toast.current.show({ severity: 'success', summary: 'אישור', detail: 'רשומה חדשה נוספה בהצלחה' });
                    fetchData();
                }
            } catch (error) {
                console.error('Error inserting task:', error);
            }
        }

    };

    const elementField = (field) => {
        if (field.name === 'task_id') {
            return <InputText disabled placeholder={firstTask.label} invalid={invalidFields.includes(field)} />
        }
        if (field.relationship) {
            const dropdownItems = (field) => {
                const matchingField = dropdownFields.length ? dropdownFields.find(item => item.name === field.name) : '';
                if (matchingField) {
                    return matchingField.items.map(option => ({
                        label: option.name,
                        value: option.id
                    }));
                }
                return [];
            }
            return <Dropdown
                value={formData[field.name]}
                options={dropdownItems(field)}
                onChange={(e) => { handleChange(e.value, field.name) }}
                invalid={invalidFields.includes(field.name)}
                className='input-field'
            />
        }
        else {
            switch (field.type) {
                case 'editor':
                    return <Editor className='editor-field' value={formData[field.name]} onTextChange={(e) => handleChange(e.htmlValue, field.name)} invalid={invalidFields.includes(field.name)} />
                case 'textarea':
                    return <InputTextarea autoResize value={formData[field.name]} onChange={(e) => handleChange(e.target.value, field.name)} rows={5} cols={30} invalid={invalidFields.includes(field.name)} />
                case 'password':
                    return <Password className='password-field' toggleMask={true} onChange={(e) => handleChange(e.target.value, field.name)} invalid={invalidFields.includes(field.name)} />
                case 'boolean':
                    return <Checkbox onChange={(e) => handleChange(e.checked, field.name)} checked={formData[field.name]} invalid={invalidFields.includes(field.name)} />
                case 'star':
                    return <Rating stars={6} value={formData[field.name]} cancel={false} onChange={(e) => handleChange(e.target.value, field.name)} />
                case 'tag-select':
                    return <Dropdown value={formData[field.name]} options={field.enum_values}
                        itemTemplate={(option) => { return <Tag className='tag-level' value={option} style={{ backgroundColor: getColorByIndex(field.enum_values.indexOf(option)) }}></Tag> }} onChange={(e) => {
                            handleChange(e.value, field.name);
                        }} invalid={invalidFields.includes(field.name)} className='input-field' />
                case 'select':
                    return <Dropdown value={formData[field.name]} options={field.enum_values.map(option => ({ label: option, value: option }))} onChange={(e) => {
                        handleChange(e.value, field.name);
                    }} invalid={invalidFields.includes(field.name)} className='input-field' />
                default:
                    return <InputText value={formData[field.name]} type={field.type} name={field.name} title={field.translate} onChange={(e) => handleChange(e.target.value, field.name)} className='input-field' invalid={invalidFields.includes(field.name)} />
            }
        }
    }

    const dropdownField = async (itemField) => {
        const response = await getData('progress_trackings/read')
        const uniqueIds = [...new Set(response.data.map(item => item.trainig_student_id))];
        let select = ['id', 'name'], condition, route;
        switch (itemField.name) {
            case 'trainig_student_id':
                condition = uniqueIds.length ? `role='מוכשרת' AND id NOT IN (${uniqueIds})` : `role='מוכשרת'`;
                route = 'user';
                break;
            case 'mentor_id':
                condition = `role='מנטור'`;
                route = 'user';
                break;
            default:
                break;
        }
        if (select && route) {
            const response = await getData(`${route}/read`, { select, condition: condition });
            return { 'name': itemField.name, 'items': response.data };
        }
        return null
    }

    const updateFormFields = (table_details) => {
        const path = location.pathname;
        const parts = path.split('/');

        switch (table_name) {
            case 'users':
                table_details = table_details.map((item, index) => { if (index > 5) { return { ...item, display: 'none' } } return item })
                break;
            case 'code_reviews':
                table_details = table_details.slice(2, table_details.length - 1);
                setFormData({ task_id: task.id, mentor_id: user.id, date: new Date().toISOString().slice(0, 10), link: parts[parts.length - 1] });
                break;
            case 'tasks_feedback':
                table_details = table_details.slice(2, table_details.length);
                setFormData({...formData, trainig_student_id: user.id, date: new Date().toISOString().slice(0,10)})
                break;
            case 'tasks':
                table_details = table_details.filter(item => item.name === 'label' || item.name === 'github_link');
                break;
            case 'evaluations':
                table_details = table_details.slice(3, table_details.length - 1);
                break;
            default:
                break;
        }
        setFormFields(table_details);
        setOriginalFormFields(table_details);
    }

    const getFirstTask = async () => {
        let res = await getData('task/read')
        if (res.data.length > 0) {
            res = res.data.sort((a, b) => a.id - b.id)[0]
            setFirstTask(res);
            if (route_name === 'progress_trackings') {
                setFormData(prevData => ({
                    ...prevData,
                    ['task_id']: res.id
                }));
            }
        }
    }

    useEffect(() => {
        const fetchColumnNames = async () => {
            try {
                const tableDetails = await getData(`/config/getTable/${table_name}`);
                setformTitle(tableDetails.data.translate);
                let updatedTableDetails = tableDetails.data.columns.slice(1).map(detail => ({
                    ...detail,
                    type: detail.name.toLowerCase().includes('sentence') ? types.EDITOR :
                        detail.name.toLowerCase().includes('evaluation') ? types.TEXTAREA :
                            detail.name.toLowerCase().includes('tag') ? types.TAG :
                                detail.name.toLowerCase().includes('phone') ? types.PHONE :
                                    detail.name.toLowerCase().includes('email') ? types.EMAIL :
                                        detail.name.toLowerCase().includes('password') ? types.PASSWORD :
                                            detail.type.includes('INT DEFAULT 0') ? types.INT_STAR :
                                                types[detail.type.split(/[( ]/)[0].trim().toUpperCase()] || detail.type,
                    isNotNull: detail.type.includes('NOT NULL'),
                }));
                updateFormFields(updatedTableDetails);
                const promise = updatedTableDetails.map(async item => (
                    item.relationship ? dropdownField(item) : null
                ))
                const dropdownDataResults = await Promise.all(promise);
                setDropdownFields(dropdownDataResults.filter(data => data !== null));
            } catch (error) {
                console.error(error);
            }
        };
        fetchColumnNames();
    }, [table_name, route_name]);

    useEffect(() => {
        getFirstTask();
    }, []);

    return (
        <>
            <Toast ref={toast} />
            <Dialog className={['dialog', table_name == 'code_reviews' ? 'dialog-review' : '']} visible={showDialog} onHide={() => { setShowDialog(false); }} header={`הוספת ${formTitle}`}>
                <form className='form' onSubmit={onSubmit}>
                    {formFields.map((field, index) => (
                        !field.display ? <div className='wrap-field' key={index}>
                            <div className='field-form'>
                                <div className='title-form'>
                                    <label className='label-field'>{field.translate}</label>
                                    {field.isNotNull && <span className="required-star">*</span>}
                                </div>
                                {elementField(field)}
                                {field.isNotNull && (
                                    <Message
                                        severity="error"
                                        text={title[field.name]}
                                        style={{ display: title[field.name] ? 'block' : 'none' }}
                                    />
                                )}
                            </div>
                        </div> : ''
                    ))}
                    <div className='wrap-submit-form'>
                        <Button label="שליחה" severity="secondary" text raised className='submit-form' type='submit' />
                    </div>
                </form>
            </Dialog>
        </>
    );
};
export default DynamicForm;