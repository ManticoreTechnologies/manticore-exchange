import React from 'react';
import '../styles/ResultsDisplay.css';

interface ResultsDisplayProps {
    title: string;
    data: any;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ title, data }) => {
    if (!data) return null;

    return (
        <div className="results-display">
            <h3>{title}</h3>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

export default ResultsDisplay; 