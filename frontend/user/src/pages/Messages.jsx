// ============================================
// FILE: frontend/user/src/pages/Messages.jsx
// ============================================
import { useState, useEffect, useRef } from 'react';
import FreelancerNavbar from '../components/dashboard/freelancer/FreelancerNavbar';
import FreelancerSidebar from '../components/dashboard/freelancer/FreelancerSidebar';
import { getConversations, getConversation, sendMessage, markAsRead, uploadAttachment } from '../api/messagesApi';
import { useAuth } from '../context/AuthContext';

export default function Messages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, [filter]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const response = await getConversations(filter);
      setConversations(response.data || []);
      if (response.data?.length > 0 && !selectedConversation) {
        setSelectedConversation(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await getConversation(conversationId);
      setMessages(response.data.messages || []);
      await markAsRead(conversationId);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedConversation) return;

    try {
      const response = await sendMessage(selectedConversation.id, messageInput);
      setMessages([...messages, response.data]);
      setMessageInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const response = await uploadAttachment(file);
      // Handle uploaded file
      console.log('File uploaded:', response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const formatDate = (date) => {
    const msgDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (msgDate.toDateString() === today.toDateString()) {
      return formatTime(date);
    } else if (msgDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return msgDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-[#f6f7f8] dark:bg-bg-dark">
        <FreelancerSidebar />
        <div className="flex-1 flex flex-col">
          <FreelancerNavbar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#4c739a] dark:text-slate-400">Loading messages...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f6f7f8] dark:bg-bg-dark overflow-hidden">
      <FreelancerSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <FreelancerNavbar />
        
        <main className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Navigation */}
          <aside className="w-16 md:w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col py-4">
            <div className="px-4 mb-6">
              <h1 className="hidden md:block text-lg font-bold text-[#0d141b] dark:text-white">Chats</h1>
              <p className="hidden md:block text-xs uppercase tracking-wider font-semibold text-slate-500 mt-1">
                Freelance Workspace
              </p>
            </div>

            <nav className="flex flex-col gap-1 px-2">
              <button
                onClick={() => setFilter('all')}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                  filter === 'all'
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                } transition-colors`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H4.99c-1.11 0-1.98.89-1.98 2L3 19c0 1.1.88 2 1.99 2H19c1.1 0 2-.9 2-2V5c0-1.11-.9-2-2-2zm0 12h-4c0 1.66-1.35 3-3 3s-3-1.34-3-3H4.99V5H19v10z"/>
                </svg>
                <span className="hidden md:block text-sm">All Messages</span>
                <span className="hidden md:flex ml-auto bg-primary text-white text-[10px] size-5 items-center justify-center rounded-full">
                  {conversations.length}
                </span>
              </button>

              <button
                onClick={() => setFilter('unread')}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                </svg>
                <span className="hidden md:block text-sm">Unread</span>
              </button>

              <button
                onClick={() => setFilter('starred')}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
                <span className="hidden md:block text-sm">Starred</span>
              </button>

              <button
                onClick={() => setFilter('archived')}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z"/>
                </svg>
                <span className="hidden md:block text-sm">Archived</span>
              </button>
            </nav>
          </aside>

          {/* Conversations List */}
          <section className="w-80 md:w-96 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="relative mb-4">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
                <input
                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`flex items-center gap-4 px-4 py-4 cursor-pointer border-b border-slate-100 dark:border-slate-800/50 ${
                    selectedConversation?.id === conversation.id
                      ? 'bg-white dark:bg-slate-800/40 border-l-4 border-l-primary'
                      : 'hover:bg-white/50 dark:hover:bg-slate-800/20'
                  } transition-colors`}
                >
                  <div className="relative shrink-0">
                    <div
                      className="h-12 w-12 rounded-full bg-cover bg-center"
                      style={{
                        backgroundImage: `url("https://ui-avatars.com/api/?name=${conversation.name}&background=137fec&color=fff")`
                      }}
                    ></div>
                    <div className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-white dark:border-slate-900 ${
                      conversation.online ? 'bg-green-500' : 'bg-slate-300'
                    }`}></div>
                  </div>

                  <div className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {conversation.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {formatDate(conversation.lastMessage?.createdAt)}
                      </span>
                    </div>
                    <p className={`text-xs truncate ${
                      conversation.unread ? 'text-primary font-semibold' : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      {conversation.lastMessage?.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Chat Main Window */}
          <section className="flex-1 flex flex-col bg-white dark:bg-slate-900">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <div
                      className="h-10 w-10 rounded-full bg-cover bg-center"
                      style={{
                        backgroundImage: `url("https://ui-avatars.com/api/?name=${selectedConversation.name}&background=137fec&color=fff")`
                      }}
                    ></div>
                    <div>
                      <h3 className="text-slate-900 dark:text-white font-bold leading-none">
                        {selectedConversation.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`size-2 rounded-full ${selectedConversation.online ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                        <span className="text-slate-500 text-xs font-medium">
                          {selectedConversation.online ? 'Online' : 'Offline'} • {selectedConversation.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-all">
                      Create Contract
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                      </svg>
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                      </svg>
                    </button>
                  </div>
                </header>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {messages.map((message, index) => {
                    const isOwn = message.senderId === user?.id;
                    const showDate = index === 0 || new Date(messages[index - 1].createdAt).toDateString() !== new Date(message.createdAt).toDateString();

                    return (
                      <div key={message.id}>
                        {showDate && (
                          <div className="flex justify-center mb-4">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-800/50 px-3 py-1 rounded-full">
                              {new Date(message.createdAt).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        )}

                        <div className={`flex gap-4 ${isOwn ? 'flex-row-reverse' : ''} max-w-[80%] ${isOwn ? 'ml-auto' : ''}`}>
                          {!isOwn && (
                            <div
                              className="h-8 w-8 rounded-full bg-cover bg-center shrink-0 mt-1"
                              style={{
                                backgroundImage: `url("https://ui-avatars.com/api/?name=${selectedConversation.name}&background=137fec&color=fff")`
                              }}
                            ></div>
                          )}

                          <div className={`flex flex-col ${isOwn ? 'items-end' : ''} gap-1`}>
                            <div className={`p-4 rounded-xl ${
                              isOwn
                                ? 'bg-primary text-white rounded-tr-none'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                            }`}>
                              <p className="text-sm leading-relaxed">{message.content}</p>
                            </div>

                            <div className="flex items-center gap-1">
                              <span className="text-[10px] text-slate-400">
                                {formatTime(message.createdAt)}
                              </span>
                              {isOwn && message.read && (
                                <svg className="w-3 h-3 text-primary" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z"/>
                                </svg>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-6 border-t border-slate-200 dark:border-slate-800">
                  <form onSubmit={handleSendMessage}>
                    <div className="flex flex-col border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5 transition-all">
                      <textarea
                        className="w-full bg-transparent border-none resize-none px-4 py-3 text-sm focus:ring-0 placeholder:text-slate-400"
                        placeholder={`Write a message to ${selectedConversation.name}...`}
                        rows="2"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                          }
                        }}
                      />

                      <div className="flex items-center justify-between px-3 py-2 bg-slate-100/50 dark:bg-slate-800/80 rounded-b-xl">
                        <div className="flex items-center gap-1">
                          <button type="button" className="p-2 text-slate-500 hover:text-primary transition-colors">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
                            </svg>
                          </button>
                          <label className="p-2 text-slate-500 hover:text-primary transition-colors cursor-pointer">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/>
                            </svg>
                            <input type="file" className="hidden" onChange={handleFileUpload} />
                          </label>
                          <button type="button" className="p-2 text-slate-500 hover:text-primary transition-colors">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                            </svg>
                          </button>
                        </div>

                        <button
                          type="submit"
                          disabled={!messageInput.trim()}
                          className="flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span>Send</span>
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-center gap-2">
                      <span className="text-[10px] text-slate-400">
                        Press Enter to send, Shift + Enter for new line
                      </span>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-20 h-20 mx-auto mb-4 text-slate-300" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
                  </svg>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    No conversation selected
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}