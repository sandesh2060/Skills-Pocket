// ============================================
// FILE: frontend/user/src/pages/ClientInbox.jsx
// ============================================
import { useState } from 'react';
import ClientSidebar from "../components/dashboard/client/ClientSidebar";
import ClientNavbar from "../components/dashboard/client/ClientNavbar";

export default function ClientInbox() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] dark:bg-[#0b1219]">
      <ClientSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <ClientNavbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-3xl font-bold mb-6">Inbox</h1>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border">
            <p>Inbox page content coming soon...</p>
          </div>
        </main>
      </div>
    </div>
  );
}
