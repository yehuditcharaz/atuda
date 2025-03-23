import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import React,{ useContext, useEffect, useState } from 'react';
import { getData } from '../../services/axios';
import logo from './../../styles/logo.png'
import { TaskContext } from '../../contexts/TaskContext/TaskContext';
import { Button } from 'primereact/button';
import { UserContext } from '../../contexts/UserContext/UserContext';
import { useCookies } from 'react-cookie';
import LastVisitedPages from '../../components/Cookie/Cookie';

const HomePage = ({ user }) => {
    const [cards, setCards] = useState([])
    const [homeTitle, setHomeTitle] = useState('')
    const navigate = useNavigate()
    const { setTask } = useContext(TaskContext)
    const { setUser } = useContext(UserContext);
    const user1 = useContext(UserContext);
    const [cookies, setCookie] = useCookies(['lastVisitedPages']);

    const signOut = () => {
        navigate('/');
        setUser(undefined);
    };

    const updateCookie = (path) => {
        const timestamp = new Date().toISOString().split('T')[0];
        setCookie('lastVisitedPages', { ...cookies.lastVisitedPages, [user1.user.id]: { path, timestamp } });
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const allCards = [];
                const currentTask = await getData('task/read', { condition: 'id=1' });
                setTask(currentTask.data[0]);
                allCards.push({
                    title: 'מידע כללי',
                    subTitle: 'מידע כללי אודות תהליך ההכשרה',
                    navigate: 'generalInformation',
                    icon: '❗'
                });
                if (user === 'manager') {
                    allCards.push({
                        title: 'ניהול משתמשים',
                        subTitle: 'מידע אודות המשתמשים',
                        navigate: 'users',
                        icon: '👥'
                    });
                }
                if (user === 'mentor') {
                    allCards.push({
                        title: 'רשימת המוכשרות',
                        subTitle: 'מידע אודות המוכשרות שלך',
                        navigate: 'users',
                        icon: '👥'
                    });
                }
                if (user === 'mentor' | user === 'manager') {
                    setHomeTitle('כאן תוכלי לדווח על תהליך ההכשרה של המוכשרת שלך, לפלח נתונים ולקבל ידע על משימות ההכשרה');
                    allCards.push(
                        {
                            title: 'מעקב התקדמות',
                            subTitle: 'כאן תוכלי לעקוב אחר ציוני המוכשרות',
                            navigate: 'progressTracking',
                            icon: '🏷️'
                        },
                        {
                            title: 'מאגרי ידע למשימה',
                            subTitle: 'מאגרי ידע למשימות ההכשרה',
                            navigate: currentTask.data[0] && 'label' in currentTask.data[0]?`tasksList/task/${currentTask.data[0].label}`:`tasksList`,
                            icon: '📈'
                        },
                        {
                            title: 'פילוחי נתונים',
                            subTitle: 'פילוח נתונים אודות כלל המוכשרת',
                            navigate: 'dataSegmentation',
                            icon: '📋'
                        }

                    );
                }
                else {
                    setHomeTitle('.שאת מבצעת PTC -כאן תוכלי לקבל ידע על משימות ה')
                    allCards.push(
                        {
                            title: 'תיק אישי',
                            subTitle: 'כאן תוכלי להכנס לתיק האישי שלך',
                            navigate: 'personalFile',
                            icon: '🏷️'
                        },
                        {
                            title: 'סטטוס יומי',
                            subTitle: 'שליחת סטטוס יומי',
                            navigate: 'dailyStatus',
                            icon: '📢'
                        },
                        {
                            title: 'מעקב נוכחות',
                            subTitle: 'מעקב אחר דוח הנוכחות שלך',
                            navigate: 'attendanceReport',
                            icon: '⏰'
                        },
                        {
                            title: 'היסטורית סטטוס',
                            subTitle: 'היסטוריית הסטטוסים שלך',
                            navigate: 'statusHistory',
                            icon: '📢'
                        }

                    );
                }
                setCards(allCards)
                console.log(allCards);

            } catch (error) {
                console.error(error.message);
            }
        };
        fetchData();
    }, []);

    return (
        <>
            <div className='home-page'>
                <div className='home-title'>
                    <div>
                        <h1>ברוכה הבאה למערכת מעקב למידה</h1>
                        <h3>{homeTitle}</h3>
                    </div>
                    <div className='logo-image'>
                        <img src={logo} alt="Logo" />
                    </div>
                </div>

                <div className='cards'>
                    {cards ?
                        cards.map((card, key) =>
                            (
                                <div key={key} className="one-card">
                                <Card title={card.title} subTitle={card.subTitle} header={<span className='tag-route'>{card.icon}</span>} className="md:w-10rem" onClick={() => {
                                    updateCookie(`/${user}/${card.navigate}`);
                                    navigate(`/${user}/${card.navigate}`);
                                }}>
                                </Card>
                            </div>
                        )
                    )
                    : ''
                }

                </div>
            </div>
            <div className="div-sign-out">
                <Button className="sign-out" icon="pi pi-sign-out" onClick={signOut} />
            </div>
                <LastVisitedPages/>

        </>
    );
};
export default HomePage;