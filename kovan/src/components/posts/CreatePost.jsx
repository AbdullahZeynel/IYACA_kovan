/**
 * CreatePost Component
 * 
 * A form component to create new posts with validation.
 * Features:
 * - Real-time character count
 * - Tag support
 * - Loading states
 * - Success/Error feedback
 * - Form validation
 */

import React, { useState } from 'react';
import { useFirestoreCRUD } from '../../hooks/useFirestoreCRUD';

export default function CreatePost({ currentUser, onPostCreated }) {
  const { create, loading, error } = useFirestoreCRUD('posts');
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: ''
  });
  
  const [success, setSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setValidationError('');
    setSuccess(false);
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setValidationError('Title is required');
      return false;
    }
    if (formData.title.trim().length < 3) {
      setValidationError('Title must be at least 3 characters');
      return false;
    }
    if (!formData.content.trim()) {
      setValidationError('Content is required');
      return false;
    }
    if (formData.content.trim().length < 10) {
      setValidationError('Content must be at least 10 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');

      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        tags: tagsArray,
        authorId: currentUser?.uid || 'anonymous',
        authorName: currentUser?.displayName || currentUser?.name || 'Anonymous User',
        likes: 0,
        commentCount: 0,
        // For search optimization
        titleLowercase: formData.title.trim().toLowerCase(),
        contentLowercase: formData.content.trim().toLowerCase()
      };

      const newPost = await create(postData);
      
      setSuccess(true);
      setFormData({ title: '', content: '', tags: '' });
      
      // Callback to parent component
      if (onPostCreated) {
        onPostCreated(newPost);
      }

      // Auto-hide success message
      setTimeout(() => setSuccess(false), 3000);

    } catch (err) {
      console.error('Error creating post:', err);
    }
  };

  const characterCount = formData.content.length;
  const maxCharacters = 5000;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Create New Post</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter post title..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            disabled={loading}
          />
        </div>

        {/* Content Textarea */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your post content..."
            rows={6}
            maxLength={maxCharacters}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            disabled={loading}
          />
          <div className="flex justify-between items-center mt-1">
            <p className="text-xs text-gray-500">Minimum 10 characters</p>
            <p className={`text-xs ${characterCount > maxCharacters * 0.9 ? 'text-red-500' : 'text-gray-500'}`}>
              {characterCount} / {maxCharacters}
            </p>
          </div>
        </div>

        {/* Tags Input */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
            Tags <span className="text-gray-400 text-xs">(comma-separated)</span>
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g., react, firebase, tutorial"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            disabled={loading}
          />
          {formData.tags && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.split(',').map((tag, idx) => (
                tag.trim() && (
                  <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {tag.trim()}
                  </span>
                )
              ))}
            </div>
          )}
        </div>

        {/* Validation Error */}
        {validationError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {validationError}
          </div>
        )}

        {/* API Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            ✅ Post created successfully!
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </span>
          ) : (
            'Create Post'
          )}
        </button>
      </form>
    </div>
  );
}
