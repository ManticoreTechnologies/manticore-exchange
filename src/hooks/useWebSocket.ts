import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const useWebSocket = (url: string) => {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        const websocket = new WebSocket(url);
        setWs(websocket);

        websocket.onopen = () => {
            const userSession = Cookies.get('userSession');
            const storedAddress = Cookies.get('address');
            if (userSession && storedAddress) {
                console.log("Attempting to restore session");
                websocket.send(`restore_session ${storedAddress} ${userSession}`);
            }
        };

        websocket.onmessage = (event) => {
            setMessage(event.data);
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

    return { message, sendMessage };
};

export default useWebSocket; 