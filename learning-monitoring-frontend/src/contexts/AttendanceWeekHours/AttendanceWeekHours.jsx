import React,{ createContext, useState } from "react";
import moment from 'moment';

export const AttendanceWeekHours = createContext()

const AttendanceWeekHoursProvider = ({ children }) => {
    const [totalWeekHours, setTotalWeekHours] = useState(0);

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

    const calculateDayHours = (item) => {
        let totalHours = 0;
        Array.from({ length: 3 }, (_, i) => {
            const entry = item[`entry${i + 1}`];
            const exit = item[`exit${i + 1}`];
            const hours = calculateHours(entry, exit);
            totalHours += hours;
        });
        totalHours = totalHours && !isNaN(totalHours) ? totalHours.toFixed(2) : "0.00";
        totalHours = parseFloat(totalHours);
        return totalHours;
    }

    const updateTotalWeekHours = (data, mode = '') => {
        const startOfWeek = moment().startOf('week').date();
        const endOfWeek = moment().endOf('week').date();
        const weekData = data.filter(item => {
            const itemDate = moment(item["date"]).date();
            return itemDate >= startOfWeek && itemDate <= endOfWeek;
        });
        const totalHours = weekData.reduce((acc, item) => {
            if (item['סה"כ שעות']) {
                return acc + parseFloat(item['סה"כ שעות'] || 0);
            }
            else {
                return acc + parseFloat(calculateDayHours(item))
            }
        }, 0);
        if (mode === 'update') setTotalWeekHours(totalWeekHours + totalHours);
        else setTotalWeekHours(totalHours);
    }
    return <>
        <AttendanceWeekHours.Provider value={{ totalWeekHours, updateTotalWeekHours }}>
            {children}
        </AttendanceWeekHours.Provider>
    </>
}

export default AttendanceWeekHoursProvider
