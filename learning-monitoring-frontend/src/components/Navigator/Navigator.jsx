import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getData } from '../../services/axios';
import { MegaMenu } from 'primereact/megamenu';
import UserProfile from '../UserProfile/UserProfile';
import SecondaryRouting from '../SecondaryRouting/SecondaryRouting';
import './Navigator.css';
import { useCookies } from 'react-cookie';
import { UserContext } from '../../contexts/UserContext/UserContext';
import Notifications from '../Notifications/Notifications';
import DisplayDate from '../DisplayDate/DisplayDate';


const Navigator = ({ user, student_id, task }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [items, setItems] = useState([]);
    const [selectedTask, setSelectedTask] = useState(task ? task : null);
    const [cookies, setCookie] = useCookies(['lastVisitedPages']);
    const user1 = useContext(UserContext);

    const updateCookie = (path) => {
        const timestamp = new Date().toISOString().split('T')[0];
        setCookie('lastVisitedPages', { ...cookies.lastVisitedPages, [user1.user.id]: { path, timestamp } });
    }

    const handleTask = async () => {
        try {
            const response = await getData('task/read', { condition: 'id=1' });
            const firstTask = response.data[0];
            return firstTask ? firstTask.label : null;
        } catch (error) {
            console.error('Error fetching first task:', error);
            return null;
        }
    };

    useEffect(() => {

        const handleTaskSelection = (selectedTask) => {
            selectedTask ? navigate(`/${user}/tasksList/task/${selectedTask}`, { state: { label: selectedTask } }) : navigate(`/${user}/tasksList`);
        };
        const fetchData = async () => {
            try {
                const updatedItems = [];
                const task1 = await getData('task/read', { condition: 'id=1' });

                updatedItems.push({
                    label: <UserProfile />,
                    className: 'no-hover'
                });

                updatedItems.push({
                    label: 'מידע כללי',
                    command: () => {
                        navigate(`/${user}/generalInformation`);
                        updateCookie(`/${user}/generalInformation`)
                    },
                    icon: 'pi pi-warehouse',
                    className: location.pathname === `/${user}/generalInformation` ? 'active' : '',
                });

                if (user === 'manager') {
                    updatedItems.push({
                        label: 'ניהול משתמשים',
                        command: () => {
                            navigate(`/${user}/users`);
                            updateCookie(`/${user}/users`)
                        },
                        icon: 'pi pi-users',
                        className: location.pathname === `/${user}/users` ? 'active' : '',
                    })
                }
                if (user === 'mentor') {
                    updatedItems.push({
                        label: 'רשימת המוכשרות',
                        command: () => {
                            navigate(`/${user}/users`);
                            updateCookie(`/${user}/users`)
                        },
                        icon: 'pi pi-users',
                        className: location.pathname === `/${user}/users` ? 'active' : '',
                    })
                }
                if (user === 'mentor' || user === 'manager') {
                    const selectedTaskLabel = encodeURIComponent(task);
                    const encodedLabel = encodeURIComponent(task1.data[0] && 'label' in task1.data[0] ? task1.data[0].label : '');
                    const label = await handleTask();

                    if (location.pathname === `/${user}/tasksList/task/${encodedLabel}`) {
                        setSelectedTask(label);
                    }
                    else {
                        setSelectedTask(task);
                    }

                    updatedItems.push(
                        {
                            label: 'מעקב התקדמות',
                            command: () => {
                                navigate(`/${user}/progressTracking`);
                                updateCookie(`/${user}/progressTracking`)
                            },
                            icon: 'pi pi-file-check',
                            className: location.pathname === `/${user}/personalFile/${student_id}` || location.pathname === `/${user}/progressTracking` ? 'active' : '',
                        },
                        {
                            label: 'מאגרי ידע למשימה',
                            command: () => {
                                handleTaskSelection(encodedLabel);
                                updateCookie(encodedLabel ? `/${user}/tasksList/task/${encodedLabel}` : `/${user}/tasksList`);
                            },
                            icon: 'pi pi-clipboard',
                            className: location.pathname === `/${user}/tasksList/task/${encodedLabel}` || location.pathname === `/${user}/tasksList/task/${selectedTaskLabel}` || location.pathname === `/${user}/tasksList` ? 'active' : '',
                        },
                        {
                            label: 'פילוחי נתונים',
                            command: () => {
                                navigate(`/${user}/dataSegmentation`);
                                updateCookie(`/${user}/dataSegmentation`)
                            },
                            icon: 'pi pi-image',
                            className: location.pathname === `/${user}/dataSegmentation` ? 'active' : '',
                        }
                    );
                }

                if (user === 'trainingStudent') {
                    updatedItems.push(
                        {
                            label: 'צפיה בתיק אישי',
                            command: () => {
                                navigate(`/${user}/personalFile`);
                                updateCookie(`/${user}/personalFile`)
                            },
                            icon: 'pi pi-folder-open',
                            className: location.pathname === `/${user}/personalFile` ? 'active' : '',
                        },
                        {
                            label: 'שליחת סטטוס',
                            command: () => {
                                navigate(`/${user}/dailyStatus`);
                                updateCookie(`/${user}/dailyStatus`)
                            },
                            icon: 'pi pi-users',
                            className: location.pathname === `/${user}/dailyStatus` ? 'active' : '',
                        },
                        {
                            label: 'מעקב נוכחות',
                            command: () => {
                                navigate(`/${user}/attendanceReport`);
                                updateCookie(`/${user}/attendanceReport`)
                            },
                            icon: 'pi pi-file-check',
                            className: location.pathname === `/${user}/attendanceReport` ? 'active' : '',
                        },
                        {
                            label: 'הסטורית סטטוס',
                            command: () => {
                                navigate(`/${user}/statusHistory`);
                                updateCookie(`/${user}/statusHistory`)
                            },
                            icon: 'pi pi-file-check',
                            className: location.pathname === `/${user}/statusHistory` ? 'active' : '',
                        },
                        {
                            template: <DisplayDate item={{
                                icon: 'pi pi-clock',
                                label: `מספר שעות שבועיות`
                            }} />,
                            className: ['margin-nav-student', 'no-hover']
                        }
                    );
                }

                updatedItems.push(
                    {
                        template: <DisplayDate item={{ icon: 'pi pi-calendar p-overlay-badge' }} />,
                        className: [`margin-date-${user}`, 'no-hover']
                    },
                    {
                        label: <Notifications />,
                        className: ['no-hover', 'notification-bell']
                    }
                );

                setItems(updatedItems);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [user, navigate, location.pathname, task]);

    const activeItemIndex = items.findIndex(item => item.className === 'active');
    const activeItem = activeItemIndex !== -1 ? items[activeItemIndex] : null;
    const currentIcon = activeItem ? activeItem.icon : '';

    let labelI
    if (activeItemIndex !== -1) {
        labelI = items[activeItemIndex].label
    }

    return (
        <div className="tab-container nav-menu" style={{ display: 'flex', justifyContent: 'center', alignContent: 'flex-end' }}>
            <MegaMenu model={items} style={{ borderRadius: '3rem' }} />
            <SecondaryRouting user={user} currentPath={location.pathname} student_id={student_id} currentLocation={labelI} currentIcon={currentIcon} task1={selectedTask} />
        </div>
    );
};

export default Navigator;