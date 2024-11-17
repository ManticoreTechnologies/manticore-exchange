import { useEffect, useState } from 'react';
import { FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa'; // Import icons
const wsUrl = `${process.env.VITE_TRADING_WS_HOST === 'localhost' ? 'ws' : 'wss'}://${process.env.VITE_TRADING_WS_HOST}:${process.env.VITE_TRADING_WS_PORT}`;

import './Ping.css'; // Import the CSS file

    interface PingProps {
    }

    const Ping: React.FC<PingProps> = () => {

        const [pingTime, setPingTime] = useState<number | null>(null);
        const [connectionStatus, setConnectionStatus] = useState<string>('Connecting...');

        useEffect(() => {
            const ws = new WebSocket(wsUrl);
            ws.onopen = () => {
                console.log("WebSocket opened");
                setConnectionStatus('Connected');
                ping(ws);
            };
            ws.onclose = (event) => {
                console.log(`WebSocket closed. Code: ${event.code}, Reason: ${event.reason}`);
                setConnectionStatus('Disconnected');
            };
            ws.onerror = (event) => {
                console.error('WebSocket encountered an error:', event);
                setConnectionStatus('Error');
            };
        }, [wsUrl]);

        const ping = (ws: WebSocket) => {
            const startTime = performance.now();
            ws.send("ping");
            ws.onmessage = () => {
                const endTime = performance.now();
                const pingTime = endTime - startTime;
                setPingTime(pingTime);
                setTimeout(() => ping(ws), 1000); // Ping every second
            };
        };

        const signalBars = () => {
            if (pingTime === null) return 0;
            if (pingTime < 100) return 5; // Excellent signal
            if (pingTime < 200) return 4; // Good signal
            if (pingTime < 300) return 3; // Fair signal
            if (pingTime < 400) return 2; // Poor signal
            return 1; // Weak signal
        };

        const renderConnectionStatusIcon = () => {
            if (connectionStatus === 'Disconnected') {
                return <FaTimesCircle color="red" />;
            }
            if (connectionStatus === 'Error') {
                return <FaExclamationTriangle color="orange" />;
            }
            return null; // No icon if connected
        };

        const renderSignalStrengthIcon = () => {
            if (connectionStatus === 'Disconnected') {
                return null; // No signal bars if disconnected
            }
            const bars = signalBars();
            return (
                <span className="signal-strength">
                    {[...Array(5)].map((_, index) => (
                        <div
                            key={index}
                            className={`bar ${index < bars ? 'active' : ''}`}
                            style={{ height: `calc(${(5 + index * 5) * 0.4}px + var(--footer-height, 15px) * 0.13)` }} // Adjusted height based on footer-height CSS variable
                        />
                    ))}
                </span>
            );
        };

        return (
            <div className="ping-indicator">
                <span className="signal-strength">
                    {renderSignalStrengthIcon()}
                </span>
                <span className="status-icon">
                    {renderConnectionStatusIcon()}
                </span>
                <span className="ping-time">
                    {pingTime !== null ? `${Math.round(pingTime)} ms` : '...'}
                </span>
            </div>
        );
    };

    export default Ping;

    /*
                <span className="status-icon">
                    {renderConnectionStatusIcon()}
                </span>
                <span className="signal-strength">
                    {renderSignalStrengthIcon()}
                </span>
    */