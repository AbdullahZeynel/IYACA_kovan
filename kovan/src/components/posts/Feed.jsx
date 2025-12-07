/**
 * Feed Component
 * 
 * Displays a list of posts with real-time updates and search functionality.
 * Features:
 * - Real-time post updates
 * - Client-side search
 * - Like functionality
 * - Loading states
 * - Empty states
 * - Responsive design
 */

import React, { useState } from 'react';
import { useCollection, useFirestoreCRUD, useSearch } from '../../hooks/useFirestoreCRUD';
import CommentSection from './CommentSection';

export default function Feed({ currentUser }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedPost, setExpandedPost] = useState(null);

  // Fetch posts with real-time updates
  const { data: posts, loading, error } = useCollection('posts', {
    orderByField: 'createdAt',
    orderDirection: 'desc',
    realtime: true
  });

  // CRUD operations
  const { incrementField, remove, loading: crudLoading } = useFirestoreCRUD('posts');

  // Search functionality
  const filteredPosts = useSearch(posts, searchTerm, ['title', 'content', 'authorName', 'tags']);

  const handleLike = async (postId) => {
    try {
      await incrementField(postId, 'likes', 1);
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await remove(postId);
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const toggleComments = (postId) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  const formatDate = (date) => {
    if (!date) return 'Unknown date';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading posts...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-6">
        <strong>Error loading posts:</strong> {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Search posts by title, content, author, or tags..."
            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          <svg 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        {searchTerm && (
          <p className="text-sm text-gray-600 mt-2">
            Found {filteredPosts.length} result(s) for "{searchTerm}"
            <button 
              onClick={() => setSearchTerm('')}
              className="ml-2 text-blue-600 hover:underline"
            >
              Clear
            </button>
          </p>
        )}
      </div>

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm ? 'No posts found' : 'No posts yet'}
          </h3>
          <p className="text-gray-600">
            {searchTerm ? 'Try different search terms' : 'Be the first to create a post!'}
          </p>
        </div>
      ) : (
        filteredPosts.map(post => (
          <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            {/* Post Header */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {post.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{post.authorName}</h4>
                    <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
                  </div>
                </div>
                
                {/* Delete button for post owner */}
                {currentUser && currentUser.uid === post.authorId && (
                  <button
                    onClick={() => handleDelete(post.id)}
                    disabled={crudLoading}
                    className="text-red-500 hover:text-red-700 text-sm font-medium transition"
                  >
                    Delete
                  </button>
                )}
              </div>

              {/* Post Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
              <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.content}</p>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition group"
                >
                  <svg className="h-5 w-5 group-hover:scale-110 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  <span className="font-semibold">{post.likes || 0}</span>
                </button>

                <button
                  onClick={() => toggleComments(post.id)}
                  className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="font-semibold">{post.commentCount || 0}</span>
                </button>
              </div>
            </div>

            {/* Comments Section */}
            {expandedPost === post.id && (
              <div className="border-t border-gray-200 bg-gray-50">
                <CommentSection 
                  postId={post.id} 
                  currentUser={currentUser}
                />
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
