// ============================================
// FILE: frontend/user/src/components/inbox/ChatWindow.jsx
// ============================================
import { useState, useEffect, useRef } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { isSameDay, format } from 'date-fns';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import conversationService from '../../services/conversationService';
import messageService from '../../services/messageService';
import { useSocket } from '../../context/SocketContext';
import { toast } from 'react-hot-toast';

export default function ChatWindow({ 
  conversation, 
  currentUserId,
  onBack 
}) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const { socket } = useSocket();

  const otherUser = conversation.participants.find(p => p._id !== currentUserId);
  const conversationId = conversation._id;

  // Load messages on mount or conversation change
  useEffect(() => {
    loadMessages();
    
    // Join conversation room
    socket.joinConversation(conversationId);

    // Mark as read
    markConversationAsRead();

    return () => {
      socket.leaveConversation(conversationId);
    };
  }, [conversationId]);

  // Socket listeners
  useEffect(() => {
    const handleNewMessage = (data) => {
      if (data.conversationId === conversationId) {
        setMessages((prev) => [...prev, data.message]);
        scrollToBottom();
        markConversationAsRead();
      }
    };

    const handleMessageSent = (data) => {
      if (data.conversationId === conversationId && data.senderId !== currentUserId) {
        // Message already added via handleNewMessage
      }
    };

    const handleUserTyping = (data) => {
      if (data.conversationId === conversationId && data.userId !== currentUserId) {
        setIsTyping(true);
      }
    };

    const handleUserStopTyping = (data) => {
      if (data.conversationId === conversationId && data.userId !== currentUserId) {
        setIsTyping(false);
      }
    };

    const handleMessagesRead = (data) => {
      if (data.conversationId === conversationId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.sender._id === currentUserId ? { ...msg, isRead: true, readAt: new Date() } : msg
          )
        );
      }
    };

    socket.onNewMessage(handleNewMessage);
    socket.onMessageSent(handleMessageSent);
    socket.onUserTyping(handleUserTyping);
    socket.onUserStopTyping(handleUserStopTyping);
    socket.onMessagesRead(handleMessagesRead);

    return () => {
      socket.removeNewMessageListener(handleNewMessage);
      socket.removeMessageSentListener(handleMessageSent);
      socket.removeTypingListener(handleUserTyping);
      socket.removeStopTypingListener(handleUserStopTyping);
      socket.removeMessagesReadListener(handleMessagesRead);
    };
  }, [conversationId, currentUserId, socket]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, isTyping]);

  const loadMessages = async (pageNum = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await conversationService.getConversationMessages(conversationId, pageNum);
      
      if (response.success) {
        if (pageNum === 1) {
          setMessages(response.data.messages);
        } else {
          setMessages((prev) => [...response.data.messages, ...prev]);
        }
        setHasMore(response.data.pagination.currentPage < response.data.pagination.totalPages);
      }
    } catch (err) {
      setError(err.message || 'Failed to load messages');
      toast.error(err.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const markConversationAsRead = async () => {
    try {
      await conversationService.markAsRead(conversationId);
      socket.markAsRead({
        conversationId,
        recipientId: otherUser._id,
      });
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleSendMessage = async (messageData) => {
    setSending(true);

    try {
      const payload = {
        conversationId,
        recipientId: otherUser._id,
        text: messageData.text,
        attachments: messageData.attachments,
      };

      const response = await messageService.sendMessage(payload);

      if (response.success) {
        const newMessage = response.data;
        setMessages((prev) => [...prev, newMessage]);
        
        // Emit via socket
        socket.sendMessage({
          conversationId,
          recipientId: otherUser._id,
          message: newMessage,
        });

        scrollToBottom();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleTyping = () => {
    socket.sendTyping({
      conversationId,
      recipientId: otherUser._id,
    });
  };

  const handleStopTyping = () => {
    socket.sendStopTyping({
      conversationId,
      recipientId: otherUser._id,
    });
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const loadMoreMessages = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadMessages(nextPage);
    }
  };

  const renderDateDivider = (currentMessage, previousMessage) => {
    if (!previousMessage || !isSameDay(new Date(currentMessage.createdAt), new Date(previousMessage.createdAt))) {
      return (
        <div className="flex items-center justify-center my-4">
          <div className="px-4 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-xs text-slate-600 dark:text-slate-400">
            {format(new Date(currentMessage.createdAt), 'MMMM d, yyyy')}
          </div>
        </div>
      );
    }
    return null;
  };

  const shouldShowAvatar = (currentMessage, nextMessage) => {
    if (!nextMessage) return true;
    return currentMessage.sender._id !== nextMessage.sender._id;
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800">
      {/* Header */}
      <ChatHeader otherUser={otherUser} onBack={onBack} />

      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-1"
      >
        {/* Load More Button */}
        {hasMore && !loading && (
          <div className="flex justify-center mb-4">
            <button
              onClick={loadMoreMessages}
              className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Load older messages
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && page === 1 && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
              <p className="text-slate-600 dark:text-slate-400">Loading messages...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 dark:text-red-200">
                  Error Loading Messages
                </h3>
                <p className="text-red-700 dark:text-red-300 text-sm mt-1">{error}</p>
                <button
                  onClick={() => loadMessages()}
                  className="mt-2 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        {!loading && !error && messages.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <p className="text-slate-600 dark:text-slate-400">
              No messages yet. Start the conversation!
            </p>
          </div>
        )}

        {!loading && !error && messages.map((msg, index) => (
          <div key={msg._id || index}>
            {renderDateDivider(msg, messages[index - 1])}
            <MessageBubble
              message={msg}
              isOwn={msg.sender._id === currentUserId}
              showAvatar={shouldShowAvatar(msg, messages[index + 1])}
              otherUser={otherUser}
            />
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && <TypingIndicator otherUser={otherUser} />}

        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        onTyping={handleTyping}
        onStopTyping={handleStopTyping}
        disabled={sending}
      />
    </div>
  );
}