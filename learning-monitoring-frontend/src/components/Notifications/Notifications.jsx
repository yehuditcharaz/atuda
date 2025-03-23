
import React, { useState, useContext, } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from 'primereact/sidebar';
import { NotificationContext } from '../../contexts/NotificationContext/NotificationContext';
import { postData } from '../../services/axios';
import { OrderList } from 'primereact/orderlist';
import { Badge } from 'primereact/badge';
import { useLocation } from 'react-router-dom';
import './Notifications.css';

const Notifications = () => {
    const location = useLocation();
    const [visible, setVisible] = useState(false);
    const { notification, setNotification } = useContext(NotificationContext);
    const navigate = useNavigate();

    const deleteNotification = async (item) => {
        await postData('notifications/delete', { id: item.id })
        setNotification(notification.filter(value => value.id != item.id));
    }

    const notificationLink = async (item) => {
        deleteNotification(item);
        if (location.pathname === item.link) setVisible(!visible);
        else navigate(item.link);
    }

    const allNotificationsTemplate = (item) => {
        return (
            <div className="flex flex-wrap p-2 align-items-center gap-3">
                <i className='pi pi-times' onClick={() => deleteNotification(item)}></i>
                <span className='notification-date'>{item.date}</span>
                <div onClick={() => notificationLink(item)} className="flex-1 flex flex-column gap-2 xl:mr-8">
                    <i className="pi pi-link"></i>
                    <span className="font-bold">{item.content}</span>
                </div>
            </div>
        )
    };

    return (
        <div className="div-notification card flex justify-content-center">
            <i className="pi pi-bell p-overlay-badge" onClick={() => setVisible(true)} style={{ fontSize: '2rem' }}>
                <Badge value={notification.length}></Badge>
            </i>
            <Sidebar className='sidebar-notification' visible={visible} position='left' onHide={() => setVisible(false)}>
                <div className="card xl:flex xl:justify-content-center">
                    <h2 className="text-xl font-bold">הודעות</h2>
                    {notification.length === 0 ? (
                        <div>אין הודעות חדשות</div>
                    ) : (
                        <OrderList className='order-list-notifications' dataKey="id" value={notification} itemTemplate={allNotificationsTemplate} ></OrderList>
                    )}
                </div>
            </Sidebar>
        </div>
    )
}

export default Notifications;