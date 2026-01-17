// ============================================
// FILE: frontend/user/src/pages/FreelancerWallet.jsx
// ============================================
import { useState } from 'react';
import FreelancerNavbar from '../components/dashboard/freelancer/FreelancerNavbar';
import FreelancerSidebar from '../components/dashboard/freelancer/FreelancerSidebar';

export default function FreelancerWallet() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const transactions = [
    { id: 1, type: 'credit', amount: 2500, description: 'Payment from TechCorp Inc.', date: 'Dec 15, 2024', status: 'completed' },
    { id: 2, type: 'credit', amount: 1800, description: 'Payment from StartupXYZ', date: 'Dec 10, 2024', status: 'completed' },
    { id: 3, type: 'debit', amount: 500, description: 'Withdrawal to Bank Account', date: 'Dec 8, 2024', status: 'completed' },
    { id: 4, type: 'credit', amount: 1200, description: 'Payment from GreenLeaf Co.', date: 'Dec 5, 2024', status: 'completed' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f7f8] dark:bg-bg-dark">
      <FreelancerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <FreelancerNavbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-[#0d141b] dark:text-white mb-2">Wallet</h1>
              <p className="text-[#4c739a] dark:text-slate-400">Manage your earnings and withdrawals</p>
            </div>

            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gradient-to-br from-primary to-blue-600 rounded-xl p-6 text-white">
                <p className="text-sm opacity-90 mb-2">Available Balance</p>
                <p className="text-4xl font-bold mb-4">$12,450</p>
                <button className="w-full bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg font-semibold transition-colors backdrop-blur-sm">
                  Withdraw Funds
                </button>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-[#e7edf3] dark:border-slate-800">
                <p className="text-sm text-[#4c739a] dark:text-slate-400 mb-2">Pending</p>
                <p className="text-3xl font-bold text-[#0d141b] dark:text-white mb-2">$3,200</p>
                <p className="text-xs text-[#4c739a] dark:text-slate-400">2 payments in escrow</p>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-[#e7edf3] dark:border-slate-800">
                <p className="text-sm text-[#4c739a] dark:text-slate-400 mb-2">Total Earned</p>
                <p className="text-3xl font-bold text-[#0d141b] dark:text-white mb-2">$45,890</p>
                <p className="text-xs text-green-600 dark:text-green-400">+12% this month</p>
              </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-[#e7edf3] dark:border-slate-800 overflow-hidden">
              <div className="p-6 border-b border-[#e7edf3] dark:border-slate-800">
                <h2 className="text-xl font-bold text-[#0d141b] dark:text-white">Transaction History</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#4c739a] dark:text-slate-400 uppercase">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#4c739a] dark:text-slate-400 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#4c739a] dark:text-slate-400 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-[#4c739a] dark:text-slate-400 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e7edf3] dark:divide-slate-800">
                    {transactions.map((txn) => (
                      <tr key={txn.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              txn.type === 'credit' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                            }`}>
                              <svg className={`w-5 h-5 ${
                                txn.type === 'credit' ? 'text-green-600' : 'text-red-600'
                              }`} viewBox="0 0 24 24" fill="currentColor">
                                <path d="M7 14l5-5 5 5z"/>
                              </svg>
                            </div>
                            <span className="font-medium text-[#0d141b] dark:text-white">{txn.description}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[#4c739a] dark:text-slate-400">{txn.date}</td>
                        <td className={`px-6 py-4 font-bold ${
                          txn.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {txn.type === 'credit' ? '+' : '-'}${txn.amount}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            {txn.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}