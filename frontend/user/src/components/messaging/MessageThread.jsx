
// ============================================
// FILE: frontend/user/src/components/messaging/MessageThread.jsx
// ============================================
import React, { useEffect, useRef } from 'react';
import { formatRelativeTime, formatDate } from '../../utils/helpers';

export default function MessageThread({ messages = [], currentUserId, otherParticipant, onLoadMore, hasMore = false, loading = false }) {
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const groupMessagesByDate = (messages) => {
    const groups = {};
    
    messages.forEach(message => {
      const date = new Date(message.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });

    return Object.entries(groups).map(([date, msgs]) => ({
      date,
      messages: msgs,
    }));
  };

  const groupedMessages = groupMessagesByDate(messages);

  const isToday = (date) => {
    return new Date(date).toDateString() === new Date().toDateString();
  };

  const isYesterday = (date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return new Date(date).toDateString() === yesterday.toDateString();
  };

  const formatDateLabel = (dateString) => {
    if (isToday(dateString)) return 'Today';
    if (isYesterday(dateString)) return 'Yesterday';
    return formatDate(dateString);
  };

  return (
    <div 
      ref={messagesContainerRef}
      className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4 space-y-4"
    >
      {/* Load More Button */}
      {hasMore && (
        <div className="text-center">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load earlier messages'}
          </button>
        </div>
      )}

      {/* Messages */}
      {groupedMessages.length > 0 ? (
        groupedMessages.map((group, groupIndex) => (
          <div key={groupIndex}>
            {/* Date Separator */}
            <div className="flex items-center justify-center my-4">
              <div className="px-3 py-1 bg-white dark:bg-slate-800 rounded-full text-xs font-medium text-[#4c739a] dark:text-slate-400 shadow-sm">
                {formatDateLabel(group.date)}
              </div>
            </div>

            {/* Messages for this date */}
            <div className="space-y-3">
              {group.messages.map((message, index) => {
                const isOwnMessage = message.sender?._id === currentUserId || message.sender === currentUserId;
                const showAvatar = !isOwnMessage && (
                  index === group.messages.length - 1 || 
                  group.messages[index + 1]?.sender?._id !== message.sender?._id
                );

                return (
                  <div
                    key={message._id || index}
                    className={`flex items-end gap-2 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar (for received messages) */}
                    {!isOwnMessage && (
                      <div className="flex-shrink-0 w-8 h-8">
                        {showAvatar ? (
                          otherParticipant?.profilePicture?.url ? (
                            <img
                              src={otherParticipant.profilePicture.url}
                              alt={otherParticipant.firstName}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                              {otherParticipant?.firstName?.charAt(0)}{otherParticipant?.lastName?.charAt(0)}
                            </div>
                          )
                        ) : (
                          <div className="w-8 h-8"></div>
                        )}
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} max-w-[70%]`}>
                      <div
                        className={`rounded-2xl px-4 py-2 ${
                          isOwnMessage
                            ? 'bg-primary text-white rounded-br-sm'
                            : 'bg-white dark:bg-slate-800 text-[#0d141b] dark:text-white rounded-bl-sm shadow-sm'
                        }`}
                      >
                        {/* Text */}
                        {message.text && (
                          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                            {message.text}
                          </p>
                        )}

                        {/* Attachments */}
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {message.attachments.map((attachment, i) => (
                              <div key={i}>
                                {attachment.fileType?.startsWith('image/') ? (
                                  <img
                                    src={attachment.url}
                                    alt={attachment.fileName}
                                    className="max-w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                    onClick={() => window.open(attachment.url, '_blank')}
                                  />
                                ) : (
                                  <a
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-2 p-2 rounded-lg ${
                                      isOwnMessage 
                                        ? 'bg-white/10 hover:bg-white/20' 
                                        : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'
                                    } transition-colors`}
                                  >
                                    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                                    </svg>
                                    <span className="text-xs truncate">{attachment.fileName}</span>
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Timestamp */}
                      <span className={`text-xs mt-1 px-1 ${
                        isOwnMessage ? 'text-primary/70' : 'text-[#4c739a] dark:text-slate-400'
                      }`}>
                        {formatRelativeTime(message.createdAt)}
                        {isOwnMessage && message.isRead && (
                          <span className="ml-1">✓✓</span>
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <svg className="w-20 h-20 text-[#4c739a] dark:text-slate-600 mb-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
          </svg>
          <p className="text-[#4c739a] dark:text-slate-400 text-lg mb-2">No messages yet</p>
          <p className="text-sm text-[#4c739a] dark:text-slate-400">
            Start the conversation by sending a message
          </p>
        </div>
      )}

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
}