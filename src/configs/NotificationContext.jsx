// NotificationContext.js
import React, { createContext, useState } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notificaciones, setNotificaciones] = useState([]);

    return (
        <NotificationContext.Provider value={{ notificaciones, setNotificaciones }}>
            {children}
        </NotificationContext.Provider>
    );
};
