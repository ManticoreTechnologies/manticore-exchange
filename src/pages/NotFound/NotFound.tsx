import React from 'react';
import './NotFoundPage.css';

const NotFoundPage: React.FC = () => {
    return (
        <div className="not-found-container">
            <div className="glow">404</div>
            
            <div className="message">The page you are looking for does not exist.</div>
        </div>
    );
};

export default NotFoundPage;