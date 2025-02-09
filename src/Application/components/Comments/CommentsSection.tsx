import React, { useState } from 'react';
import "./CommentsSection.css"

//@ts-ignore
interface Comment {
  id: string | number;
  content: string;
  friend_name: string;
  address: string;
  hidden?: boolean;
  ipfsHash: string;
}

interface CommentsSectionProps {
  comments: Comment[];
  isAuthenticated: boolean;
  onAddComment: (text: string) => void;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  comments,
  isAuthenticated,
  onAddComment,
}) => {
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  return (
    <div className="comments-section">
      <h2>Comments</h2>
      {isAuthenticated ? (
        <div>
          <ul>
            {comments.map((comment) => (
              <li 
                key={comment.id} 
                style={{ display: comment.hidden ? 'none' : 'block' }}
              >
                <strong>{comment.friend_name}:</strong> {comment.content}
                {comment.ipfsHash && (
                  <div className="comment-image">
                    <img 
                      src={`https://rose-decent-prawn-420.mypinata.cloud/ipfs/${comment.ipfsHash}?pinataGatewayToken=HtcAOAK7UkS5a7JrD-_1j4FwStTV2Qw4uNJ7_Esk-TvoCsn87T6wUeoq6w7WN3SO`} 
                      alt="Comment attachment"
                      style={{ maxWidth: '200px', marginTop: '8px' }}
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>

          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a comment..."
            maxLength={500}
          />
          <button onClick={handleAddComment}>Submit</button>
        </div>
      ) : (
        <div className="locked-comments">
          <span role="img" aria-label="lock">🔒</span> Authenticate with wallet for access to feature.
        </div>
      )}
    </div>
  );
};

export default CommentsSection; 