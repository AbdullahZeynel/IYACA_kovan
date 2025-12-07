import React, { useState } from 'react';

export default function PostCard({ post }) {
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 hover:shadow-lg transition">
      {/* Post Header */}
      <div className="flex items-start gap-3 md:gap-4 mb-4">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-xl md:text-2xl flex-shrink-0 text-white shadow">
          {post.author.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 md:gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900 text-sm md:text-base">{post.author.name}</h3>
            {post.author.verified && <span className="text-blue-600 text-lg">✓</span>}
          </div>
          <p className="text-xs md:text-sm text-gray-600">{post.author.title}</p>
          <p className="text-xs text-gray-500">{post.timestamp}</p>
        </div>
        <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition flex-shrink-0">⋯</button>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-gray-700 leading-relaxed text-sm md:text-base">{post.content}</p>
      </div>

      {/* Post Type Badge */}
      {post.type === 'achievement' && (
        <div className="mb-4 p-3 md:p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200 hover:shadow-md transition">
          <p className="text-xs md:text-sm font-semibold text-amber-900">🎖️ Başarı Rozetleri Kazandı</p>
        </div>
      )}

      {post.type === 'event-join' && (
        <div className="mb-4 p-3 md:p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 hover:shadow-md transition">
          <p className="text-xs md:text-sm font-semibold text-purple-900">📅 Etkinliğe Katıldı</p>
        </div>
      )}

      {/* Engagement Stats */}
      <div className="text-xs text-gray-600 mb-4 pb-4 border-b border-gray-200">
        <span className="font-semibold text-gray-900">{post.likes}</span>
        <span> kişi beğendi • </span>
        <span className="font-semibold text-gray-900">{post.comments}</span>
        <span> yorum</span>
      </div>

      {/* Engagement Buttons */}
      <div className="grid grid-cols-4 gap-1 md:gap-2 mb-4">
        <button
          onClick={handleLike}
          className={`flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 md:py-2 rounded-lg font-semibold text-xs md:text-sm transition ${
            liked
              ? 'bg-red-50 text-red-600 hover:bg-red-100'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <span>{liked ? '❤️' : '🤍'}</span>
          <span className="hidden md:inline">Beğen</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 rounded-lg font-semibold text-xs md:text-sm text-gray-600 hover:bg-gray-100 transition"
        >
          <span>💬</span>
          <span className="hidden md:inline">Yorum</span>
        </button>
        <button className="flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 rounded-lg font-semibold text-xs md:text-sm text-gray-600 hover:bg-gray-100 transition">
          <span>🔄</span>
          <span className="hidden md:inline">Paylaş</span>
        </button>
        <button className="flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 rounded-lg font-semibold text-xs md:text-sm text-gray-600 hover:bg-gray-100 transition">
          <span>🔗</span>
          <span className="hidden md:inline">Gönder</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-200 pt-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Sample Comments */}
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
              M
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-900">Mehmet Kaya</p>
              <p className="text-sm text-gray-700 bg-gray-100 p-2 rounded-lg mt-1">Çok güzel başarısı! Tebrik ederim 👏</p>
              <p className="text-xs text-gray-500 mt-1">2 saat önce</p>
            </div>
          </div>

          {/* Comment Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Yorum yap..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-sm">
              Gönder
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
