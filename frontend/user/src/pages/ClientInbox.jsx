// ============================================
// FILE: frontend/user/src/pages/ClientInbox.jsx
// UPDATED VERSION - Matches FreelancerMessages architecture
// ============================================
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import ClientNavbar from '../components/dashboard/client/ClientNavbar';
import ClientSidebar from '../components/dashboard/client/ClientSidebar';
import { 
  getConversations, 
  getMessages, 
  sendMessage, 
  markAsRead 
} from '../api/messageApi';

export default function ClientInbox() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  // Load conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Auto-select conversation from URL query parameter
  useEffect(() => {
    const conversationId = searchParams.get('conversation');
    if (conversationId && conversations.length > 0) {
      const conversation = conversations.find(c => c._id === conversationId);
      if (conversation) {
        handleSelectConversation(conversation);
        // Remove query parameter after selecting
        navigate('/client/inbox', { replace: true });
      }
    }
  }, [searchParams, conversations]);

  const fetchConversations = async () => {
    try {
      setLoadingConversations(true);
      const response = await getConversations();
      
      if (response.success) {
        setConversations(response.data.conversations || []);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoadingConversations(false);
    }
  };

  const handleSelectConversation = async (conversation) => {
    try {
      setSelectedConversation(conversation);
      setLoadingMessages(true);
      
      const response = await getMessages(conversation._id);
      
      if (response.success) {
        setMessages(response.data.messages || []);
        // Mark as read
        await markAsRead(conversation._id);
        // Update conversation in list
        setConversations(prev => 
          prev.map(c => 
            c._id === conversation._id 
              ? { ...c, unreadCount: 0 }
              : c
          )
        );
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!messageInput.trim() || !selectedConversation) return;

    try {
      setSendingMessage(true);
      
      const response = await sendMessage(selectedConversation._id, messageInput.trim());
      
      if (response.success) {
        setMessages(prev => [...prev, response.data.message]);
        setMessageInput('');
        
        // Update conversation list with new last message
        setConversations(prev => 
          prev.map(c => 
            c._id === selectedConversation._id
              ? { 
                  ...c, 
                  lastMessage: response.data.message.content,
                  lastMessageAt: response.data.message.createdAt 
                }
              : c
          )
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const getOtherParticipant = (conversation) => {
    return conversation.participants?.find(p => p._id !== user._id);
  };

  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f7f8] dark:bg-bg-dark">
      <ClientSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <ClientNavbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-hidden">
          <div className="h-full flex">
            {/* Conversations List */}
            <div className="w-full md:w-80 lg:w-96 border-r border-[#e7edf3] dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col">
              <div className="p-4 border-b border-[#e7edf3] dark:border-slate-800">
                <h1 className="text-2xl font-bold text-[#0d141b] dark:text-white">Inbox</h1>
                <p className="text-sm text-[#4c739a] dark:text-slate-400 mt-1">
                  Message your freelancers
                </p>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {loadingConversations ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="p-8 text-center">
                    <svg className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-[#4c739a] dark:text-slate-400 font-semibold mb-2">No conversations yet</p>
                    <p className="text-sm text-[#4c739a] dark:text-slate-400 mb-4">
                      Hire freelancers to start messaging them
                    </p>
                    <button
                      onClick={() => navigate('/client/hire')}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Browse Freelancers
                    </button>
                  </div>
                ) : (
                  conversations.map(conversation => {
                    const otherUser = getOtherParticipant(conversation);
                    const isSelected = selectedConversation?._id === conversation._id;
                    
                    return (
                      <button
                        key={conversation._id}
                        onClick={() => handleSelectConversation(conversation)}
                        className={`w-full p-4 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                          isSelected ? 'bg-primary/10 dark:bg-primary/20 border-l-4 border-primary' : ''
                        }`}
                      >
                        {otherUser?.profilePicture ? (
                          <img
                            src={otherUser.profilePicture}
                            alt={`${otherUser.firstName} ${otherUser.lastName}`}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                            {otherUser?.firstName?.[0]}{otherUser?.lastName?.[0]}
                          </div>
                        )}
                        
                        <div className="flex-1 text-left min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-[#0d141b] dark:text-white truncate">
                              {otherUser?.firstName} {otherUser?.lastName}
                            </h3>
                            <span className="text-xs text-[#4c739a] dark:text-slate-400 ml-2 flex-shrink-0">
                              {formatMessageTime(conversation.lastMessageAt)}
                            </span>
                          </div>
                          <p className="text-sm text-[#4c739a] dark:text-slate-400 truncate">
                            {conversation.lastMessage || 'Start a conversation'}
                          </p>
                          {otherUser?.role === 'freelancer' && (
                            <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
                              Freelancer
                            </span>
                          )}
                        </div>
                        
                        {conversation.unreadCount > 0 && (
                          <div className="flex-shrink-0 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-xs text-white font-bold">
                              {conversation.unreadCount}
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Message Thread */}
            <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
              {!selectedConversation ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-24 h-24 mx-auto text-slate-300 dark:text-slate-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-xl text-[#4c739a] dark:text-slate-400 font-semibold">
                      Select a conversation to start messaging
                    </p>
                    <p className="text-sm text-[#4c739a] dark:text-slate-400 mt-2">
                      Choose a freelancer from the left to view your conversation
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Conversation Header */}
                  <div className="p-4 border-b border-[#e7edf3] dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {(() => {
                        const otherUser = getOtherParticipant(selectedConversation);
                        return (
                          <>
                            {otherUser?.profilePicture ? (
                              <img
                                src={otherUser.profilePicture}
                                alt={`${otherUser.firstName} ${otherUser.lastName}`}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                                {otherUser?.firstName?.[0]}{otherUser?.lastName?.[0]}
                              </div>
                            )}
                            <div>
                              <h2 className="font-bold text-[#0d141b] dark:text-white">
                                {otherUser?.firstName} {otherUser?.lastName}
                              </h2>
                              <p className="text-sm text-[#4c739a] dark:text-slate-400">
                                {otherUser?.role === 'freelancer' ? 'Freelancer' : otherUser?.company || 'User'}
                              </p>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                    
                    {/* View Profile Button */}
                    <button
                      onClick={() => {
                        const otherUser = getOtherParticipant(selectedConversation);
                        navigate(`/freelancer/${otherUser?._id}`);
                      }}
                      className="px-4 py-2 text-sm border border-slate-300 dark:border-slate-700 text-[#0d141b] dark:text-white rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      View Profile
                    </button>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {loadingMessages ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-[#4c739a] dark:text-slate-400">
                          No messages yet. Start the conversation!
                        </p>
                      </div>
                    ) : (
                      messages.map(message => {
                        const isOwn = message.sender._id === user._id;
                        return (
                          <div
                            key={message._id}
                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                              <div
                                className={`px-4 py-2 rounded-2xl ${
                                  isOwn
                                    ? 'bg-primary text-white'
                                    : 'bg-slate-100 dark:bg-slate-800 text-[#0d141b] dark:text-white'
                                }`}
                              >
                                <p className="break-words">{message.content}</p>
                              </div>
                              <p className={`text-xs text-[#4c739a] dark:text-slate-400 mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
                                {formatMessageTime(message.createdAt)}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="p-4 border-t border-[#e7edf3] dark:border-slate-800">
                    <div className="flex items-end gap-3">
                      <textarea
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type your message..."
                        rows={1}
                        className="flex-1 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0d141b] dark:text-white outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                          }
                        }}
                      />
                      <button
                        type="submit"
                        disabled={!messageInput.trim() || sendingMessage}
                        className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {sendingMessage ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            Send
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}