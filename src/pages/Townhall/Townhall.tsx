import CommentsSection from "../../____components/common/CommentsSection";
import { useEffect, useState } from "react";
import useWebSocket from "../../hooks/useWebSocket";
import IsAuthenticated from "../../components/Authentication/IsAuthenticated";
import styles from './Townhall.module.css';
import { Comment } from '../../types/comments';
const wsUrl = `${process.env.VITE_TRADING_WS_HOST === 'localhost' ? 'ws' : 'wss'}://${process.env.VITE_TRADING_WS_HOST}:${process.env.VITE_TRADING_WS_PORT}`;

/**
 * Townhall page
 */

const Townhall = () => {

  const [comments, setComments] = useState<Comment[]>([]);
  //@ts-ignore
  const { sendMessage, message, isConnected, isAuthenticated, getUserAddress } = useWebSocket(wsUrl);
  /* Process incoming messages from websocket */
  useEffect(() => {
    try {
      if (!message) return;

      const [command, ...dataParts] = message.split(' ');
      const data = dataParts.join(' ');

      switch (command) {
        case 'townhall_comments':
          if (data) {
            const parsedMessage = JSON.parse(data);
            console.log(parsedMessage);
            setComments(parsedMessage);
          }
          break;
          
        case 'townhall_comment_added':
          if (data) {
            const parsedMessage = JSON.parse(data);
            console.log(parsedMessage);
            setComments(prevComments => [...prevComments, parsedMessage]);
          }
          break;

        case 'townhall_comment_deleted':
          setComments(prevComments =>
            prevComments.map(comment =>
              //@ts-ignore
              comment.id === data ? { ...comment, hidden: true } : comment
            )
          );
          break;

        case 'townhall_comment_updated':
          if (data) {
            const parsedMessage = JSON.parse(data);
            setComments(prevComments =>
              prevComments.map(comment =>
                //@ts-ignore
                comment.id === parsedMessage.id ? parsedMessage : comment
              )
            );
          }
          break;

        case 'townhall_message':
          if (data) {
            const parsedMessage = JSON.parse(data);
            console.log('Received broadcast message:', parsedMessage);
            // Convert the broadcast message to a Comment type and add it to the comments
            const newComment: Comment = {
              id: Date.now().toString(), // Generate temporary ID for the comment
              address: parsedMessage.address,
              friend_name: parsedMessage.friendly_name, 
              ipfs_hash: parsedMessage.ipfs,
              content: parsedMessage.message,
              timestamp: new Date().toISOString(),
              hidden: false
            };
            console.log(newComment);
            setComments(prevComments => [...prevComments, newComment]);
          }
          break;
      }
    } catch (error) {
      console.error('Error processing websocket message:', error);
    }
  }, [message, isConnected]);

  const onAddComment = (newComment: string) => {
    const userAddr = getUserAddress();
    if (userAddr) {
      sendMessage(`broadcast_townhall_message "${newComment}" `);
    }
  }
  
  // const onDeleteComment = (commentId: string) => {
  //   sendMessage(`delete_townhall_comment ${commentId}`)
  // }

  // const onEditComment = (commentId: string, newComment: string) => {
  //   sendMessage(`update_townhall_comment ${commentId} ${newComment}`)
  // }

  return (

    <div className={styles.townhallContainer}>
      <div className={styles.roofOuter}></div>
      <div className={styles.roofInner}>
        <div className={styles.roofTitle}>TOWN HALL</div>
      </div>
      <div className={styles.pillarLeft}></div>
      <div className={styles.pillarRight}></div>
      <div className={styles.content}>
        <CommentsSection 
          comments={comments} 
          isAuthenticated={isAuthenticated} 
          userAddress={getUserAddress() || ''} 
          onAddComment={onAddComment}
          // onEditComment={onEditComment}
          // onDeleteComment={onDeleteComment}
        />
      </div>
    </div>

  );
};

export default Townhall;
