import React, { useEffect, useReducer, useState, useContext, useRef } from 'react';
import Navigator from '../../components/Navigator/Navigator';
import { Editor } from "primereact/editor";
import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';
import { postData, getData } from '../../services/axios';
import { Menu } from 'primereact/menu';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { UserContext } from '../../contexts/UserContext/UserContext';
import DisplayingStudentsDetails from '../../components/DisplayingStudentsDetails/DisplayingStudentsDetails';
import { NotificationContext } from '../../contexts/NotificationContext/NotificationContext';
import './GeneralInformation.css';

const GeneralInformation = ({ role }) => {
    const { notification, setNotification } = useContext(NotificationContext);
    const { user } = useContext(UserContext);
    const [text, setText] = useState('');
    const [title, setTitle] = useState('');
    const [readOnly, setReadOnly] = useState(true);
    const [buttonLabel, setButtonLabel] = useState('עריכה');
    const [newText, setNewText] = useState(false);
    const [currentText, setCurrentText] = useState({});
    const [label, setLabel] = useState('');
    const [textSelected, setTextSelected] = useState(false);
    const configMenu = useRef(null);
    const toast = useRef(null);

    const items = [
        {
            label: ' עריכה ',
            icon: 'pi pi-pencil',
            command: () => { editText(); }
        },
        {
            separator: true
        },
        {
            label: ' מחיקה ',
            icon: 'pi pi-trash',
            command: async () => { confirmDelete(); }
        }
    ];

    const accept = async () => {
        await handleDelete();
        toast.current.show({ severity: 'success', summary: 'אישור', detail: 'המחיקה בוצעה' });
    }

    const confirmDelete = () => {
        confirmDialog({
            message: '?האם את בטוחה שברצונך למחוק טקסט זה',
            header: 'אישור מחיקה',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept: () => accept(),
            acceptLabel: 'כן',
            rejectLabel: 'לא',
        });
    };

    const handleDelete = async () => {
        await postData('generalInformation/delete', { id: currentText.id });
        dispatch({ type: 'delete', label: title, data: { currentText } });
    }

    const manageSelectedText = (state, action) => {
        state = state.map(value => value.items && value.items.length ? { ...value, items: value.items.map(item => ({ ...item, className: item.label === currentText.title && (item.label === '+ הוספת טקסט חדש' ? value.label === action.label : true) ? 'p-focus' : '' })) } : value)
        setTextSelected(false);
        return state;
    }

    const reducer = (state, action) => {
        if (action) {
            if (action.new) {
                const isItemExists = state.some(item => item.label === action.label);
                if (!isItemExists) {
                    return [...state, {
                        label: action.label, items: action.data.map((l) => ({
                            label: l.title,
                            command: () => handleItemSelection(l, action.label),
                            className: currentText.title !== '' && l.title === currentText.title && l.content === currentText.content ? 'p-focus' : ''
                        }))
                    }];
                }
                else if (!action.data.length) {
                    state = state.map(item => {
                        if (item.label === action.label) {
                            return {
                                label: item.label,
                                items: [{
                                    label: action.data.title,
                                    command: () => handleItemSelection(action.data, action.label),
                                }
                                    , ...item.items]
                            }
                        }
                        return item;
                    })
                }
            }
            else if (action.type == 'delete') {
                state = state.map(item => ({
                    ...item,
                    items: item.items.filter(subItem => subItem.label !== action.label)
                }));
            }
            else {
                state = state.map(item => {
                    if (item.label === label) {
                        return {
                            ...item,
                            items: item.items.map(subItem => subItem.label === currentText.title || subItem.className === 'p-focus' ?
                                {
                                    label: action.data.title,
                                    command: () => handleItemSelection(action.data, action.label),
                                } : subItem)
                        };
                    }
                    return item;
                });
            }
        }
        state = state.map(value => value.items && value.items.length ? { ...value, items: value.items.map(item => ({ ...item, className: ((action.data && action.data.title && item.label === action.data.title) || item.label === currentText.title) && (item.label === '+ הוספת טקסט חדש' ? value.label === action.label : true) ? 'p-focus' : '' })) } : value)
        return state;
    }

    const [objects, dispatch] = useReducer(textSelected ? manageSelectedText : reducer, []);

    const handleItemSelection = (item, label, newText) => {
        setLabel(label);
        setCurrentText(item);
        if (item.title === '+ הוספת טקסט חדש') { setNewText(true); setText(''); setTitle(''); setReadOnly(false); setButtonLabel('שמירה'); }
        else { setNewText(false); setText(item.content); setTitle(item.title); setReadOnly(true); setButtonLabel('עריכה'); }
        if (!newText) {
            setTextSelected(true);
            dispatch({ label: label, data: { title: item.title, content: item.content } });
        }
    };

    const getGeneralInfo = async (con) => {
        try {
            const response = await getData('generalInformation/read', {
                condition: `information_for = '${con}'`,
            });
            if (response.status === 200) {
                const myData = response.data;
                if (role === 'manager') {
                    myData.push({ title: '+ הוספת טקסט חדש', information_for: con });
                }
                setLabel(`מידע כללי ל${con}`);
                if (myData[0]) {
                    return { data: myData[0], dispatch: { label: `מידע כללי ל${con}`, data: myData, new: true } };
                }
                else {
                    return { dispatch: { label: `מידע כללי ל${con}`, data: [], new: true } }
                }
            }
        }
        catch (error) {
            console.error('An error occurred');
        }
    }

    const getConclusion = async (con) => {
        let condition = null;
        if (role === 'trainingStudent') {
            const responseProgress = await getData('progress_trackings/read', {
                condition: con,
                select: ['task_id']
            });
            if (responseProgress && responseProgress.status === 200 && responseProgress.data[0]) {
                const taskIds = `(${(responseProgress.data.map(task => task.task_id)).join(', ')})`;
                condition = `id in ${taskIds}`
            }
            else {
                return { dispatch: { label: `מסקנות למשימות`, data: [], new: true } };
            }
        }
        let responseTask = await getData('task/read', {
            condition: condition,
            select: ['id,label as title,conclusions as content']
        });
        if (responseTask.status === 200 && responseTask.data.length) {
            responseTask = responseTask.data.sort((a, b) => a.id - b.id);
            const taskData = responseTask.map(task => ({ ...task, task: true }));
            return { data: taskData[0], dispatch: { label: `מסקנות למשימות`, data: taskData, new: true } };
        }
    }

    const saveText = async () => {
        let flag = true;
        if (text?.length > 120000) {
            toast.current.show({ severity: 'error', summary: 'שגיאה', detail: 'לא ניתן לשמור קובץ בגודל זה' });
            flag = false;
        }
        if (flag) {
            editText();
            setTextSelected(false);
            if (newText) {
                if (title != '') {
                    const response = await postData('generalInformation/create', { 'title': title, 'content': text ? text : '', 'information_for': currentText.information_for });
                    const data = { id: response.data.table.id, title: title, content: text ? text : '', 'information_for': currentText.information_for };
                    response.data.notifications.forEach(value => { if (user.role === value.role || user.id === value.user_id) setNotification([...notification, value]) });
                    dispatch({ label: label, data: data, new: true });
                    handleItemSelection(data, label, true);
                }
            }
            else {
                dispatch({ label: label, data: { 'id': currentText.id, 'title': title, 'content': text ? text : '', 'information_for': currentText.information_for }, new: false });
                postData('generalInformation/update', { 'id': currentText.id, 'title': title, 'content': text ? text : '', 'information_for': currentText.information_for });
            }
        }
    }

    const editText = () => {
        setReadOnly(readOnly ? false : true);
        setButtonLabel(buttonLabel === 'עריכה' ? 'שמירה' : 'עריכה');
    }

    const fetchData = async () => {
        let information = [];
        switch (role) {
            case 'manager':
                information = [await getGeneralInfo("מנטור"), await getGeneralInfo("מוכשרת")];
                break;
            case 'mentor':
                information = [await getGeneralInfo(user.role)];
                break;
            case 'trainingStudent':
                information = [await getGeneralInfo(user.role), await getConclusion(`trainig_student_id = '${user.id}' AND done = true`)];
                break;
            default:
                break;
        }
        information.some(info => {
            if (info && info.data) {
                setCurrentText(info.data);
                setTitle(info.data.title);
                setText(info.data.content);
                setLabel(info.dispatch.label);
                if (info.data.id) return true;
            }
        });
        information.some(info => {
            if (info && info.dispatch) {
                dispatch(info.dispatch);
            }
        })
    }

    useEffect(() => {
        fetchData()
    }, [])
    return (
        <>
            <Navigator user={role} />
            <Toast ref={toast} className='toast-info' />
            <ConfirmDialog className='confirm-dialog-info' />
            <div className='info-page'>
                {role == 'trainingStudent' ? <DisplayingStudentsDetails trainingStudent={{ id: user.id }} /> : ''}
                <div className='info'>
                    <Menu model={objects} />
                    <div className='text-info'>
                        {!readOnly ?
                            <div className='wrap-title'>
                                <InputText className='title-input' value={title} onChange={(e) => setTitle(e.target.value)} />
                            </div> : ''
                        }
                        <div className='card-edit'>
                            {role === 'manager' ?
                                (buttonLabel === 'שמירה' ? <Button label={buttonLabel} severity="secondary" text raised className="text-btn" onClick={() => { saveText(); }} />
                                    : <>
                                        <Menu model={items} popup ref={configMenu} id="config_menu" />
                                        <span className="menu-options pi pi-ellipsis-h" onClick={(e) => configMenu?.current?.toggle(e)}></span>
                                    </>
                                )
                                : ''}
                            {
                                !readOnly ?
                                    <Editor className='edit' value={text} onTextChange={(e) => setText(e.htmlValue)} />
                                    : <div className='read' dangerouslySetInnerHTML={{ __html: text }} />
                            }
                        </div>
                    </div>
                </div>
            </div>

        </>)
}

export default GeneralInformation;