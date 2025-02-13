import React, { useState, useEffect } from 'react';
import './CommentSection.css';

interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

interface CommentSectionProps {
  listingId?: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ listingId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    // Fetch comments when component mounts
    if (listingId) {
      fetchComments();
    }
  }, [listingId]);

  const fetchComments = async () => {
    try {
      // TODO: Implement comment fetching
      const response = await fetch(`/api/listings/${listingId}/comments`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !listingId) return;

    try {
      // TODO: Implement comment submission
      const response = await fetch(`/api/listings/${listingId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (response.ok) {
        setNewComment('');
        fetchComments();
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  return (
    <div className="comment-section">
      <h3 className="comment-section__title">Comments</h3>
      
      <form className="comment-form" onSubmit={handleSubmitComment}>
        <textarea
          className="comment-input"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          rows={3}
        />
        <button type="submit" className="comment-submit">
          Post Comment
        </button>
      </form>

      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <div className="comment__header">
              <span className="comment__author">{comment.author}</span>
              <span className="comment__date">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="comment__content">{comment.content}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="no-comments">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
}; 