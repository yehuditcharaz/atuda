import React, { useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext/UserContext';
import { Card } from 'primereact/card';
import './Cookie.css'

const LastVisitedPages = () => {
    const { user } = useContext(UserContext);
    const [cookies] = useCookies(['lastVisitedPages']);
    const location = useLocation();
    const navigate = useNavigate();
    const [display, setDisplay] = useState(false);

    const getLastVisitedPage = (userId) => {
        return cookies.lastVisitedPages && cookies.lastVisitedPages[userId] ? cookies.lastVisitedPages[userId] : null;
    };

    const returnBack = () => {
        const lastVisitedPages = getLastVisitedPage(user.id);
        if (lastVisitedPages && lastVisitedPages !== location.pathname) {
            navigate(lastVisitedPages.path);
        }
    }
            
    useEffect(() => {
        const lastVisitedPages = getLastVisitedPage(user.id);
        if (lastVisitedPages) setDisplay(true);
    }, [])

    setTimeout(() => {
        setDisplay(false);
    }, 5000);

    return <>
        {display && <Card title="ברוך שובך!" onClick={returnBack} subTitle="לחצי כאן להמשיך מהמקום בו הפסקת " className="speechBubble">
            <p>בתאריך {getLastVisitedPage(user.id).timestamp}</p>
        </Card>}
    </>;
};

export default LastVisitedPages;
