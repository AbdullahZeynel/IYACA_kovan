import React from 'react';
import { useCollection, useDocument, useCollectionRealtime, useDocumentRealtime } from '../hooks/useFirestore';

/**
 * EXAMPLE 1: Fetch All Posts (One-time fetch)
 */
export const PostsList = () => {
  const { data: posts, loading, error } = useCollection('posts', {
    orderBy: ['createdAt', 'desc'],
    limit: 10
  });

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">All Posts</h2>
      {posts.map(post => (
        <div key={post.id} className="p-4 border rounded-lg">
          <h3 className="font-bold">{post.authorInfo?.name}</h3>
          <p className="text-gray-600">{post.content}</p>
          <div className="flex gap-4 mt-2 text-sm text-gray-500">
            <span>👍 {post.engagement?.likes || 0}</span>
            <span>💬 {post.engagement?.comments || 0}</span>
            <span>👁️ {post.engagement?.views || 0}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * EXAMPLE 2: Fetch Posts by Specific User
 */
export const UserPosts = ({ userId }) => {
  const { data: posts, loading, error } = useCollection('posts', {
    where: ['authorId', '==', userId],
    orderBy: ['createdAt', 'desc']
  });

  if (loading) return <div>Loading user posts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h3>My Posts ({posts.length})</h3>
      {posts.map(post => (
        <div key={post.id}>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
};

/**
 * EXAMPLE 3: Fetch Single Post by ID
 */
export const SinglePost = ({ postId }) => {
  const { data: post, loading, error } = useDocument('posts', postId);

  if (loading) return <div>Loading post...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <article className="max-w-2xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-4">
        {post.authorInfo?.avatarUrl && (
          <img 
            src={post.authorInfo.avatarUrl} 
            alt={post.authorInfo.name}
            className="w-12 h-12 rounded-full"
          />
        )}
        <div>
          <h4 className="font-bold">{post.authorInfo?.name}</h4>
          <p className="text-sm text-gray-500">{post.authorInfo?.title}</p>
        </div>
      </div>
      <p className="text-lg">{post.content}</p>
      {post.media && post.media.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {post.media.map((mediaUrl, index) => (
            <img key={index} src={mediaUrl} alt="" className="rounded-lg" />
          ))}
        </div>
      )}
      <div className="flex gap-6 mt-4 text-gray-600">
        <button className="flex items-center gap-2">
          👍 {post.engagement?.likes || 0}
        </button>
        <button className="flex items-center gap-2">
          💬 {post.engagement?.comments || 0}
        </button>
        <button className="flex items-center gap-2">
          🔗 {post.engagement?.shares || 0}
        </button>
      </div>
    </article>
  );
};

/**
 * EXAMPLE 4: Real-time Notifications (Auto-updates)
 */
export const NotificationCenter = ({ userId }) => {
  const { data: notifications, loading, error } = useCollectionRealtime('notifications', {
    where: ['userId', '==', userId],
    orderBy: ['createdAt', 'desc'],
    limit: 20
  });

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) return <div>Loading notifications...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Notifications</h2>
        {unreadCount > 0 && (
          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm">
            {unreadCount}
          </span>
        )}
      </div>
      <div className="space-y-2">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`p-3 rounded-lg ${notification.isRead ? 'bg-gray-100' : 'bg-blue-50'}`}
          >
            <p className="font-semibold">{notification.title}</p>
            <p className="text-sm text-gray-600">{notification.message}</p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(notification.createdAt).toLocaleString('tr-TR')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * EXAMPLE 5: Real-time User Profile (Auto-updates)
 */
export const UserProfileLive = ({ userId }) => {
  const { data: user, loading, error } = useDocumentRealtime('users', userId);

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center gap-4 mb-4">
        <img 
          src={user.profile?.avatarUrl || '/default-avatar.png'} 
          alt={user.profile?.name}
          className="w-20 h-20 rounded-full"
        />
        <div>
          <h2 className="text-2xl font-bold">{user.profile?.name}</h2>
          <p className="text-gray-600">{user.profile?.headline}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{user.stats?.followers || 0}</p>
          <p className="text-sm text-gray-500">Followers</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">{user.stats?.posts || 0}</p>
          <p className="text-sm text-gray-500">Posts</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{user.stats?.projectsCompleted || 0}</p>
          <p className="text-sm text-gray-500">Projects</p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-bold mb-2">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {user.skills?.map((skill, index) => (
            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-bold mb-2">Badges</h3>
        <div className="flex gap-2">
          {user.gamification?.badges?.map((badgeId, index) => (
            <div key={index} className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              🏆
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * EXAMPLE 6: Fetch Volunteer Programs
 */
export const ProgramsList = () => {
  const { data: programs, loading, error } = useCollection('programs', {
    where: ['isActive', '==', true],
    orderBy: ['createdAt', 'desc']
  });

  if (loading) return <div>Loading programs...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {programs.map(program => (
        <div key={program.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          {program.media?.coverImage && (
            <img 
              src={program.media.coverImage} 
              alt={program.title}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4">
            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded mb-2">
              {program.category}
            </span>
            <h3 className="text-lg font-bold mb-2">{program.title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{program.description}</p>
            <div className="flex justify-between text-sm text-gray-500">
              <span>📍 {program.location?.city}</span>
              <span>👥 {program.participants?.current}/{program.participants?.max}</span>
            </div>
            <button className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
              Başvur
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * EXAMPLE 7: Fetch Comments for a Post (Real-time)
 */
export const PostComments = ({ postId }) => {
  const { data: comments, loading, error } = useCollectionRealtime(`posts/${postId}/comments`, {
    orderBy: ['createdAt', 'asc']
  });

  if (loading) return <div>Loading comments...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold mb-4">Comments ({comments.length})</h3>
      <div className="space-y-3">
        {comments.map(comment => (
          <div key={comment.id} className="flex gap-3">
            <img 
              src={comment.authorInfo?.avatarUrl || '/default-avatar.png'} 
              alt={comment.authorInfo?.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 bg-gray-100 rounded-lg p-3">
              <p className="font-semibold text-sm">{comment.authorInfo?.name}</p>
              <p className="text-gray-700">{comment.content}</p>
              <div className="flex gap-4 mt-2 text-xs text-gray-500">
                <button>👍 {comment.likes || 0}</button>
                <span>{new Date(comment.createdAt).toLocaleString('tr-TR')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
