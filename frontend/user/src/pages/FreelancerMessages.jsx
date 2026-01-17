// ============================================
// FILE: frontend/user/src/pages/FreelancerMessages.jsx
// ============================================
import { useState } from 'react';
import FreelancerNavbar from '../components/dashboard/freelancer/FreelancerNavbar';
import FreelancerSidebar from '../components/dashboard/freelancer/FreelancerSidebar';

export default function FreelancerMessages() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(1);

  const conversations = [
    { id: 1, name: 'Sarah Johnson', avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=137fec&color=fff', lastMessage: 'Thanks! The designs look great', time: '5m ago', unread: 2, online: true },
    { id: 2, name: 'Mike Chen', avatar: 'https://ui-avatars.com/api/?name=Mike+Chen&background=10b981&color=fff', lastMessage: 'Can we schedule a call?', time: '1h ago', unread: 0, online: false },
    { id: 3, name: 'Emily Davis', avatar: 'https://ui-avatars.com/api/?name=Emily+Davis&background=f59e0b&color=fff', lastMessage: 'Perfect! Let\'s proceed', time: '2h ago', unread: 1, online: true },
  ];

  const messages = [
    { id: 1, sender: 'them', text: 'Hi! I loved your proposal for the website redesign project.', time: '10:30 AM' },
    { id: 2, sender: 'me', text: 'Thank you! I\'m excited to work on this project with you.', time: '10:32 AM' },
    { id: 3, sender: 'them', text: 'Can you share some examples of your previous work?', time: '10:35 AM' },
    { id: 4, sender: 'me', text: 'Of course! Here\'s my portfolio link: portfolio.com', time: '10:37 AM' },
    { id: 5, sender: 'them', text: 'Thanks! The designs look great', time: '10:40 AM' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f7f8] dark:bg-bg-dark">
      <FreelancerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <FreelancerNavbar onMenuClick={() => setSidebarOpen(true)} />
        
        <div className="flex-1 flex overflow-hidden">
          {/* Conversations List */}
          <div className="w-full md:w-80 border-r border-[#e7edf3] dark:border-slate-800 bg-white dark:bg-slate-900 overflow-y-auto">
            <div className="p-4 border-b border-[#e7edf3] dark:border-slate-800">
              <h2 className="text-xl font-bold text-[#0d141b] dark:text-white mb-4">Messages</h2>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4c739a]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
                <input
                  className="w-full pl-10 pr-4 py-2 bg-[#f0f2f5] dark:bg-slate-800 border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Search conversations..."
                />
              </div>
            </div>

            <div className="divide-y divide-[#e7edf3] dark:divide-slate-800">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedChat(conv.id)}
                  className={`p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                    selectedChat === conv.id ? 'bg-primary/5 dark:bg-primary/10' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <img src={conv.avatar} alt={conv.name} className="w-12 h-12 rounded-full" />
                      {conv.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-[#0d141b] dark:text-white truncate">{conv.name}</h3>
                        <span className="text-xs text-[#4c739a] dark:text-slate-400">{conv.time}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-[#4c739a] dark:text-slate-400 truncate">{conv.lastMessage}</p>
                        {conv.unread > 0 && (
                          <span className="ml-2 px-2 py-0.5 bg-primary text-white text-xs rounded-full">{conv.unread}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
            {/* Chat Header */}
            <div className="p-4 border-b border-[#e7edf3] dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={conversations.find(c => c.id === selectedChat)?.avatar}
                  alt="User"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-[#0d141b] dark:text-white">
                    {conversations.find(c => c.id === selectedChat)?.name}
                  </h3>
                  <p className="text-xs text-[#4c739a] dark:text-slate-400">
                    {conversations.find(c => c.id === selectedChat)?.online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                  <svg className="w-5 h-5 text-[#4c739a]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] ${msg.sender === 'me' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-[#0d141b] dark:text-white'} rounded-2xl px-4 py-2`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-white/70' : 'text-[#4c739a] dark:text-slate-400'}`}>{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-[#e7edf3] dark:border-slate-800">
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                  <svg className="w-6 h-6 text-[#4c739a]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/>
                  </svg>
                </button>
                <input
                  className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Type a message..."
                />
                <button className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}