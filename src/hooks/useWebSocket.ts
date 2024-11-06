import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const useWebSocket = (url: string) => {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    useEffect(() => {
        const websocket = new WebSocket(url);
        setWs(websocket);

        websocket.onopen = () => {
            setIsConnected(true);
            const userSession = Cookies.get('userSession');
            const storedAddress = Cookies.get('address');
            if (userSession && storedAddress) {
                console.log("Attempting to restore session");
                websocket.send(`restore_session ${storedAddress} ${userSession}`);
            }
        };

        websocket.onmessage = (event) => {
            if (event.data.startsWith('authenticated ')) {
                setIsAuthenticated(true);
            } 
            if (event.data.startsWith('session_restored')) {
                setIsAuthenticated(true);
            }
            setMessage(event.data);
        };

        websocket.onclose = () => {
            setIsConnected(false);
        };

        return () => {
            websocket.close();
        };
    }, [url]);

    const sendMessage = (msg: string) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(msg);
        }
    };

    return { message, sendMessage, isConnected, isAuthenticated };
};

export default useWebSocket; 