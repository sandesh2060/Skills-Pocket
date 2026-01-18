// ============================================
// FILE: frontend/user/src/components/inbox/ConversationList.jsx
// ============================================
import { useState } from 'react';
import { Search, MessageSquare, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useSocket } from '../../context/SocketContext';

export default function ConversationList({ 
  conversations, 
  selectedConversation, 
  onSelectConversation,
  currentUserId 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const { isUserOnline } = useSocket();

  const filteredConversations = conversations.filter((conv) => {
    const otherUser = conv.participants.find(p => p._id !== currentUserId);
    const userName = `${otherUser?.firstName} ${otherUser?.lastName}`.toLowerCase();
    return userName.includes(searchTerm.toLowerCase());
  });

  const getOtherUser = (conversation) => {
    return conversation.participants.find(p => p._id !== currentUserId);
  };

  const getUnreadCount = (conversation) => {
    return conversation.unreadCount?.get?.(currentUserId) || 
           conversation.unreadCount?.[currentUserId] || 0;
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return '';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          Messages
        </h2>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-slate-600 dark:text-slate-400">
              {searchTerm ? 'No conversations found' : 'No messages yet'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {filteredConversations.map((conversation) => {
              const otherUser = getOtherUser(conversation);
              const unreadCount = getUnreadCount(conversation);
              const isSelected = selectedConversation?._id === conversation._id;
              const isOnline = isUserOnline(otherUser?._id);

              return (
                <button
                  key={conversation._id}
                  onClick={() => onSelectConversation(conversation)}
                  className={`w-full p-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left ${
                    isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      {otherUser?.profilePicture?.url ? (
                        <img
                          src={otherUser.profilePicture.url}
                          alt={`${otherUser.firstName} ${otherUser.lastName}`}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                          {otherUser?.firstName?.[0]}{otherUser?.lastName?.[0]}
                        </div>
                      )}
                      
                      {/* Online indicator */}
                      {isOnline && (
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between mb-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                          {otherUser?.firstName} {otherUser?.lastName}
                        </h3>
                        {conversation.lastMessage?.timestamp && (
                          <span className="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0 ml-2">
                            {formatTime(conversation.lastMessage.timestamp)}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className={`text-sm truncate ${
                          unreadCount > 0 
                            ? 'font-semibold text-slate-900 dark:text-white' 
                            : 'text-slate-600 dark:text-slate-400'
                        }`}>
                          {conversation.lastMessage?.text || 'No messages yet'}
                        </p>
                        
                        {unreadCount > 0 && (
                          <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded-full flex-shrink-0">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}