
import React, { useContext, useState, useEffect } from 'react';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { useNavigate } from "react-router-dom";
import { InputText } from 'primereact/inputtext';
import { getData, postData, postLogin } from '../../services/axios';
import './Login.css'
import { UserContext } from '../../contexts/UserContext/UserContext';
import { NotificationContext } from '../../contexts/NotificationContext/NotificationContext'
import { AttendanceWeekHours } from '../../contexts/AttendanceWeekHours/AttendanceWeekHours';
import logo from './../../styles/logo.png'
import { Avatar } from 'primereact/avatar';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [, setLogin] = useState('');
    const [attempts, setAttempts] = useState(0);
    const [showLoginForm, setShowLoginForm] = useState(true);
    const [userNotFound, setUserNotFound] = useState(false);
    const [wrongPassword, setWrongPassword] = useState(false);
    const { user, setUser } = useContext(UserContext);
    const { notification, setNotification } = useContext(NotificationContext);
    const { updateTotalWeekHours } = useContext(AttendanceWeekHours);

    const navigate = useNavigate();

    const handleRefresh = () => {
        window.location.reload();
    };
    useEffect(() => {
        if (user) {
            const role = user.role;
            if (role === 'מנהל') {
                navigate('/manager/homePage');
            } else if (role === 'מנטור') {
                navigate('/mentor/homePage');
            } else if (role === 'מוכשרת') {
                navigate('/trainingStudent/homePage');
            }
        }
    }, [navigate, user]);

    const getTalentedStudentIds = async (myUser) => {
        const { data: talentedStudents } = await getData('progress_trackings/read', { condition: `mentor_id=${myUser.id}` });
        return talentedStudents.map(student => student.trainig_student_id);
    };

    const getAllEvaluationStudentIds = async () => {
        const { data: allEvaluations } = await getData('evaluations/read');
        return allEvaluations.map(evaluation => evaluation.trainig_student_id);
    };

    const getRecentAndOldEvaluations = async (myUser) => {
        const recentEvaluations = await getData('evaluations/read', {
            condition: `writer_id=${myUser.id} AND date >= CURRENT_DATE - INTERVAL '1 month'`
        });

        const oldEvaluations = await getData('evaluations/read', {
            condition: `writer_id=${myUser.id} AND date < CURRENT_DATE - INTERVAL '1 month'`
        });

        return { recentEvaluations: recentEvaluations.data, oldEvaluations: oldEvaluations.data };
    };

    const getUserNames = async (ids) => {
        const idCondition = `id IN (${ids.join(',')})`;
        const { data: userNamesData } = await getData('user/read', { condition: idCondition, select: "name" });
        return userNamesData.map(user => user.name).join(', ');
    };

    const sendNotification = async (userRole, userNames) => {
        const notificationContent = {
            users: [{ role: userRole, link: '/mentor/progressTracking' }],
            content: `שימי לב ! עבר כבר חודש מאז שהשלמת הערכה למוכשרות הבאות: ${userNames}`
        };
        let sameNotification = await getData('notifications/read', { condition: `content='${notificationContent.content}'` })
        if (sameNotification.data.length === 0) {
            const notificationResponse = await postData('/notifications/create', notificationContent);
            return notificationResponse.data;
        }
        else{
            return null;
        }
    };

    const remindToFillOutEvaluation = async (myUser) => {
        try {
            const talentedStudentIds = await getTalentedStudentIds(myUser);
            const allEvaluationStudentIds = await getAllEvaluationStudentIds();
            const missingEvaluations = talentedStudentIds.filter(studentId => !allEvaluationStudentIds.includes(studentId));

            const { recentEvaluations, oldEvaluations } = await getRecentAndOldEvaluations(myUser);
            const recentStudentIds = recentEvaluations.map(evaluation => evaluation.trainig_student_id);
            const filteredOldEvaluations = oldEvaluations.filter(evaluation => !recentStudentIds.includes(evaluation.trainig_student_id));

            let finalMissingEvaluationIds = [...filteredOldEvaluations.map(evaluation => evaluation.trainig_student_id), ...missingEvaluations];

            if (finalMissingEvaluationIds.length > 0) {
                const userNames = await getUserNames(finalMissingEvaluationIds);
                const notificationContent = await sendNotification(myUser.role, userNames);
                if (notification && notificationContent!=null) 
                    setNotification([...notification, notificationContent[0]]);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogin = async (e) => {
        setAttempts(attempts + 1);
        if (attempts >= 2) {
            setShowLoginForm(false);
        }
        e.preventDefault();
        try {
            let myUser;
            const response = await postLogin('auth/login', { email, password });
            if (response.status === 200) {
                myUser = response.data.data;
                setUser(myUser);
                setLogin(true);
            }
            else if (response.status === 301) {
                setUserNotFound(true);
            }
            else if (response.status === 401) {
                setWrongPassword(true);
                setUserNotFound(true);
            }
            if (myUser.role === "מנטור")
                remindToFillOutEvaluation(myUser);
            
            const condition = `role='${myUser.role}' OR user_id=${myUser.id}`;
            const res = await getData('notifications/read', { condition: condition });
            setNotification(res.data);

            if (myUser.role === "מוכשרת") {
                let response = await getData('attendance/read', { condition: `trainig_student_id=${myUser.id}` });
                response = response.data.map(item => {
                    const dateObject = new Date(item.date); const formattedDate = dateObject.toISOString().split('T')[0];
                    return {
                        ...item,
                        date: formattedDate
                    };
                });
                updateTotalWeekHours(response);
            }

        } catch (error) {
            console.error('An error occurred', error);
        }
    };

    const forget = async () => {
        if (email) {
            const users = await getData('user/read', { condition: `email='${email}'` })
            if (users.data.length > 0) {
                const myuser = { email: email, password: password };
                setUser(myuser);
                navigate("/resetPassword");
            }
            else {
                alert('כתובת מייל זו לא רשומה במערכת')
            }
        } else {
            alert("בבקשה הכנסי כתובת מייל כדי להמשיך");
        }
    };


    return (
        <>
            <div className='login-page side'>
                <aside id='right'>
                    <img src={logo} alt="Logo" />
                </aside>
                <aside id='left'>
                    {!userNotFound && <h1>ברוכה הבאה!</h1>}
                    {!userNotFound && <p id='p'>אנא מלאי את השדות כדי להיכנס</p>}
                    <div className='panel'>
                        <div className="card flex flex-column md:flex-row gap-3 input-icon">
                            <div className="p-inputgroup flex-1" id='w'>
                                <span className="p-inputgroup-addon" id='sp'>
                                    <i className="pi pi-at"></i>
                                </span>
                                <InputText id="email" placeholder='כתובת מייל' value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                        </div>
                        <div className="card flex flex-column md:flex-row gap-3 input-icon">
                            <div className="p-inputgroup flex-1" id='w'>
                                <span className="p-inputgroup-addon" id='sp'>
                                    <i className="pi pi-key"></i>
                                </span>
                                <InputText id="password" type="password" placeholder='סיסמא' value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                        </div>
                        <div className='button'>
                            {!showLoginForm && <p>הגעת לניסיונות התחברות המקסימליים. אנא נסה שוב מאוחר יותר.</p>}
                            {!userNotFound && showLoginForm && <Avatar label="כניסה" id='submit' onClick={handleLogin} />}
                            <p className='pas' onClick={forget}>שכחת סיסמא?</p>
                            {wrongPassword && (
                                <div className='notExist'>
                                    <footer>סיסמה שגויה</footer>
                                    <button id='submit' onClick={handleRefresh}>נסה שוב</button>
                                </div>
                            )}
                            {!wrongPassword && userNotFound && (
                                <div className='notExist'>
                                    <footer>המשתמש לא רשום במערכת</footer>
                                    <button id='submit' onClick={handleRefresh}>נסה שוב</button>
                                </div>
                            )}
                        </div>
                    </div>
                </aside>

            </div>
        </>
    );
};



export default Login;