import React, { useContext, useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { TabPanel, TabView } from 'primereact';
import { getData } from '../../services/axios';
import { useNavigate } from 'react-router-dom';
import PersonalTable from '../PersonalTable/PersonalTable';
import { UserContext } from '../../contexts/UserContext/UserContext';
import './ProgressTrackingTable.css';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useCookies } from 'react-cookie';
import DynamicForm from '../DynamicForm/DynamicForm';
import StarRathingInfo from '../StarRathingInfo/StarRathingInfo';

const ProgressTrackingTable = () => {
    const { user } = useContext(UserContext);
    const [showForm, setShowForm] = useState(false);
    const [filterKeyword, setFilterKeyword] = useState('');
    const [expandedRows, setExpandedRows] = useState(null);
    const [isActive, setIsActive] = useState(false);
    const [details, setDetails] = useState();
    const [trainingStudents, setTrainingStudents] = useState();
    const [config, setConfig] = useState();
    const nav = useNavigate();
    const [cookies, setCookie] = useCookies(['lastVisitedPages']);
    const [formKey, setFormKey] = useState(0);


    const updateCookie = (path) => {
        const timestamp = new Date().toISOString().split('T')[0];
        setCookie('lastVisitedPages', { ...cookies.lastVisitedPages, [user.id]: { path, timestamp } });
    }

    const fetchData = async () => {
        let users = [], tasks = [], progress_data = [];
        await getData('user/read')
            .then(data => {
                users = data.data;
                setTrainingStudents(data.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        await getData('task/read')
            .then(data => {
                tasks = data.data;
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        await getData('progress_trackings/read')
            .then(data => {
                progress_data = data.data;
                progress_data = progress_data.map(progress => ({ ...progress, mentor_id: users.find(user => user.id == progress.mentor_id)?.name, task_id: tasks.find(task => task.id == progress.task_id)?.label }));
                setDetails(progress_data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        await getData('config/getColumnNames/progress_trackings')
            .then(data => {
                setConfig(data.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    useEffect(() => {
        fetchData();
    }, []);

    const getUserById = (userId) => {
        return trainingStudents.find(user => user.id === userId) || {};
    };

    const addNamesPail = () => {
        const uniqueNames = new Set();
        const result = [];
        let filteredIDs
        if (details && trainingStudents) {
            if (user.role === 'מנהל') {
                filteredIDs = trainingStudents
                    .filter(item => item.profile === "פרופיל א" || item.profile === "פרופיל ב")
                    .map(item => item.id);
            }
            else {
                filteredIDs = trainingStudents
                    .filter(item => item.mentor_id === user.id ? (item.profile === "פרופיל א" || item.profile === "פרופיל ב") :
                        (item.profile === "פרופיל א" || item.profile === "פרופיל ב") && details.find(i => i.mentor_id === user.name && i.trainig_student_id === item.id))
                    .map(item => item.id)
            }
            details.forEach((detail) => {
                const user = getUserById(detail.trainig_student_id);
                if (!uniqueNames.has(user.name) && filteredIDs.includes(detail.trainig_student_id)) {
                    result.push({ ...detail, name: user.name || "Unknown" });
                    uniqueNames.add(user.name);
                }
            });
            return result;
        }
        return result;
    };

    const addNamesNoPail = () => {
        const uniqueNames = new Set();
        const result = [];
        let filteredIDs
        if (details && trainingStudents) {
            if (user.role === 'מנהל') {
                filteredIDs = trainingStudents
                    .filter(item => item.profile === "לא פעילה")
                    .map(item => item.id);
            }
            else {
                filteredIDs = trainingStudents
                    .filter(item => item.mentor_id === user.id ? item.profile === "לא פעילה" :
                        item.profile === "לא פעילה" && details.find(i => i.mentor_id === user.id && i.trainig_student_id === item.id))
                    .map(item => item.id)
            }
            details.forEach((detail) => {
                const user = getUserById(detail.trainig_student_id);
                if (!uniqueNames.has(user.name) && filteredIDs.includes(detail.trainig_student_id)) {
                    result.push({ ...detail, name: user.name || "Unknown" });
                    uniqueNames.add(user.name);
                }
            });
            return result;
        }
        return result;
    };

    const handleNavigateToPersonalFile = (id) => {
        const path = user.role === 'מנטור' ? `/mentor/personalFile/${id}` : `/manager/personalFile/${id}`;
        updateCookie(path);
        nav(path)
    }

    const expandAllRows = () => {
        isActive
            ? setExpandedRows(addNamesNoPail())
            : setExpandedRows(addNamesPail());
    };

    const collapseAllRows = () => {
        setExpandedRows(null);
    };

    const handleAddButtonClick = () => {
        setShowForm(true);
        setFormKey(prevKey => prevKey + 1);
    };

    return (
        <div>
            <div className='btnandtabs'>
                <div className='tabim'>
                    <TabView className='TabView' activeIndex={isActive ? 1 : 0} onTabChange={(e) => setIsActive(e.index === 1)}>
                        <TabPanel className='TabPanel' header="פעילה"></TabPanel>
                        <TabPanel className='TabPanel' header="לא פעילה"></TabPanel>
                    </TabView>
                </div>
                <div className='buttos-expand-collapse'>
                    <Button label="+ הרחב הכל" className="p-button-sm" onClick={expandAllRows} />
                    <Button label="- כווץ הכל" className="p-button-sm p-button-secondary" onClick={collapseAllRows} />
                </div>
            </div>
            <div className='addandsearch'>
                <div className='inputsearch'>
                    <InputText className="input" type="text" placeholder='הזן ערך לחיפוש' value={filterKeyword} onChange={(e) => setFilterKeyword(e.target.value)} />
                    <span id='icon' className='pi pi-search'></span>
                </div>
                <div className='btnadd'>
                    <Button label="הוספה" severity="secondary" text raised className='add' onClick={() => { handleAddButtonClick() }} />
                </div>
            </div>
            {details && trainingStudents && (
                <>
                    {showForm ? <DynamicForm key={formKey} table_name={'progress_trackings'} route_name={'progress_trackings'} fetchData={fetchData} initializeFormData={{start_date: new Date().toISOString().slice(0, 10)}}></DynamicForm> : ''}
                    <DataTable
                        className='table-container'
                        value={
                            isActive
                                ? addNamesNoPail()
                                : addNamesPail()
                        }
                        rowExpansionTemplate={(data) => (
                            <PersonalTable
                                details={details}
                                config={config}
                                trainingStudents={trainingStudents}
                                expandedUserId={data.trainig_student_id}
                                allowChangeDone={false}
                                filterKeyword={filterKeyword}
                                editOption={false}
                            />
                        )}
                        expandedRows={expandedRows}
                        onRowToggle={(e) => setExpandedRows(e.data)}
                    >
                        <Column expander header="פרטים" style={{ width: '1px' }} expanderIcon="pi pi-caret-left" />
                        <Column header="כניסה לתיק האישי" style={{ width: '1px' }} body={(rowData) => (
                            <span onClick={() => handleNavigateToPersonalFile(rowData.trainig_student_id)}>📁</span>
                        )} />
                        <Column field="name" header="שם מוכשרת" style={{ width: '300px' }} />
                    </DataTable>
                </>
            )}
            <StarRathingInfo/>
        </div>
    );
};

export default ProgressTrackingTable;