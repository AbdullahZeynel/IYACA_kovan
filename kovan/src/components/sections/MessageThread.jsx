import React, { useState } from 'react';

export default function MessageThread({ conversation, onSendMessage }) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage?.(message);
      setMessage('');
    }
  };

  const currentUserId = 'user-001';

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {conversation.participants.map(p => p.id !== currentUserId && (
            <div key={p.id}>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg">
                  {p.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{p.name}</p>
                  <p className="text-xs text-gray-600">{p.lastSeen}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="text-gray-400 hover:text-gray-600">⋯</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.messages.map(msg => {
          const isCurrentUser = msg.sender === currentUserId;
          return (
            <div key={msg.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-2 rounded-lg ${
                isCurrentUser
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-900 rounded-bl-none'
              }`}>
                <p className="text-sm">{msg.content}</p>
                <p className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-100' : 'text-gray-600'}`}>
                  {msg.timestamp}
                  {isCurrentUser && msg.read && ' ✓✓'}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Mesaj yaz..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Gönder
          </button>
        </div>
      </div>
    </div>
  );
}
