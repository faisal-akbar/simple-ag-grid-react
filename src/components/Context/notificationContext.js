/* eslint-disable react/jsx-no-constructed-context-values */
import { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

function NotificationContextProvider({ children }) {
    const [notification, setNotification] = useState(null);
    const [bannerOpen, setBannerOpen] = useState(true);
    const [showModal, setShowModal] = useState(false);

    return (
        <NotificationContext.Provider
            value={{
                notification,
                setNotification,
                bannerOpen,
                setBannerOpen,
                showModal,
                setShowModal,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export default NotificationContextProvider;

// Create a hook to use the NotificationContext, this is a Kent C. Dodds pattern
export function useNotification() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('Context must be used within a Provider');
    }
    return context;
}
