import React from 'react';
import './TradeLog.css';

interface TradeLogProps {
    tradeLog: [];
}

const TradeLog: React.FC<TradeLogProps> = ({ tradeLog }) => {
    const formatTrade = (trade: any[]) => {
        // trade is a list of order data
        const side = trade[5];
        const price = trade[3];
        const id = trade[2]
        const qty = trade[4]
        const taker = trade[6]
        const timestamp = trade[7]
        const color = trade[5] === 'buy' ? 'green' : 'red';
        return (
            `<tr>
                <td style="color: ${color}">${price}</td>
                <td>${qty}</td>
                <td>${taker ? "taker" : "maker"}</td>
                <td>${new Date(timestamp).toLocaleTimeString()}</td>
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
