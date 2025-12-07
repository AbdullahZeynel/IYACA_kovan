import React from 'react';

export default function NotificationCenter({ notifications, onRead }) {
  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type) => {
    switch (type) {
      case 'like': return '❤️';
      case 'comment': return '💬';
      case 'follow': return '👤';
      case 'message': return '✉️';
      default: return '📢';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Bildirimler</h2>
        {unreadCount > 0 && (
          <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map(notif => (
          <div
            key={notif.id}
            onClick={() => onRead?.(notif.id)}
            className={`p-4 rounded-lg border cursor-pointer transition hover:shadow-md ${
              notif.read
                ? 'bg-white border-gray-200'
                : 'bg-blue-50 border-blue-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl flex-shrink-0">{getIcon(notif.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm flex-shrink-0">
                    {notif.actor.avatar}
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    <a href={`/profile/${notif.actor.id}`} className="hover:text-blue-600">
                      {notif.actor.name}
                    </a>
                  </p>
                </div>
                <p className="text-sm text-gray-700 mt-1">
                  <span className="font-medium">{notif.action}</span>
                  {notif.targetPreview && (
                    <span className="text-gray-600 ml-1">"{notif.targetPreview}"</span>
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-1">{notif.timestamp}</p>
              </div>
              {!notif.read && (
                <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-2"></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
