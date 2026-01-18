// ============================================
// FILE: frontend/user/src/components/wallet/WithdrawalModal.jsx
// Withdrawal Request Modal Component
// ============================================
import { useState } from 'react';

export default function WithdrawalModal({ isOpen, onClose, onSubmit, availableBalance }) {
  const [formData, setFormData] = useState({
    amount: '',
    method: 'bank',
    accountDetails: {
      accountName: '',
      accountNumber: '',
      bankName: '',
      routingNumber: '',
    },
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('account')) {
      setFormData(prev => ({
        ...prev,
        accountDetails: {
          ...prev.accountDetails,
          [name]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    // Clear error for this field
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    } else if (parseFloat(formData.amount) > availableBalance) {
      newErrors.amount = 'Amount exceeds available balance';
    }

    if (formData.method === 'bank') {
      if (!formData.accountDetails.accountName) {
        newErrors.accountName = 'Account name is required';
      }
      if (!formData.accountDetails.accountNumber) {
        newErrors.accountNumber = 'Account number is required';
      }
      if (!formData.accountDetails.bankName) {
        newErrors.bankName = 'Bank name is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit({
        amount: parseFloat(formData.amount),
        method: formData.method,
        description: `Withdrawal to ${formData.method === 'bank' ? 'Bank Account' : 'PayPal'}`,
        accountDetails: formData.accountDetails,
      });
      // Reset form
      setFormData({
        amount: '',
        method: 'bank',
        accountDetails: {
          accountName: '',
          accountNumber: '',
          bankName: '',
          routingNumber: '',
        },
      });
    } catch (error) {
      console.error('Withdrawal error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-[#e7edf3] dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#0d141b] dark:text-white">
            Withdraw Funds
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-[#4c739a] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Available Balance */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
            <p className="text-sm text-[#4c739a] dark:text-slate-400 mb-1">Available Balance</p>
            <p className="text-3xl font-bold text-[#0d141b] dark:text-white">
              ${availableBalance?.toLocaleString() || '0'}
            </p>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-[#0d141b] dark:text-white mb-2">
              Withdrawal Amount *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4c739a] dark:text-slate-400 font-semibold">
                $
              </span>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                max={availableBalance}
                className={`w-full pl-8 pr-4 py-3 border rounded-lg bg-white dark:bg-slate-800 text-[#0d141b] dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.amount ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                }`}
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
            )}
          </div>

          {/* Withdrawal Method */}
          <div>
            <label className="block text-sm font-medium text-[#0d141b] dark:text-white mb-2">
              Withdrawal Method *
            </label>
            <select
              name="method"
              value={formData.method}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-[#0d141b] dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="bank">Bank Transfer</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>

          {/* Bank Account Details */}
          {formData.method === 'bank' && (
            <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <h3 className="font-semibold text-[#0d141b] dark:text-white">
                Bank Account Details
              </h3>

              <div>
                <label className="block text-sm font-medium text-[#0d141b] dark:text-white mb-2">
                  Account Name *
                </label>
                <input
                  type="text"
                  name="accountName"
                  value={formData.accountDetails.accountName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-900 text-[#0d141b] dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.accountName ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                  }`}
                />
                {errors.accountName && (
                  <p className="mt-1 text-sm text-red-600">{errors.accountName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0d141b] dark:text-white mb-2">
                  Account Number *
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountDetails.accountNumber}
                  onChange={handleChange}
                  placeholder="1234567890"
                  className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-900 text-[#0d141b] dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.accountNumber ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                  }`}
                />
                {errors.accountNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.accountNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0d141b] dark:text-white mb-2">
                  Bank Name *
                </label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.accountDetails.bankName}
                  onChange={handleChange}
                  placeholder="Chase Bank"
                  className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-900 text-[#0d141b] dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.bankName ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                  }`}
                />
                {errors.bankName && (
                  <p className="mt-1 text-sm text-red-600">{errors.bankName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0d141b] dark:text-white mb-2">
                  Routing Number (Optional)
                </label>
                <input
                  type="text"
                  name="routingNumber"
                  value={formData.accountDetails.routingNumber}
                  onChange={handleChange}
                  placeholder="123456789"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-[#0d141b] dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Processing Note */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
                  Processing Time
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-400">
                  Withdrawals are typically processed within 3-5 business days.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-slate-300 dark:border-slate-700 rounded-lg font-semibold text-[#0d141b] dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.amount || parseFloat(formData.amount) <= 0}
              className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Processing...' : 'Request Withdrawal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}