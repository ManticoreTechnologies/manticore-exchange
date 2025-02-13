import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './components/CommentSection/CommentSection.css';

interface Comment {
  id: string;
  content: string;
  friend_name: string;
  address: string;
  ipfsHash: string;
  created_at?: Date;
  hidden?: boolean;
}

interface CommentSectionProps {
  comments: Comment[];
  newComment: string;
  setNewComment: React.Dispatch<React.SetStateAction<string>>;
  handleAddComment: () => void;
  handleDeleteComment: (commentId: string) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  newComment,
  setNewComment,
  handleAddComment,
  handleDeleteComment
}) => {
  const { t } = useTranslation();
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="trading-comments">
      <div className="comments-header" onClick={() => setShowComments(!showComments)}>
        {t('comments')} ({comments.length})
      </div>
      {showComments && (
        <div>
          <div className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={t('addComment')}
              rows={3}
            />
            <button onClick={handleAddComment} disabled={!newComment.trim()}>
              {t('submitComment')}
            </button>
          </div>
          <ul className="comments-list">
            {comments.map(comment => (
              <li key={comment.id}>
                <div className="comment-header">
                  <span className="comment-author">{comment.friend_name}</span>
                  <span className="comment-date">{comment.created_at?.toLocaleString()}</span>
                  <button onClick={() => handleDeleteComment(comment.id)} className="delete-comment">
                    {t('delete')}
                  </button>
                </div>
                <div className="comment-text">{comment.content}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CommentSection; 