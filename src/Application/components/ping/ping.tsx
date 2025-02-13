import { useEffect, useState, useCallback } from 'react';
import { FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa'; // Import icons
const wsUrl = `${process.env.VITE_TRADING_WS_HOST === 'localhost' ? 'ws' : 'ws'}://${process.env.VITE_TRADING_WS_HOST}:${process.env.VITE_TRADING_WS_PORT}/ws/listings`;
console.log(wsUrl);
import './ping.css'; // Import the CSS file

interface SignalData {
    strength: number;
    latency: number;
    reliability: number;
}

interface PingProps {
}

const Ping: React.FC<PingProps> = () => {
    const [pingTime, setPingTime] = useState<number | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<string>('Connecting...');
    const [signalData, setSignalData] = useState<SignalData | null>(null);
    const [ws, setWs] = useState<WebSocket | null>(null);

    // Function to request signal data
    const requestSignalData = useCallback((websocket: WebSocket) => {
        if (websocket.readyState === WebSocket.OPEN) {
            websocket.send(JSON.stringify({
                type: 'get_signal',
                timestamp: new Date().toISOString()
            }));
        }
    }, []);

    useEffect(() => {
        const websocket = new WebSocket(wsUrl);
        setWs(websocket);

        websocket.onopen = () => {
            console.log("WebSocket opened");
            setConnectionStatus('Connected');
            
            // Request initial signal data
            requestSignalData(websocket);

            // Set up periodic signal data requests
            const signalInterval = setInterval(() => {
                requestSignalData(websocket);
            }, 5000); // Request every 5 seconds

            // Store the interval ID in a ref so we can clear it later
            return () => clearInterval(signalInterval);
        };

        websocket.onclose = (event) => {
            console.log(`WebSocket closed. Code: ${event.code}, Reason: ${event.reason}`);
            setConnectionStatus('Disconnected');
            setPingTime(null);
            setSignalData(null);
        };

        websocket.onerror = (event) => {
            console.error('WebSocket encountered an error:', event);
            setConnectionStatus('Error');
            setPingTime(null);
            setSignalData(null);
        };

        websocket.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                switch (message.type) {
                    case 'ping':
                        // Respond to ping with pong
                        websocket.send(JSON.stringify({
                            type: 'pong',
                            timestamp: new Date().toISOString()
                        }));
                        break;
                    case 'signal':
                        // Update signal data
                        setSignalData(message.data);
                        setPingTime(message.data.latency);
                        break;
                    case 'error':
                        console.error('Signal error:', message.error);
                        break;
                }
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        return () => {
            if (websocket.readyState === WebSocket.OPEN) {
                websocket.close();
            }
        };
    }, [requestSignalData]);

    // Fallback signal request if we don't get data within 2 seconds of connecting
    useEffect(() => {
        if (ws && connectionStatus === 'Connected' && !signalData) {
            const fallbackTimer = setTimeout(() => {
                requestSignalData(ws);
            }, 2000);

            return () => clearTimeout(fallbackTimer);
        }
    }, [ws, connectionStatus, signalData, requestSignalData]);

    const getSignalStrength = () => {
        if (!signalData) return 'none';
        const { strength, reliability } = signalData;
        
        // Consider both signal strength and reliability
        if (strength === 4 && reliability > 95) return 'excellent';
        if (strength === 3 || (strength === 4 && reliability <= 95)) return 'good';
        if (strength === 2) return 'fair';
        if (strength === 1) return 'poor';
        return 'weak';
    };

    const signalBars = () => {
        return signalData?.strength || 0;
    };

    const renderConnectionStatusIcon = () => {
        if (connectionStatus === 'Disconnected') {
            return <FaTimesCircle className="status-icon disconnected" />;
        }
        if (connectionStatus === 'Error') {
            return <FaExclamationTriangle className="status-icon error" />;
        }
        return null;
    };

    const renderSignalStrengthIcon = () => {
        if (connectionStatus === 'Disconnected') {
            return null;
        }
        const bars = signalBars();
        const strength = getSignalStrength();
        return (
            <span className={`signal-strength ${strength}`}>
                {[...Array(4)].map((_, index) => (
                    <div
                        key={index}
                        className={`bar ${index < bars ? 'active' : ''}`}
                        style={{ height: `${8 + index * 2}px` }}
                    />
                ))}
            </span>
        );
    };

    const formatLatency = (latency: number | null) => {
        if (latency === null) return '...';
        return `${Math.round(latency)} ms`;
    };

    return (
        <div className="ping-indicator">
            <span className="signal-strength">
                {renderSignalStrengthIcon()}
            </span>
            <span className="status-icon">
                {renderConnectionStatusIcon()}
            </span>
            <span className="ping-time" title={signalData ? `Reliability: ${signalData.reliability}%` : undefined}>
                {formatLatency(pingTime)}
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