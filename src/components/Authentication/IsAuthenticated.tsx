
//@ts-ignore
import React, { ReactNode } from "react";
import CommentsSection from "../Comments/CommentsSection";
import useWebSocket from "../../hooks/useWebSocket";
const wsUrl = `${process.env.VITE_TRADING_WS_HOST === 'localhost' ? 'ws' : 'wss'}://${process.env.VITE_TRADING_WS_HOST}:${process.env.VITE_TRADING_WS_PORT}`;

interface IsAuthenticatedProps {
  children: React.ReactNode;
}

const IsAuthenticated: React.FC<IsAuthenticatedProps> = ({ children }) => {
  const { isAuthenticated } = useWebSocket(wsUrl);
  
  if (!isAuthenticated) {
    return <div>
        <CommentsSection
            comments={[]}
            isAuthenticated={false}
            //@ts-ignore
            userAddress=""
            //@ts-ignore
            onAddComment={(text: string) => {}}
            //@ts-ignore
            onEditComment={(id, text) => {}}
            //@ts-ignore
            onDeleteComment={(id) => {}}
        />
        log in to view this content
    </div>;
  }

  return <>{children}</>;
};

export default IsAuthenticated;
