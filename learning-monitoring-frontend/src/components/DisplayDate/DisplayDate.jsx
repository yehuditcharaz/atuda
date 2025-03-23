import React, { useEffect, useState ,useContext} from 'react';
import 'primeicons/primeicons.css';
import './DisplayDate.css';
import { AttendanceWeekHours } from '../../contexts/AttendanceWeekHours/AttendanceWeekHours';

const DisplayDate = ({ item }) => {

    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
    const { totalWeekHours } = useContext(AttendanceWeekHours);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {item ?
                <a className='flex align-items-center p-menuitem-link' >
                    <span className={item.icon} />
                    {item.icon === 'pi pi-clock' ?
                        <div className='time'>
                            <span>{item.label}</span>
                            <br />
                            <h3 className='numtime'>{totalWeekHours}</h3>
                        </div> :
                        item.icon === 'pi pi-calendar p-overlay-badge' ?
                            <div>
                                <div className='date'>
                                    <span>{['יום א', 'יום ב', 'יום ג', 'יום ד', 'יום ה', 'יום ו', 'שבת'][new Date().getDay()]}</span>
                                    <br></br>
                                    <span>{new Date().toLocaleDateString('en-GB')}</span>
                                    <br></br>
                                    <span>{currentTime}</span>
                                </div>
                            </div> :''
                    }
                </a>
                : null}
        </>
    );
};

export default DisplayDate;