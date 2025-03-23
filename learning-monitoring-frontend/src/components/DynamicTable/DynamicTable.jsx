import React, { useState, useEffect, useRef } from 'react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { postData, getData } from '../../services/axios';
import { ContextMenu } from 'primereact/contextmenu';
import './DynamicTable.css';
import { validateCodeReview, validateProgressTracking, validateUser } from '../../validations/client-validation';
import { FilterService } from "primereact/api";
import { Dropdown } from 'primereact/dropdown';



const DynamicTable = ({ data, tableName, routerName, edit = [], elements = {}, functions = {}, fetchData = null, disabledColumns = [] }) => {

    const [tableData, setTableData] = useState([]);
    const [columnsNames, setColumnsNames] = useState([]);
    const [checkedFlag, setCheckedFlag] = useState(false);
    const [, setInvalidFields] = useState([]);
    const selectedCellValue = useRef('');
    const toast = useRef(null);
    const contextMenuRef = useRef(null);
    const [deletedRow, setDeletedRow] = useState(null);
    const [visibleDialog, setVisibleDialog] = useState(false);
    const profiles = useState([
        "פרופיל א",
        "פרופיל ב",
        "לא פעילה"
    ])
    FilterService.register('custom_sentence.value', (value, filters) => {
        if (!filters) return true;
        if (!value) return false;
        return extractTextFromHTML(String(value)).toLowerCase().includes(filters.toLowerCase())
    })

    const menuModel = [
        {
            label: 'העתקה',
            icon: 'pi pi-copy',
            className: 'copy-value',
            command: () => { navigator.clipboard.writeText(selectedCellValue.current) }
        },
    ];

    const onContextMenuCell = (cellData, e) => {
        e.preventDefault();
        selectedCellValue.current = cellData;
        contextMenuRef.current.show(e);
    };

    const getTranslateColumns = async () => {
        const configResponse = await getData(`/config/getColumnNames/${tableName}`);
        let columns = configResponse.data.columns.reduce((acc, column) => {
            acc[column.name] = column.translate;
            return acc;
        }, {});
        if (tableName == 'attendance_reports' && tableData[0]) {
            let updateColumns = {};
            Object.keys(tableData[0]).filter(key => !Object.keys(columns).includes(key)).map(item => { updateColumns[item] = item });
            columns = { ...columns, ...updateColumns };
        }
        setColumnsNames(columns);
    };

    useEffect(() => {
        if (data && data.length) {
            const sortedData = data.slice().sort((a, b) => a.id - b.id);
            setTableData(sortedData);
        }
        getTranslateColumns();
    }, [data, edit]);

    const checkRequiredFields = async (updatedData, data) => {
        let formFields = await getData(`/config/getTable/${tableName}`);
        formFields = formFields.data.columns;
        formFields = formFields.filter(field => field.type.includes('NOT NULL'))?.map(field => field.name);
        formFields = formFields.filter(field => updatedData[field] == null && data[field])
        setInvalidFields(formFields);
        return !formFields.length;
    }

    const handleEdit = async (e) => {
        try {
            const updatedData = Object.keys(e.newData).reduce((acc, key) => {
                if (typeof e.newData[key] === 'object' && e.newData[key] != null && 'element' in e.newData[key]) {
                    acc[key] = e.newData[key].value.id ? e.newData[key].value.id : e.newData[key].value.value && e.newData[key].value.value.id ? e.newData[key].value.value.id : e.newData[key].value;
                } else {
                    acc[key] = e.newData[key] ? e.newData[key].value ? e.newData[key].id : e.newData[key] : null;
                }
                return acc;
            }, {});
            if (routerName == 'progress_trackings') {
                const mentorId = await getData('user/read', { condition: `id=${updatedData.trainig_student_id}` })
                if (mentorId != updatedData.mentor_id) {
                    await postData('user/update', {
                        id: updatedData.trainig_student_id,
                        mentor_id: updatedData.mentor_id
                    })
                }
            }
            const requiredFieldsAreValid = await checkRequiredFields(updatedData, e.data);
            if (!requiredFieldsAreValid) {
                toast.current.show({ severity: 'error', summary: 'שגיאה', detail: 'אין אפשרות לשמור את השינויים ללא עדכון השדות הנדרשים', life: 5000 })
                return;
            }
            let validateFlag = true;
            const res = routerName === 'user' ? validateUser(updatedData, 'update') :
                routerName === 'progress_trackings' ? validateProgressTracking(updatedData, 'update') :
                    routerName === 'codeReview' ? validateCodeReview(updatedData, 'update') :
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
                await postData(`/${routerName}/update`, updatedData);
                toast.current.show({ severity: 'success', summary: 'עדכון', detail: 'העדכון נשמר בהצלחה' });
                if (e.data.done && e.data.done.value != (e.newData.done.value != undefined ? e.newData.done.value : e.newData.done) && functions['save']) functions['save'](checkedFlag, updatedData);
                else if (typeof fetchData == 'function') fetchData();
            }
        } catch (error) {
            console.error('Error updating row:', error);
        }
    };

    const accept = () => {
        handleDeleteRow(deletedRow);
        toast.current.show({ severity: 'success', summary: 'אישור', detail: 'המחיקה בוצעה' });
        setVisibleDialog(false);
    }

    const confirmDelete = (rowData) => {
        setDeletedRow(rowData);
        setVisibleDialog(true);
    };

    const handleDeleteRow = async (rowData) => {
        try {
            await postData(`/${routerName}/delete`, { id: rowData.id });
            const updatedTableData = tableData.filter(row => row.id !== rowData.id);
            setTableData(updatedTableData);
            if (typeof fetchData == 'function') fetchData();
            if (functions['deleteLast'] && updatedTableData.length < 1) functions['deleteLast']();
        } catch (error) {
            console.error('Error deleting row:', error);
        }
    };

    const rowActionsTemplate = (rowData) => {
        return (
            <div>
                {edit.includes(rowData['id']) && (
                    <Button
                        icon="pi pi-trash"
                        className="p-button-rounded p-button-danger p-button-text"
                        onClick={() => confirmDelete(rowData)}
                        aria-label="Delete"
                    />
                )}
            </div>
        );
    };

    const onChange = (value, ele) => {
        let selecetedValue = ele.props && ele.props.options ? ele.props.options.find(val => val.value == value) : value;
        selecetedValue = selecetedValue ? selecetedValue == value ? selecetedValue : { id: selecetedValue.value, value: selecetedValue.label } : null;
        return selecetedValue
    }

    const textEditor = (options) => {
        const { field } = options;
        let editorComponent = (elements[field] ? elements[field] : '') || <InputText disabled={disabledColumns.includes(field)} type={field.includes('date') ?
            'date' : field.includes('study_year') ? "number" : 'text'} value={options.value != null ? options.value.value != null ? options.value.value : options.value : ''} onChange={(e) => options.editorCallback(e.target.value)} />
        return editorComponent.props.checked ? React.cloneElement(editorComponent, {
            ...editorComponent.props,
            checked: options.value != null ? options.value.value != null ? options.value.value : options.value : '',
            onChange: (e) => {
                setCheckedFlag(e.checked)
                options.editorCallback(e.checked); if (functions && functions[field]) {
                    functions[field](e.checked);
                }
            }
        }) :
            field == 'sentence' ? React.cloneElement(editorComponent, {
                ...editorComponent.props,
                value: options.value != null ? options.value.value != null ? options.value.value : options.value : '',
                onTextChange: (e) => options.editorCallback(e.htmlValue)
            }) :
                elements[field] ? React.cloneElement(editorComponent, {
                    ...editorComponent.props,
                    value: options.value != null ? options.value.value != null ? options.value.value : options.value : '',
                    onChange: (e) => options.editorCallback(typeof e.target.value == 'number' ? onChange(e.target.value, elements[field]) : e.target.value)
                }) : editorComponent;
    };

    const allowEdit = (rowData) => {
        return edit.includes(rowData['id'])
    };

    const profileRowFilterTemplate = (options) => {
        return (
            <Dropdown value={options?.value} options={profiles[0]} onChange={(e) => options?.filterApplyCallback(e.value)} placeholder="חיפוש לפי פרופיל" className="p-column-filter" showClear style={{ minWidth: '12rem' }} />
        );
    };
    const extractTextFromHTML = (html) => {
        const div = document.createElement("div");
        div.innerHTML = html;
        return div.textContent || div.innerText || "";
    };
    let columns = Object.entries(data[0] || {}).map(([key,value]) => (key !== 'id' && (key != 'trainig_student_id') ?
        <Column
            key={key}
            filterField={typeof value === 'object' ? typeof value?.value === 'object' ? `${key}.value.value` : `${key}.value` : key}
            field={key}
            header={columnsNames[key]}
            body={(rowData) => {
                const cellValue = rowData[key];
                const displayValue = cellValue ? cellValue.element ? cellValue.element : cellValue.value ? cellValue.value : cellValue : '';
                return (
                    <span onContextMenu={(e) => onContextMenuCell(displayValue, e)}>
                        {displayValue}
                    </span>
                );
            }}
            filter
            showFilterMenu={key == 'sentence' || key == 'profile' ? false : true}
            filterMatchMode={key == 'sentence' ? "custom" : null}
            filterElement={key == 'profile' ? profileRowFilterTemplate : null}
            filterPlaceholder={`חיפוש ${columnsNames[key]}`}
            editor={(options) => textEditor(options)}
        /> : null
    ));
    columns = edit.length ? [...columns,
    <Column key="updateRow" rowEditor={allowEdit} headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>,
    <Column key="deleteRow" body={rowActionsTemplate} headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>] : columns

    return (
        <div id='table'>
            <Toast ref={toast} />
            <ContextMenu model={menuModel} ref={contextMenuRef} />
            <ConfirmDialog
                group='declarative'
                visible={visibleDialog}
                onHide={() => setVisibleDialog(false)}
                message='?האם את בטוחה שברצונך למחוק שורה זו'
                header='אישור מחיקה'
                icon='pi pi-info-circle'
                defaultFocus='reject'
                acceptClassName='p-button-danger'
                accept={accept}
                acceptLabel='כן'
                rejectLabel='לא'
            />
            <DataTable value={tableData}
                editMode="row"
                dataKey="id"
                onRowEditComplete={handleEdit}
                filterDisplay="row"
                className="p-datatable-sm"
                emptyMessage="אין נתונים זמינים">
                {columns}
            </DataTable>
        </div>
    );
};

export default DynamicTable;