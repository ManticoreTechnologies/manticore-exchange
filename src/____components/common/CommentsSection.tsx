import React, { useState } from 'react';

interface Comment {
  id: string | number;
  text: string;
  friend_name: string;
  address: string;
  hidden?: boolean;
}

interface CommentsSectionProps {
  comments: Comment[];
  isAuthenticated: boolean;
  userAddress: string;
  onAddComment: (text: string) => void;
  onEditComment: (commentId: string | number, newText: string) => void;
  onDeleteComment: (commentId: string | number) => void;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  comments,
  isAuthenticated,
  userAddress,
  onAddComment,
  onEditComment,
  onDeleteComment,
}) => {
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | number | null>(null);
  const [editingCommentText, setEditingCommentText] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  const handleEditComment = (commentId: string | number, text: string) => {
    setEditingCommentId(commentId);
    setEditingCommentText(text);
  };

  const handleSaveEdit = () => {
    if (editingCommentId && editingCommentText.trim()) {
      onEditComment(editingCommentId, editingCommentText);
      setEditingCommentId(null);
      setEditingCommentText('');
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
                {editingCommentId === comment.id ? (
                  <>
                    <textarea
                      value={editingCommentText}
                      onChange={(e) => setEditingCommentText(e.target.value)}
                      maxLength={500}
                    />
                    <button onClick={handleSaveEdit}>Save</button>
                    <button onClick={() => setEditingCommentId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <strong>{comment.friend_name}:</strong> {comment.text}
                    {comment.address === userAddress && (
                      <>
                        <button
                          onClick={() => handleEditComment(comment.id, comment.text)}
                          className="edit-comment"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => onDeleteComment(comment.id)}
                          className="delete-comment"
                        >
                          🗑️
                        </button>
                      </>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
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