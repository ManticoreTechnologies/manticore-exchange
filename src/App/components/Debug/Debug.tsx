import React, { useState } from 'react';
import { FaBug } from 'react-icons/fa';
import './Debug.css';

interface DebugSection {
    title: string;
    data: any;
}

interface DebugProps {
    sections: DebugSection[];
}

const Debug: React.FC<DebugProps> = ({ sections }) => {
    const [isVisible, setIsVisible] = useState(false);

    if (process.env.NODE_ENV !== 'development') {
        return null;
    }

    return (
        <div className="debug-container">
            <button 
                className="debug-toggle" 
                onClick={() => setIsVisible(!isVisible)}
                title={isVisible ? "Hide Debug Info" : "Show Debug Info"}
            >
                <FaBug />
            </button>
            
            {isVisible && (
                <div className="debug-content">
                    {sections.map((section, index) => (
                        <div key={index} className="debug-section">
                            <h3>{section.title}</h3>
                            <pre>{JSON.stringify(section.data, null, 2)}</pre>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Debug; 