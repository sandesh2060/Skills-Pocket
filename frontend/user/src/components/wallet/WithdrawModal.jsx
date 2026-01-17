
// ============================================
// FILE: frontend/user/src/components/wallet/WithdrawModal.jsx
// ============================================
import React, { useState } from 'react';
import { formatCurrency } from '../../utils/helpers';

export default function WithdrawModal({ isOpen, onClose, availableBalance = 0, onWithdraw }) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bank_transfer');
  const [bankDetails, setBankDetails] = useState({
    accountName: '',
    accountNumber: '',
    bankName: '',
    routingNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const minWithdrawal = 10;
  const platformFee = 2.5; // 2.5%

  const calculateFee = () => {
    const withdrawAmount = parseFloat(amount) || 0;
    return (withdrawAmount * platformFee) / 100;
  };

  const calculateNetAmount = () => {
    const withdrawAmount = parseFloat(amount) || 0;
    return withdrawAmount - calculateFee();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const withdrawAmount = parseFloat(amount);

    // Validation
    if (!withdrawAmount || withdrawAmount < minWithdrawal) {
      setError(`Minimum withdrawal amount is ${formatCurrency(minWithdrawal)}`);
      return;
    }

    if (withdrawAmount > availableBalance) {
      setError('Insufficient balance');
      return;
    }

    if (method === 'bank_transfer') {
      if (!bankDetails.accountName || !bankDetails.accountNumber || !bankDetails.bankName) {
        setError('Please fill in all bank details');
        return;
      }
    }

    setLoading(true);

    try {
      await onWithdraw({
        amount: withdrawAmount,
        method,
        bankDetails: method === 'bank_transfer' ? bankDetails : null,
      });

      // Reset form
      setAmount('');
      setBankDetails({
        accountName: '',
        accountNumber: '',
        bankName: '',
        routingNumber: '',
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Withdrawal failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-lg w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Withdraw Funds
              </h3>
              <p className="text-sm text-[#4c739a] dark:text-slate-400 mt-1">
                Available: {formatCurrency(availableBalance)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}

            {/* Amount */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Withdrawal Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4c739a] dark:text-slate-400">
                  $
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min={minWithdrawal}
                  max={availableBalance}
                  required
                  className="w-full pl-8 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-lg font-semibold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none"
                />
              </div>
              <p className="text-xs text-[#4c739a] dark:text-slate-400 mt-2">
                Minimum withdrawal: {formatCurrency(minWithdrawal)}
              </p>
            </div>

            {/* Fee Breakdown */}
            {amount && parseFloat(amount) >= minWithdrawal && (
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#4c739a] dark:text-slate-400">Withdrawal Amount:</span>
                  <span className="font-semibold text-[#0d141b] dark:text-white">{formatCurrency(parseFloat(amount))}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#4c739a] dark:text-slate-400">Platform Fee ({platformFee}%):</span>
                  <span className="font-semibold text-red-600">-{formatCurrency(calculateFee())}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between">
                  <span className="font-bold text-[#0d141b] dark:text-white">You'll Receive:</span>
                  <span className="font-bold text-green-600 text-lg">{formatCurrency(calculateNetAmount())}</span>
                </div>
              </div>
            )}

            {/* Withdrawal Method */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                Withdrawal Method
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <input
                    type="radio"
                    name="method"
                    value="bank_transfer"
                    checked={method === 'bank_transfer'}
                    onChange={(e) => setMethod(e.target.value)}
                    className="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-[#0d141b] dark:text-white">Bank Transfer</p>
                    <p className="text-xs text-[#4c739a] dark:text-slate-400">2-3 business days</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <input
                    type="radio"
                    name="method"
                    value="paypal"
                    checked={method === 'paypal'}
                    onChange={(e) => setMethod(e.target.value)}
                    className="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-[#0d141b] dark:text-white">PayPal</p>
                    <p className="text-xs text-[#4c739a] dark:text-slate-400">Instant</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Bank Details (if bank transfer selected) */}
            {method === 'bank_transfer' && (
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    value={bankDetails.accountName}
                    onChange={(e) => setBankDetails({...bankDetails, accountName: e.target.value})}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={bankDetails.accountNumber}
                    onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={bankDetails.bankName}
                    onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Routing Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={bankDetails.routingNumber}
                    onChange={(e) => setBankDetails({...bankDetails, routingNumber: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none"
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !amount || parseFloat(amount) < minWithdrawal}
                className="flex-1 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Withdraw'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}