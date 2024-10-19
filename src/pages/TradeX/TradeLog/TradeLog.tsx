import React from 'react';
import './TradeLog.css';
interface TradeLogProps {
    tradeLog: string[];
}

const TradeLog: React.FC<TradeLogProps> = ({ tradeLog }) => (
    <div className="trade-log">
        <h3>Trade Log</h3>
        <ul>
            {tradeLog.map((trade, index) => (
                <li key={index} dangerouslySetInnerHTML={{ __html: trade }} />
            ))}
        </ul>
    </div>
);

export default TradeLog;
