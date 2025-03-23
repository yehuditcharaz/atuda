import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getData } from '../../services/axios';
import { UserContext } from '../../contexts/UserContext/UserContext';
import { Rating } from 'primereact/rating';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import DynamicTable from '../DynamicTable/DynamicTable';
import './PersonalTable.css';
import { TaskContext } from '../../contexts/TaskContext/TaskContext';
import StarRathingInfo from '../StarRathingInfo/StarRathingInfo';

const PersonalTable = ({ details, config, trainingStudents, expandedUserId, allowChangeDone, filterKeyword, pressingIcon, editOption, funcSave, deleteLast, fetchDataFunc }) => {
    const nav = useNavigate();
    const { user } = useContext(UserContext);
    const { setTask } = useContext(TaskContext);
    const [mentorsList, setMentorsList] = useState(null);
    const [tasksList, setTasksList] = useState(null);
    const [trainingStudentsList, setTrainingStudentsList] = useState(null);

    const filterData = (matchedDetails) => {
        const ans = matchedDetails.map(item => {
            const rowData = {};
            Object.keys(item).forEach((key, i) => {
                const columnConfig = config.columns.find(col => col.name === key);
                if (columnConfig) {
                    if (columnConfig.name === 'start_date' || columnConfig.name === 'end_date') {
                        if (item[key] === null)
                            rowData[key] = null
                        else
                            rowData[key] = item[key].substring(0, 10);
                    }
                    else if (i > 5 && i < 13) {
                        rowData[key] = { value: item[key], element: <Rating stars={6} value={item[key]} cancel={false} /> };
                    } else if (i === 14) {
                        if (allowChangeDone === true) {
                            if (item[key] === null)
                                rowData[key] = ''
                            else
                                rowData[key] = { value: item[key], element: <Checkbox checked={item[key]}></Checkbox> };
                        }
                        else {
                            if (item[key] === null)
                                rowData[key] = ''
                            else
                                rowData[key] = { value: item[key], element: <Checkbox disabled checked={item[key]}></Checkbox> };
                        }
                    } else if (i === 3) {
                        rowData[key] = {
                            value: item[key], element: (
                                <span className="navigation-icon" onClick={() => handleTaskNavigation(item[key].value ? item[key].value : item[key])}>
                                    {item[key].value ? item[key].value : item[key]}
                                </span>
                            )
                        };
                    } else {
                        if (item[key] === null)
                            rowData[key] = ''
                        else
                            rowData[key] = item[key];
                    }
                }
            });
            return shouldInclude ? rowData : null;
        })
        return filterKeyword ? ans.filter(row =>
            Object.values(row).some(value =>
                String(value).toLowerCase().includes(filterKeyword.toLowerCase())
            )) : ans
    }

    const handleTaskNavigation = async (taskId) => {
        try {
            let response = await getData('/task/read', { condition: `label='${taskId}'` });
            setTask(response.data[0]);
            user.role === 'מנטור' ? nav(`/mentor/tasksList/task/${taskId}`, { state: { label: taskId } }) :
                nav(`/manager/tasksList/task/${taskId}`, { state: { label: taskId } });
        } catch (error) {
            console.error(error);
        }
    };

    const edit = (details) => {
        const ans = user.role === 'מנהל' ? details.map(detail => detail.id) : details.map(detail => (detail.mentor_id.id == user.id ? detail.id : 0));
        return ans
    }

    const dropdownItems = (options) => {
        if (options) {
            return options.map(option => ({
                label: option.name,
                value: option.id
            }));
        }
        return [];
    }
    const getOptionsSelect = async (route_name, select_item, condition) => {
        const response = await getData(`${route_name}/read`, { condition: condition, select: ['id', `${select_item} as name`] })
        const sortedData = response.data.slice().sort((a, b) => a.id - b.id);
        return <Dropdown
            options={dropdownItems(sortedData)}
        />
    }

    const fetchData = async () => {
        const mentorsData = await getOptionsSelect('user', 'name', `role='מנטור'`);
        const trainingStudentsData = await getOptionsSelect('user', 'name', `role='מוכשרת'`);
        const tasksData = await getOptionsSelect('task', 'label');

        setMentorsList(mentorsData);
        setTrainingStudentsList(trainingStudentsData);
        setTasksList(tasksData);
    };
    useEffect(() => {
        fetchData();
    }, []);

    let shouldInclude = true;
    let matchedDetails
    return (
        trainingStudents.map((student, index) => {
            if (student.id !== expandedUserId) {
                return null;
            }
            if (user.id === student.mentor_id || user.role === 'מנהל') {
                matchedDetails = details.filter(detail => detail.trainig_student_id === student.id);
            }
            else {
                matchedDetails = details.filter(detail => detail.trainig_student_id === student.id && (detail.mentor_id.value ? detail.mentor_id.value : detail.mentor_id) === user.name);
            }
            return tasksList && mentorsList && trainingStudentsList ? (
                <>
                    <div key={index}>
                        <DynamicTable
                            data={filterData(matchedDetails)}
                            tableName='progress_trackings'
                            routerName='progress_trackings'
                            edit={editOption ? edit(matchedDetails) : []}
                            elements={{
                                task_id: tasksList,
                                mentor_id: mentorsList,
                                trainig_student_id: trainingStudentsList,
                                execution_level: <Rating stars={6} cancel={false} value={0} />,
                                comprehension_rate: <Rating stars={6} cancel={false} value={0} />,
                                communication_frequency: <Rating stars={6} cancel={false} value={0} />,
                                conduct_in_git: <Rating stars={6} cancel={false} value={0} />,
                                response_to_code_review: <Rating stars={6} cancel={false} value={0} />,
                                serving_speed: <Rating stars={6} cancel={false} value={0} />,
                                drawing_conclusions: <Rating stars={6} cancel={false} value={0} />,
                                done: <Checkbox checked={true}></Checkbox>,
                            }}
                            functions={{ done: pressingIcon, save: funcSave, deleteLast: deleteLast }}
                            fetchData={fetchDataFunc}
                        />
                    </div>
                    <StarRathingInfo />
                </>
            ) : '';
        })
    );
};

export default PersonalTable;