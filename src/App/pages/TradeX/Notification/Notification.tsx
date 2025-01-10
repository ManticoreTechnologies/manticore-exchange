import React, { useEffect } from 'react';

interface NotificationProps {
    message: string;
    index: number;
    onClose: (index: number) => void;
}

const Notification: React.FC<NotificationProps> = ({ message, index, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => onClose(index), 5000);
        return () => clearTimeout(timer);
    }, [index, onClose]);

    return (
        <li className="notification">
            {index}: {message}
        </li>
    );
};

export default Notification;
