
// ============================================
// FILE: frontend/user/src/components/messaging/ConversationList.jsx
// ============================================
import React, { useState } from 'react';
import { formatRelativeTime } from '../../utils/helpers';

export default function ConversationList({ conversations = [], activeConversationId, onSelectConversation, currentUserId }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = conversations.filter(conv => {
    const otherParticipant = conv.participants?.find(p => p._id !== currentUserId);
    const searchString = `${otherParticipant?.firstName} ${otherParticipant?.lastName} ${conv.lastMessage?.text}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  const getOtherParticipant = (conversation) => {
    return conversation.participants?.find(p => p._id !== currentUserId);
  };

  const getUnreadCount = (conversation) => {
    return conversation.unreadCount?.[currentUserId] || 0;
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-[#e7edf3] dark:border-slate-800">
      {/* Header */}
      <div className="p-4 border-b border-[#e7edf3] dark:border-slate-800">
        <h2 className="text-xl font-bold text-[#0d141b] dark:text-white mb-3">Messages</h2>
        
        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4c739a] dark:text-slate-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#e7edf3] dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0d141b] dark:text-white text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length > 0 ? (
          <div className="divide-y divide-[#e7edf3] dark:divide-slate-800">
            {filteredConversations.map((conversation) => {
              const otherParticipant = getOtherParticipant(conversation);
              const unreadCount = getUnreadCount(conversation);
              const isActive = conversation._id === activeConversationId;

              return (
                <button
                  key={conversation._id}
                  onClick={() => onSelectConversation(conversation)}
                  className={`w-full p-4 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left ${
                    isActive ? 'bg-primary/5 dark:bg-primary/10' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    {otherParticipant?.profilePicture?.url ? (
                      <img
                        src={otherParticipant.profilePicture.url}
                        alt={`${otherParticipant.firstName} ${otherParticipant.lastName}`}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {otherParticipant?.firstName?.charAt(0)}{otherParticipant?.lastName?.charAt(0)}
                      </div>
                    )}
                    
                    {/* Online Status (Optional) */}
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between mb-1">
                      <h3 className={`font-semibold truncate ${
                        unreadCount > 0 
                          ? 'text-[#0d141b] dark:text-white' 
                          : 'text-[#4c739a] dark:text-slate-400'
                      }`}>
                        {otherParticipant?.firstName} {otherParticipant?.lastName}
                      </h3>
                      <span className="text-xs text-[#4c739a] dark:text-slate-400 flex-shrink-0 ml-2">
                        {conversation.lastMessage?.createdAt && formatRelativeTime(conversation.lastMessage.createdAt)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className={`text-sm truncate ${
                        unreadCount > 0 
                          ? 'font-medium text-[#0d141b] dark:text-white' 
                          : 'text-[#4c739a] dark:text-slate-400'
                      }`}>
                        {conversation.lastMessage?.text || 'No messages yet'}
                      </p>
                      
                      {unreadCount > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-primary text-white text-xs font-bold rounded-full flex-shrink-0">
                          {unreadCount}
                        </span>
                      )}
                    </div>

                    {/* Job Info (if exists) */}
                    {conversation.job && (
                      <p className="text-xs text-primary mt-1 truncate">
                        Re: {conversation.job.title}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <svg className="w-16 h-16 text-[#4c739a] dark:text-slate-600 mb-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
            </svg>
            <p className="text-[#4c739a] dark:text-slate-400">
              {searchTerm ? 'No conversations found' : 'No conversations yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}