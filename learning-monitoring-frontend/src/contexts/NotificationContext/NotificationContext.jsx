import React,{ createContext, useState } from "react";

export const NotificationContext = createContext()

const NotificationContextProvider = ({ children }) => {
    const [notification, setNotification] = useState(undefined);
    return <>
        <NotificationContext.Provider value={{ notification, setNotification }}>
            {children}
        </NotificationContext.Provider>
    </>
}

export default NotificationContextProvider
