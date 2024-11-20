import React, { ReactNode } from "react";
import CommentsSection from "../../____components/common/CommentsSection";
import useWebSocket from "../../hooks/useWebSocket";

interface IsAuthenticatedProps {
  children: React.ReactNode;
}

const IsAuthenticated: React.FC<IsAuthenticatedProps> = ({ children }) => {
  const { isAuthenticated } = useWebSocket("ws://localhost:8765");
  
  if (!isAuthenticated) {
    return <div>
        <CommentsSection
            comments={[]}
            isAuthenticated={false}
            userAddress=""
            onAddComment={(text: string) => {}}
            onEditComment={(id, text) => {}}
            onDeleteComment={(id) => {}}
        />
        log in to view this content
    </div>;
  }

  return <>{children}</>;
};

export default IsAuthenticated;
