import React, { useState } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import './MantiLink.css';

interface MantiLinkProps {
  port: number;
}

const MantiLink: React.FC<MantiLinkProps> = ({ port }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = () => {
    setIsConnecting(true);
    const ws = new WebSocket(`ws://localhost:${port}`);
    setSocket(ws);

    ws.onopen = () => {
      console.log("WebSocket connection established");
      // Send authentication message
      ws.send(JSON.stringify({ type: "authenticate", token: "your-auth-token" }));
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "authenticated") {
        setIsAuthenticated(true);
        setIsConnecting(false);
        console.log("Authenticated with the wallet");
      } else {
        console.log("Message from server:", message);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      setIsConnecting(false);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnecting(false);
    };
  };

  return (
    <div className="manti-link">
      {isAuthenticated ? (
        "Connected to Wallet"
      ) : (
        <button className="connect-wallet-button" onClick={connectWallet} disabled={isConnecting}>
          <i className="fas fa-wallet"></i> {isConnecting ? "Connecting..." : "Link Wallet"}
        </button>
      )}
    </div>
  );
};

export default MantiLink;