import React from 'react';
import './TradeLog.css';

interface TradeLogProps {
    tradeLog: { price: number, qty: number, time: string, type: string }[];
}

const TradeLog: React.FC<TradeLogProps> = ({ tradeLog }) => {
    const formatTrade = (trade: any[]) => {
        // trade is a list of order data
        const color = trade[1] === 'buy' ? 'green' : 'red';
        return (
            `<tr>
                <td style="color: ${color}">${trade[2]}</td>
                <td>${trade[3]}</td>
                <td>${new Date(trade[4]).toLocaleTimeString()}</td>
            </tr>`
        );
    };

    return (
        <div className="trade-log">
            <h3>Trade Log</h3>
            <table>
                <tbody>
                    {tradeLog.map((trade, index) => (
                        <tr key={index} dangerouslySetInnerHTML={{ __html: formatTrade(trade) }} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TradeLog;
