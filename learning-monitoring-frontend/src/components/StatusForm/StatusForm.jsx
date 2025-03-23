import React, { useState, useContext, useRef, useEffect } from 'react';
import { postData, getData } from '../../services/axios';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { FloatLabel } from 'primereact/floatlabel';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Calendar } from 'primereact/calendar';
import { UserContext } from '../../contexts/UserContext/UserContext';
import { AttendanceWeekHours } from '../../contexts/AttendanceWeekHours/AttendanceWeekHours';
import Navigator from './../Navigator/Navigator'
import DisplayingStudentsDetails from '../DisplayingStudentsDetails/DisplayingStudentsDetails';
import { Toast } from 'primereact/toast';
import './StatusForm.css';

const StatusForm = ({ role }) => {
    const toast = useRef(null);
    const stepperRef = useRef(null);
    const [start_time, set_start_time] = useState();
    const [end_time, set_end_time] = useState();
    const [statusDate, setStatusDate] = useState(new Date().toISOString().split('T')[0]);
    const [start_status, set_start_status] = useState('');
    const [end_status, set_end_status] = useState('');
    const [foromData, setforomData] = useState('');
    const [trainingHour, setTrainingHour] = useState('');
    const [teamHour, setTeamHour] = useState('');
    const [columns, setColumns] = useState([]);
    const [email, setEmail] = useState('');
    const [showStatusNotification, setShowStatusNotification] = useState(false);
    const [statusNotificationContent, setStatusNotificationContent] = useState(null);
    const [, setExistStatus] = useState();
    const [existHour, setExistHour] = useState([]);
    const { updateTotalWeekHours } = useContext(AttendanceWeekHours);

    const currentDate = new Date().toISOString().split('T')[0];
    const { user } = useContext(UserContext);
    const profile = user.profile;
    const condition = `trainig_student_id=${user.id} AND date='${statusDate}T00:00:00.000Z'`;

    const existStatusStartDay = async () => {
        const con = `trainig_student_id=${user.id} AND date='${currentDate}'`;
        const response = await getData('status/read', { condition: con });
        if (response.data.length) {
            set_start_status(response.data[0].start_status);
            set_end_status(response.data[0].end_status);
        }
        setExistStatus(response.data.length ? true : false);
    }

    const getExistHour = async () => {
        const existHour = await getData('attendance/read', { condition: condition });
        setExistHour(existHour.data[0] ? existHour.data[0] : []);
    }

    useEffect(() => {
        set_start_time(changeFormatTime(new Date()));
        set_end_time(changeFormatTime(new Date()));
        async function getName() {
            const read = await (await getData('attendance/read')).data
            read.forEach(item => {
                if (item.exit3 == null && item.id === user.id && item.Date !== item.Date) {
                    setStatusNotificationContent(
                        toast.current.show({ severity: 'error', summary: 'שגיאה', detail: 'לא הושלם סטטוס יום האתמול' })

                    );
                    setShowStatusNotification(true);
                }
            });
            const columns = await getData('/config/getColumnNames/attendance_reports')
            setColumns(columns.data.columns.slice(4, -3))
            const condition = `id=${user.mentor_id}`;
            const response = await getData('user/read', { condition: condition });
            const mail = response.data[0].email;
            setEmail(mail);
        }
        existStatusStartDay();
        getName();
        getExistHour();
    }, []);

    const handleStartFormSubmit = async () => {
        const condition = `DATE(date) = DATE('${statusDate}') - INTERVAL '1 day' AND end_status IS NULL`;
        const isYesterdayStatus = await getData('status/read', { condition: condition });
        if( isYesterdayStatus.data.length > 0 ){
            toast.current.show({ severity: 'error', summary: 'שגיאה', detail: 'לא הושלם סטטוס יום האתמול' })
        }
        else {   
            stepperRef.current.nextCallback()
            try {
                await postData('status/create', {
                    "trainig_student_id": user.id,
                    "date": statusDate,
                    "start_status": start_status,
                    "email": email
                });
                await postData('attendance/create', {
                    "trainig_student_id": user.id,
                    "date": statusDate,
                    "entry1": new Date(start_time).toLocaleTimeString() == 'Invalid Date' ? start_time : new Date(start_time).toLocaleTimeString()
                })
                
                toast.current.show({ severity: 'success', summary: 'אישור', detail: 'העדכון נשמר בהצלחה' })
            } catch (error) {
                console.error(error);
            }
            getExistHour();
        }
    };

    const sendTime = (name, value) => {
        setforomData({
            ...foromData,
            [name]: changeFormatTime(value)
        })
    }

    const changeFormatTime = (value) => {
        const date = new Date(value);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const formattedTime = `${hours}:${minutes}`;
        return formattedTime
    }

    const handleEndFormSubmit = async () => {
        stepperRef.current.prevCallback()
        try {
            if (end_status != '') {
                await postData('status/update', {
                    set: { end_status: end_status },
                    condition: condition
                });
            }
            const res = await getData('attendance/read', { condition: condition });
            let exit = {};
            const endTime = changeFormatTime(end_time) != "NaN:NaN" ? changeFormatTime(end_time) : end_time;
            exit = teamHour != '' ? { team_hour: changeFormatTime(teamHour) } : exit;
            exit = trainingHour != '' ? { ...exit, training_hour: changeFormatTime(trainingHour) } : exit;
            exit = res.data[0].exit2 ? { exit3: endTime, ...exit } : res.data[0].exit1 ? { exit2: endTime, ...exit } : { exit1: endTime, ...exit };
            await postData('attendance/update', {
                set: exit,
                condition: condition
            })
            set_end_status('');
            set_start_status('');
            set_start_time('');
            setforomData('');
            setTrainingHour('');
            setTeamHour('');

            toast.current.show({ severity: 'success', summary: 'אישור', detail: 'העדכון נשמר בהצלחה' });

            res.data[0].exit2 ? res.data[0].exit3 = exit.exit3 : res.data[0].exit1 ? res.data[0].exit2 = exit.exit2 : res.data[0].exit1 = exit.exit1
            updateTotalWeekHours(res.data, 'update');

        } catch (error) {
            console.error(error);
        }
        getExistHour();
    };

    const handleHourSubmit = async () => {
        stepperRef.current.nextCallback()
        await postData('attendance/update', {
            set: foromData,
            condition: condition
        });
        getExistHour();
        toast.current.show({ severity: 'success', summary: 'אישור', detail: 'העדכון נשמר בהצלחה' })
    }

    const changeFormatDate = (value) => {
        let parsedDate = new Date(value);
        const year = parsedDate.getFullYear();
        const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
        const day = String(parsedDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        setStatusDate(formattedDate);
    }

    return (
        <>
            <Toast ref={toast} />
            <Navigator user={role}></Navigator>
            <div className='status-form-page'>
                <DisplayingStudentsDetails trainingStudent={{ id: user.id }} />
                <div className="StatusForm">
                    {showStatusNotification && statusNotificationContent}
                    <>
                        <Stepper ref={stepperRef} style={{ flexBasis: '50rem' }} orientation="vertical">
                            <StepperPanel header="תחילת יום">
                                <div>
                                    <DataTable value={[{ date: currentDate, start_time }]}>
                                        <Column field="date" header="תאריך" body={(rowData) => (<Calendar type="text" value={rowData.date} onChange={(e) => changeFormatDate(e.target.value)} showButtonBar placeholder={statusDate} />)} />
                                        <Column field="start_time" header="כניסה" body={() => (<Calendar id="calendar-timeonly" value={start_time} onChange={(e) => set_start_time(e.target.value)} placeholder={new Date().toLocaleTimeString()} timeOnly />)} />
                                    </DataTable>
                                    <FloatLabel>
                                        <div htmlFor="status">תאור סטטוס תחילת יום</div>
                                        <input id="status" value={start_status} onChange={(e) => set_start_status(e.target.value)} />
                                    </FloatLabel>            
                                        <Button className='send-status-button' icon="pi pi-arrow-right" iconPos="left" label="שליחה" onClick={handleStartFormSubmit} />
                                </div>
                            </StepperPanel>
                            <StepperPanel header="עדכון שעות נוספות">
                                <DataTable className='update-hours' value={[{ date: currentDate, start_time }]}>
                                    <Column field="date" header="תאריך" body={(rowData) => (<Calendar type="text" value={rowData.date} onChange={(e) => { changeFormatDate(e.target.value); getExistHour() }} showButtonBar placeholder={statusDate} />)} />
                                    {columns.map((column, index) => (
                                        <Column key={index} field={column.name} header={column.translate} body={() => (<Calendar id="calendar-timeonly" value={existHour[column.name] ? existHour[column.name] : ''} onChange={(e) => sendTime(column.name, e.target.value)} placeholder={existHour[column.name] ? existHour[column.name] : ''} timeOnly />)} />
                                    ))}
                                </DataTable>
                                <Button className='send-status-button' icon="pi pi-arrow-right" iconPos="left" label="שליחה" onClick={handleHourSubmit} />
                            </StepperPanel>
                            <StepperPanel header="סוף יום">
                                <div>
                                    <DataTable value={[{ date: currentDate, start_time }]}>
                                        <Column field="date" header="תאריך" body={(rowData) => (<Calendar type="text" value={rowData.date} onChange={(e) => changeFormatDate(e.target.value)} showButtonBar placeholder={statusDate} />)} />
                                        <Column field="end_time" header="יציאה" body={() => (<Calendar id="calendar-timeonly" value={end_time} onChange={(e) => set_end_time(e.target.value)} placeholder={new Date().toLocaleTimeString()} timeOnly />)} />
                                    </DataTable>
                                    <FloatLabel>
                                        <div htmlFor="status">תאור סטטוס סוף יום</div>
                                        <input id="status" value={end_status} onChange={(e) => set_end_status(e.target.value)} />
                                    </FloatLabel>
                                    {profile === 'פרופיל ב' ?
                                        <div className="flex-auto">
                                            <div className='p-hour'>
                                                <p > שעות הכשרה</p>
                                                <br />
                                                <Calendar
                                                    placeholder={existHour['training_hour'] ? existHour['training_hour'] : ''}
                                                    onChange={(e) => setTrainingHour(e.value)}
                                                    showIcon
                                                    timeOnly
                                                    icon="pi pi-clock"
                                                />
                                            </div>
                                            <div className='p-hour'>
                                                <p > שעות צוות</p>
                                                <br />
                                                <Calendar
                                                    placeholder={existHour['team_hour'] ? existHour['team_hour'] : ''}
                                                    onChange={(e) => setTeamHour(e.value)}
                                                    showIcon
                                                    timeOnly
                                                    icon="pi pi-clock"
                                                />
                                            </div>
                                        </div>
                                        : ""}
                                    <Button className='send-status-button' icon="pi pi-arrow-right" iconPos="left" label="שליחה" onClick={handleEndFormSubmit} />
                                </div>
                            </StepperPanel>
                        </Stepper>
                    </>
                </div>
            </div>

        </>
    );
};
export default StatusForm;