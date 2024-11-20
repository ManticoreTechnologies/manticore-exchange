import CommentsSection from "../../../____components/common/CommentsSection";
import { useEffect, useState } from "react";
import useWebSocket from "../../../hooks/useWebSocket";
import IsAuthenticated from "../../../components/Authentication/IsAuthenticated";
import styles from './Townhall.module.css';

/**
 * Townhall page
 */

const Townhall = () => {

    const [comments, setComments] = useState<Comment[]>([]);
    const { sendMessage, message, isConnected, isAuthenticated, getUserAddress } = useWebSocket("ws://localhost:8765");
  /* Process incoming messages from websocket */
  useEffect(() => {
    if (message && message.includes("asset_comments")) {
      const parsedMessage = JSON.parse(message.replace("asset_comments ", ""));
      setComments(parsedMessage);
    }

    if (message && message.includes("asset_comment_added")) {
      const parsedMessage = JSON.parse(message.replace("asset_comment_added ", ""));
      if (parsedMessage.asset_name === name) {
        setComments(prevComments => [...prevComments, parsedMessage]);
      }
    }

    if (message && message.includes("asset_comment_deleted")) {
      const id = message.replace("asset_comment_deleted ", "");
      setComments(prevComments => 
        prevComments.map(comment => 
          comment.id === id ? { ...comment, hidden: true } : comment
        )
      );
    }

    if (message && message.includes("asset_comment_updated")) {
      const parsedMessage = JSON.parse(message.replace("asset_comment_updated ", ""));
      setComments(prevComments =>
        prevComments.map(comment =>
          comment.id === parsedMessage.id ? parsedMessage : comment
        )
      );
    }
  }, [message]);

    return (
        <IsAuthenticated
        >
            <div className={styles.townhallContainer}>
                <div className={styles.roofOuter}></div>
                <div className={styles.roofInner}>
                    <div className={styles.roofTitle}>TOWN HALL</div>
                </div>
                <div className={styles.pillarLeft}></div>
                <div className={styles.pillarRight}></div>
                <div className={styles.content}>
                    <CommentsSection comments={comments} isAuthenticated={isAuthenticated} userAddress={getUserAddress()} onAddComment={() => {}} onEditComment={() => {}} onDeleteComment={() => {}} />
                </div>
            </div>
        </IsAuthenticated>
    );
};

export default Townhall;
