/**
 * CommentSection Component
 * 
 * Displays and manages comments for a specific post.
 * Features:
 * - Real-time comments
 * - Add new comments
 * - Delete own comments
 * - Like comments
 * - Auto-increment post comment count
 */

import React, { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  updateDoc,
  increment 
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useCollection, useFirestoreCRUD } from '../../hooks/useFirestoreCRUD';

export default function CommentSection({ postId, currentUser }) {
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch comments with real-time updates
  const { data: comments, loading, error } = useCollection(`posts/${postId}/comments`, {
    orderByField: 'createdAt',
    orderDirection: 'asc',
    realtime: true
  });

  const { incrementField } = useFirestoreCRUD(`posts/${postId}/comments`);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    if (!currentUser) {
      alert('You must be logged in to comment');
      return;
    }

    setSubmitting(true);

    try {
      // Add comment to subcollection
      const commentData = {
        postId: postId,
        content: newComment.trim(),
        authorId: currentUser.uid,
        authorName: currentUser.displayName || currentUser.name || 'Anonymous',
        likes: 0,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, `posts/${postId}/comments`), commentData);

      // Increment post's comment count
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        commentCount: increment(1)
      });

      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
      alert('Failed to add comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      await deleteDoc(doc(db, `posts/${postId}/comments`, commentId));

      // Decrement post's comment count
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        commentCount: increment(-1)
      });
    } catch (err) {
      console.error('Error deleting comment:', err);
      alert('Failed to delete comment.');
    }
  };

  const handleLike = async (commentId) => {
    try {
      await incrementField(commentId, 'likes', 1);
    } catch (err) {
      console.error('Error liking comment:', err);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Just now';
    const d = date instanceof Date ? date : new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="p-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">
        Comments ({comments.length})
      </h4>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-3">
          {currentUser && (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {currentUser.displayName?.charAt(0) || currentUser.name?.charAt(0) || 'U'}
            </div>
          )}
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={currentUser ? "Write a comment..." : "Sign in to comment"}
              rows={2}
              disabled={!currentUser || submitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">
                {newComment.length}/500 characters
              </p>
              <button
                type="submit"
                disabled={!currentUser || !newComment.trim() || submitting}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                  !currentUser || !newComment.trim() || submitting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {submitting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="text-red-600 text-sm">Error loading comments: {error}</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <svg className="mx-auto h-10 w-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment.id} className="flex gap-3 group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {comment.authorName.charAt(0).toUpperCase()}
              </div>
              
              <div className="flex-1 bg-gray-100 rounded-lg p-3">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <span className="font-semibold text-sm text-gray-900">
                      {comment.authorName}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  
                  {currentUser && currentUser.uid === comment.authorId && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-red-500 hover:text-red-700 text-xs opacity-0 group-hover:opacity-100 transition"
                    >
                      Delete
                    </button>
                  )}
                </div>
                
                <p className="text-gray-700 text-sm whitespace-pre-wrap">{comment.content}</p>
                
                <div className="flex items-center gap-4 mt-2">
                  <button
                    onClick={() => handleLike(comment.id)}
                    className="flex items-center gap-1 text-xs text-gray-600 hover:text-blue-600 transition"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    {comment.likes > 0 && <span className="font-medium">{comment.likes}</span>}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
