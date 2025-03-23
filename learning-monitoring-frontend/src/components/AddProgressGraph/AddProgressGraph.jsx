import React, { useState, useContext, useEffect, useRef } from "react";
import { TreeSelect } from 'primereact/treeselect';
import { Dialog } from 'primereact/dialog';
import { getData, postData } from "../../services/axios";
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import ProgressGraph from "../ProgressGraph/ProgressGraph";
import { UserContext } from '../../contexts/UserContext/UserContext';
import './AddProgressGraph.css'
import { Toast } from 'primereact/toast';
import { NotificationContext } from '../../contexts/NotificationContext/NotificationContext'
import { useLocation } from 'react-router-dom';

const AddProgressGraph = ({ training_student_id = null, fetchDataFunc, mode = 'create', data = null }) => {
    const toast = useRef(null);
    const location = useLocation();
    const { user } = useContext(UserContext);
    const [values, setValues] = useState([]);
    const [xValues, setXValues] = useState(null);
    const [graphsValues, setGraphsValues] = useState(null);
    const [conditionValues, setConditionValues] = useState(null);
    const [displayGraph, setDisplayGraph] = useState(false);
    const [graphTemplate, setGraphTemplate] = useState({});
    const [title, setTitle] = useState('');
    const [visible, setVisible] = useState(true);
    const [displayToStudent, setDisplayToStudent] = useState(false);
    const [selectValues, setSelectValues] = useState({ 'conditionValues': null, 'graphsValues': null, 'xValues': null });
    const [isSelected, setIsSelected] = useState({ 'conditionValues': { key: null, selected: false, invalid: false }, 'graphsValues': { key: null, selected: false, invalid: false }, 'xValues': { key: null, selected: false, invalid: false } });
    const [hasExecuted, setHasExecuted] = useState(false);
    const { notification, setNotification } = useContext(NotificationContext);

    useEffect(() => {
        const mapData = (array, tableName, label, value) => {
            return array.map(row => ({
                'key': `${tableName}-${row[value]}`,
                'leaf': true,
                'label': row[label],
                'value': row[value]
            }))
        };

        const fetchData = async () => {
            let progress = await getData('/config/getColumnNames/progress_trackings')
            let tasks = await getData('task/read', { select: ['id', 'label'] });
            if (tasks.data.length) tasks = tasks.data.sort((a, b) => a.id - b.id);
            let users = user.role === 'מנהל' ? await getData('user/read', { condition: "role='מוכשרת'", select: ['id', 'name'] }) : await getData('user/read', { condition: `role='מוכשרת' AND mentor_id=${user.id}`, select: ['id', 'name'] });
            progress = progress.data.columns.slice(6, 13);
            progress = await mapData(progress, 'progress_trackings', 'translate', 'name');
            tasks = await mapData(tasks, 'task', 'label', 'id');
            users = await mapData(users.data, 'user', 'name', 'id');

            setValues([
                {
                    key: 0,
                    leaf: true,
                    label: 'מדדים',
                    value: 'progress_trackings',
                    children: progress
                },
                {
                    key: 1,
                    leaf: true,
                    label: 'משימות',
                    value: 'task',
                    children: tasks
                },
                {
                    key: 2,
                    leaf: true,
                    label: 'מוכשרות',
                    value: 'user',
                    children: users
                }
            ])
        }
        fetchData();

    }, []);

    useEffect(() => {
        if (training_student_id && values.length > 0 && !hasExecuted) {
            selectCondition(`user-${training_student_id}`);
            setHasExecuted(true);
        }
    }, [values, training_student_id]);

    useEffect(() => {
        if (data && values.length && !hasExecuted && mode == 'update') {
            editTemplate();
            setHasExecuted(true);
        }
    }, [data, values, mode]);

    const getValuesObj = (tableName, tableValues) => {
        let obj = {};
        let selectValue = values.filter(val => val['value'] == tableName)[0];
        obj[selectValue.key] = { checked: tableValues.length == selectValue.children.length, partialChecked: !tableValues.length == selectValue.children.length };
        tableValues.map(item => obj[`${tableName}-${item}`] = { checked: true, partialChecked: false })
        return obj;
    }

    const updateSelectValues = async (array) => {
        let isSelectObj = {}
        let selectOptions = {};
        array.map(item => {
            item.value = typeof (item.value) == 'number' ? item.value : Object.keys(item.value)[0];
            isSelectObj[item.option] = { key: item.value, selected: true, invalid: false };
            selectOptions[item.option] = values.filter(val => val['key'] == item.value);
        })
        setIsSelected(isSelectObj);
        setSelectValues(selectOptions);
    }

    const editTemplate = async () => {
        setTitle(data.title);
        setDisplayToStudent(data.display_for_training_student);
        const getXValues = getValuesObj(data.x_table_name, data.x_array);
        setXValues(getXValues);
        const getYValues = getValuesObj(data.y_table_name, data.y_array);
        setGraphsValues(getYValues);
        let conditionValue = data.condition_field === 'task_id' ? `task-${data.condition_value}` : data.condition_field === 'trainig_student_id' ? `user-${data.condition_value}` : `progress_trackings-${data.condition_value}`;
        setConditionValues(conditionValue);
        conditionValue = values.find(val => val.value == conditionValue.split('-')[0]).key;
        const updateSelectValuesStates = [
            { value: conditionValue, option: 'conditionValues' },
            { value: getYValues, option: 'graphsValues' },
            { value: getXValues, option: 'xValues' }]
        updateSelectValues(updateSelectValuesStates);
    };

    const jsonTemplate = () => {
        return (
            {
                title: title,
                condition_field: conditionValues.split('-')[0] == 'user' ? 'trainig_student_id' : conditionValues.split('-')[0] == 'task' ? 'task_id' : null,
                condition_value: conditionValues.split('-')[1],
                x_array: Object.keys(xValues).slice(1).map(value => value.split('-')[1]),
                x_table_name: Object.keys(xValues)[1].split('-')[0],
                y_array: Object.keys(graphsValues).slice(1).map(value => value.split('-')[1]),
                y_table_name: Object.keys(graphsValues)[1].split('-')[0]
            }
        )
    };

    const invalidSelected = (shouldDisplay) => {
        const updateIsSelected = {}
        shouldDisplay.map(item => (updateIsSelected[item] = { ...isSelected[item], invalid: true }));
        setIsSelected({ ...isSelected, ...updateIsSelected });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const shouldDisplay = Object.keys(isSelected).filter(item => !isSelected[item].selected);
        if (!shouldDisplay.length) {
            let dataTemplate = jsonTemplate();
            dataTemplate = {
                "title": dataTemplate.title,
                "owner_id": user.id,
                ...(training_student_id !== null && { "training_student_id": training_student_id }),
                "display_for_training_student": displayToStudent,
                "x_array": `ARRAY[${dataTemplate.x_array.map(item => `'${item}'`).join(', ')}]`,
                "x_table_name": dataTemplate.x_table_name,
                "y_array": `ARRAY[${dataTemplate.y_array.map(item => `'${item}'`).join(', ')}]`,
                "y_table_name": dataTemplate.y_table_name,
                ...(dataTemplate.condition_field !== null && { "condition_field": dataTemplate.condition_field }),
                "condition_value": dataTemplate.condition_value
            }
            if (mode == 'update') dataTemplate['id'] = data.id;
            else {
                dataTemplate['link'] = location.pathname;
                dataTemplate['date'] = `${new Date().toISOString().split('T')[0]}`;
            }

            const res = await postData(`graphs/${mode}`, dataTemplate);
            if (mode === 'create') {
                toast.current.show({ severity: 'success', summary: 'אישור', detail: 'הפילוח נוסף בהצלחה' })
                res.data.notifications.forEach(value => { if (user.role === value.role || user.id === value.user_id) setNotification([...notification, value]) });
            }
            else {
                toast.current.show({ severity: 'success', summary: 'אישור', detail: 'העדכון נשמר בהצלחה' });
            }
            setVisible(false);
            if (typeof fetchDataFunc == 'function') fetchDataFunc();
        }
        else {
            invalidSelected(shouldDisplay)
        }
    };

    const handleDisplayGraph = (e) => {
        e.preventDefault();
        const shouldDisplay = Object.keys(isSelected).filter(item => !isSelected[item].selected);
        if (!shouldDisplay.length) {
            setGraphTemplate(jsonTemplate());
            setDisplayGraph(true);
        }
        else {
            invalidSelected(shouldDisplay);
        }
    };

    const cancelSelect = (option) => {
        const unSelected = selectValues[option][0];
        let selectOptions = {};
        let selectedArray = Object.keys(isSelected).filter(item => isSelected[item].selected && item != option);
        selectedArray = selectedArray.map(item => Number(isSelected[item].key));
        Object.keys(selectValues).map(keyName => (keyName == option) ?
            selectOptions[option] = values.filter(val => !selectedArray.includes(val['key'])) :
            selectOptions[keyName] = isSelected[keyName].selected ? selectValues[keyName] : [...selectValues[keyName], unSelected]);
        setSelectValues(selectOptions);
        setIsSelected({ ...isSelected, [option]: { key: null, selected: false, invalid: false } });
    };

    const manageSelect = (value, option) => {
        if (typeof value == 'number' || (value[Object.keys(value)[0]] && 'checked' in value[Object.keys(value)[0]])) {
            let selectOptions = {};
            value = typeof (value) == 'number' ? value : Object.keys(value)[0];
            setIsSelected({ ...isSelected, [option]: { key: value, selected: true, invalid: false } });
            Object.keys(selectValues).map(keyName => (keyName == option) ?
                selectOptions[option] = values.filter(val => val['key'] == value) :
                selectOptions[keyName] = isSelected[keyName].selected ?
                    selectValues[keyName] :
                    values.filter(val => val['key'] != value && !Object.keys(isSelected).filter(item => isSelected[item].selected)?.map(item => Number(isSelected[item].key)).includes(val['key'])));
            setSelectValues(selectOptions);
        }
        else {
            cancelSelect(option);
        }
    };

    const selectCondition = (value) => {
        if (typeof (value) !== 'number') {
            setConditionValues(value);
            value = values.find(val => val.value == value.split('-')[0]).key;
            manageSelect(value, 'conditionValues');
        } else {
            setConditionValues(null);
            cancelSelect('conditionValues');
        }
    };

    return (
        <>
            <Toast ref={toast} />
            <Dialog className='dialog-graph' visible={visible} header={mode == 'create' ? 'הוספת פילוח נתונים' : 'עדכון פילוח קיים'} onHide={() => { if (!visible) return; setVisible(false); }}>
                <form className='form' onSubmit={handleSubmit}>
                    <div className='wrap-field' key={1}>
                        <div className='field-form'>
                            <div className='title-form'>
                                <label className='label-field'>כותרת</label>
                                <span className="required-star">*</span>
                            </div>
                            <InputText type='text' value={title} onChange={(e) => setTitle(e.target.value)} className='graph-field' id='graph-input' required />
                        </div>
                    </div>
                    <div className='wrap-field' key={2}>
                        <div className='field-form'>
                            <div className='title-form'>
                                <label className='label-field'>בחירת ערכים לציר ה X</label>
                                <span className="required-star">*</span>
                            </div>
                            <TreeSelect invalid={isSelected['xValues'].invalid} value={xValues} onChange={(e) => { setXValues(e.value); manageSelect(e.value, 'xValues') }} options={selectValues['xValues'] ? selectValues['xValues'] : values} metaKeySelection={false} className='graph-field' selectionMode="checkbox" display="chip" placeholder="בחירת ערכים לציר ה X" required></TreeSelect>
                        </div>
                    </div>
                    <div className='wrap-field' key={3}>
                        <div className='field-form'>
                            <div className='title-form'>
                                <label className='label-field'>בחירת ערכים לגרפים</label>
                                <span className="required-star">*</span>
                            </div>
                            <TreeSelect invalid={isSelected['graphsValues'].invalid} value={graphsValues} onChange={(e) => { setGraphsValues(e.value); manageSelect(e.value, 'graphsValues') }} options={selectValues['graphsValues'] ? selectValues['graphsValues'] : values} metaKeySelection={false} className='graph-field' selectionMode="checkbox" display="chip" placeholder="בחירת ערכים לגרפים" required></TreeSelect>
                        </div>
                    </div>
                    {training_student_id ? '' :
                        <div className='wrap-field' key={4}>
                            <div className='field-form'>
                                <div className='title-form'>
                                    <label className='label-field'>בחירת ערך לתנאי</label>
                                    <span className="required-star">*</span>
                                </div>
                                <TreeSelect invalid={isSelected['conditionValues'].invalid} value={conditionValues} onChange={(e) => selectCondition(e.value)} options={selectValues['conditionValues'] ? selectValues['conditionValues'] : values} className='graph-field' placeholder="בחירת ערך לתנאי" selectionMode="single" required></TreeSelect>
                            </div>
                        </div>
                    }
                    {
                        displayGraph ?
                            <div className='display-graph'>
                                <ProgressGraph data_progress={graphTemplate}></ProgressGraph>
                            </div>
                            : ''
                    }
                    {training_student_id ?
                        <div className='wrap-field-checkbox' key={5}>
                            <div className='field-form'>
                                <Checkbox onChange={e => setDisplayToStudent(e.checked)} checked={displayToStudent}></Checkbox>
                                <div className='title-form'>
                                    <label className='label-field'>האם להציג פילוח זה בתיק אישי של המוכשרת?</label>
                                </div>
                            </div>
                        </div> : ''
                    }

                    <div className='wrap-submit-graph-form'>
                        <Button label="הצגת הגרף" severity="secondary" text raised className='submit-form' onClick={handleDisplayGraph} />
                        <Button label="שמירה" severity="secondary" text raised className='submit-form' type='submit' />
                    </div>
                </form>
            </Dialog>
        </>
    );
};

export default AddProgressGraph