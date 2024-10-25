import React, { useEffect } from 'react';

interface NotificationProps {
    messages: string[];
    onClose: (index: number) => void;
}

const Notification: React.FC<NotificationProps> = ({ messages, onClose }) => {
    useEffect(() => {
        const timers = messages.map((_, index) =>
            setTimeout(() => onClose(index), 5000)
        );
        return () => timers.forEach(timer => clearTimeout(timer));
    }, [messages]);

    return (
        <ul className="notification-list">
            {messages.map((message, index) => (
                <li key={index} className="notification">
                    {message}
                </li>
            ))}
        </ul>
    );
};

export default Notification;
