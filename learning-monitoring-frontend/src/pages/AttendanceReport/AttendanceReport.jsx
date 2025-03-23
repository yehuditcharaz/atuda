import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext/UserContext';
import Navigator from '../../components/Navigator/Navigator';
import DynamicTable from '../../components/DynamicTable/DynamicTable';
import { getData } from '../../services/axios';
import DownloadData from '../../components/DownloadData/DownloadData';
import { AttendanceWeekHours } from '../../contexts/AttendanceWeekHours/AttendanceWeekHours';
import moment from 'moment';
import { toJewishDate, toHebrewJewishDate } from 'jewish-date';
import { TabView, TabPanel } from 'primereact/tabview';
import "./AttendanceReport.css";

const AttendanceReportPage = ({ role, trainingStudent }) => {

    const { user } = useContext(UserContext);
    const { totalWeekHours } = useContext(AttendanceWeekHours);
    const [ ,setData] = useState(null);
    const currentMonth = new Date().getMonth();
    const [activeIndex, setActiveIndex] = useState(currentMonth);
    const [startMonth, setStartMonth] = useState(0);
    const [filteredData, setFilteredData] = useState([]);
    const [totalMonthHours, setTotalMonthHours] = useState(Array(12).fill(0));

    const preprocessAndAddErrors = (dataArray) => {
        return dataArray.map(item => {
            const jewishDate = toJewishDate(new Date(item.date));
            const hebrewJewishDate = toHebrewJewishDate(jewishDate);
            const formattedDate = moment(item.date).format('DD-MM-YYYY');
            const gregorianDateParts = formattedDate.split('-');
            const formattedGregorianDate = `${gregorianDateParts[1]}/${gregorianDateParts[0]}/${gregorianDateParts[2]}`;
            let totalHours = 0;
            Array.from({ length: 3 }, (_, i) => {
                const entry = item[`entry${i + 1}`];
                const exit = item[`exit${i + 1}`];
                const hours = calculateHours(entry, exit);
                totalHours += hours;
            });
            totalHours = totalHours && !isNaN(totalHours) ? totalHours.toFixed(2) : "0.00";
            totalHours = parseFloat(totalHours);
            const errors = ["entry1", "entry2", "entry3"].some((entryKey, index) => item[entryKey] && !item["exit" + (index + 1)]) ? 'אין יציאה' : 'ללא שגיאות';
            return {
                'שגיאות': errors != 'ללא שגיאות' ? { value: errors, element: <div style={{ backgroundColor: 'red' }}>{errors}</div> } : errors,
                'תאריך עברי': `${hebrewJewishDate.day} ${hebrewJewishDate.monthName} ${hebrewJewishDate.year}`,
                'יום': new Date(formattedGregorianDate).toLocaleDateString('he-IL-u-ca-hebrew', { weekday: 'long' }),
                ...item,
                'date': item.date.substring(0, 10),
                'סה"כ שעות': totalHours
            };
        });
    };

    const calculateHours = (entry, exit) => {
        if (entry && exit) {
            const entryTime = new Date("1970-01-01T" + entry + "Z");
            const exitTime = new Date("1970-01-01T" + exit + "Z");
            if (isNaN(entryTime) || isNaN(exitTime)) {
                console.error("Invalid time entry/exit:", entry, exit);
                return 0;
            }
            const diff = exitTime - entryTime;
            if (diff < 0) {
                console.error("Exit time is earlier than entry time:", entry, exit);
                return 0;
            }
            return diff / 1000 / 60 / 60;
        }
        return 0;
    };

    const calculateMonthHours = (data) => {
        const total = data.reduce((acc, item) => {
            const hours = parseFloat(item['סה"כ שעות'] || 0);
            return acc + hours;
        }, 0);
        return total;
    };


    const axiosData = async () => {
        try {
            const userId = trainingStudent ? trainingStudent.id : user.id;
            const condition = `trainig_student_id=${userId}`
            const response = await getData('attendance/read', {
                condition: condition,
                select: ["id", "date", "entry1", "exit1", "entry2", "exit2", "entry3", "exit3"]
            });
            if (response.data.length) {
                let updateData = preprocessAndAddErrors(response.data);
                updateData = updateData.sort((a, b) =>
                a.date.split('-').reverse().join().localeCompare(b.date.split('-').reverse().join()));
                setData(updateData);
                const newFilteredData = [...Array(12)].map((_, index) => {
                    return updateData.filter(item => {
                        const dateParts = item['date'].split('-');
                        const month = parseInt(dateParts[1]) - 1;
                        return month === index;
                    });
                });
                const firstDate = updateData[0].date;
                const firstMonth = moment(firstDate, 'DD-MM-YYYY').month();
                const currentIndex = Math.max(firstMonth, currentMonth);
                setFilteredData(newFilteredData);
                setStartMonth(firstMonth);
                setActiveIndex(currentIndex);
                let monthHours = [];
                totalMonthHours.map((item, index) => monthHours[index] = calculateMonthHours(newFilteredData[index]));
                setTotalMonthHours(monthHours);
            }
        } catch (error) {
            console.error("Error getting data:", error);
        }
    };

    useEffect(() => {
        axiosData();
    }, []);

    return (
        <>
            {role === 'trainingStudent' ? <Navigator user={role} student_id={trainingStudent ? trainingStudent.id : user.id} /> : ''}
            <div className={trainingStudent ? "attendance-container" : "attendance-container-personal"}>
                <TabView className='attendance-tabview' activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                    {[
                        'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
                        'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
                    ]
                        .slice(startMonth)
                        .slice(0, currentMonth - startMonth + 1)
                        .map((monthName, index) => (
                            <TabPanel key={index} header={monthName}>
                                {Array.isArray(filteredData[startMonth + index]) && filteredData[startMonth + index].length > 0 ? (
                                    <div>
                                        <DownloadData data={filteredData[startMonth + index]}></DownloadData>
                                        <DynamicTable data={filteredData[startMonth + index]} tableName={'attendance_reports'} routerName={'attendance'} />
                                        <h3 className="month-hours">
                                            {"מספר השעות שנצברו עבור חודש זה: " + totalMonthHours[startMonth + index]}
                                        </h3>
                                        {
                                            trainingStudent ? <h3 className="week-hours">
                                                {"מספר השעות שנצברו עבור השבוע הנוכחי: " + totalWeekHours.toFixed(2)}
                                            </h3> : ''
                                        }
                                    </div>
                                ) : (
                                    <div className="no-data-message">אין נתונים עבור חודש זה</div>
                                )}
                            </TabPanel>
                        ))}
                </TabView>
            </div>
        </>
    );
};

export default AttendanceReportPage;