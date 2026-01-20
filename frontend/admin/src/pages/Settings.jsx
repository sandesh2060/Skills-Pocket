import { useState, useEffect } from 'react';
import { User, Lock, Bell, Shield, DollarSign, Cog, Save, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:5001/api/admin';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Profile State
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    profilePicture: '',
  });

  // Password State
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Platform Settings State
  const [platformSettings, setPlatformSettings] = useState({
    platformCommissionRate: 10,
    minimumWithdrawalAmount: 50,
    currency: 'USD',
    maintenanceMode: { enabled: false, message: '' },
    userRegistration: { enabled: true, requireEmailVerification: true },
  });

  // Notification Settings State
  const [notifications, setNotifications] = useState({
    email: {
      disputes: true,
      newUsers: true,
      supportTickets: true,
      paymentIssues: true,
      largeTransactions: true,
    },
    adminEmail: 'admin@skillspocket.com',
  });

  // Security Settings State
  const [security, setSecurity] = useState({
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    lockoutDuration: 120,
    require2FA: false,
  });

  useEffect(() => {
    loadSettings();
  }, [activeTab]);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      
      if (activeTab === 'profile') {
        const response = await fetch(`${API_BASE_URL}/settings/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) setProfile(data.data);
      } else if (activeTab === 'platform') {
        const response = await fetch(`${API_BASE_URL}/settings/platform`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) setPlatformSettings(data.data);
      } else if (activeTab === 'notifications') {
        const response = await fetch(`${API_BASE_URL}/settings/notifications`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) setNotifications(data.data);
      } else if (activeTab === 'security') {
        const response = await fetch(`${API_BASE_URL}/settings/security`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) setSecurity(data.data);
      }
    } catch (error) {
      showMessage('error', 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/settings/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });
      const data = await response.json();
      
      if (data.success) {
        showMessage('success', 'Profile updated successfully');
      } else {
        showMessage('error', data.message || 'Failed to update profile');
      }
    } catch (error) {
      showMessage('error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      showMessage('error', 'Passwords do not match');
      return;
    }
    
    setSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/settings/password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwords),
      });
      const data = await response.json();
      
      if (data.success) {
        showMessage('success', 'Password changed successfully');
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        showMessage('error', data.message || 'Failed to change password');
      }
    } catch (error) {
      showMessage('error', 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePlatformSettings = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/settings/platform`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(platformSettings),
      });
      const data = await response.json();
      
      if (data.success) {
        showMessage('success', 'Platform settings updated successfully');
      } else {
        showMessage('error', data.message || 'Failed to update settings');
      }
    } catch (error) {
      showMessage('error', 'Failed to update platform settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/settings/notifications`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notifications),
      });
      const data = await response.json();
      
      if (data.success) {
        showMessage('success', 'Notification settings updated successfully');
      } else {
        showMessage('error', data.message || 'Failed to update settings');
      }
    } catch (error) {
      showMessage('error', 'Failed to update notification settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSecurity = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/settings/security`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(security),
      });
      const data = await response.json();
      
      if (data.success) {
        showMessage('success', 'Security settings updated successfully');
      } else {
        showMessage('error', data.message || 'Failed to update settings');
      }
    } catch (error) {
      showMessage('error', 'Failed to update security settings');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'password', label: 'Password', icon: Lock },
    { id: 'platform', label: 'Platform', icon: Cog },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your account and platform configuration</p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success' 
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="text-green-600" size={20} />
            ) : (
              <AlertCircle className="text-red-600" size={20} />
            )}
            <span className={message.type === 'success' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}>
              {message.text}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors mb-1 ${
                      activeTab === tab.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-semibold">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                  ))}
                </div>
              ) : (
                <>
                  {/* Profile Tab */}
                  {activeTab === 'profile' && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Profile Information</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            First Name
                          </label>
                          <input
                            type="text"
                            value={profile.firstName}
                            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Last Name
                          </label>
                          <input
                            type="text"
                            value={profile.lastName}
                            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>

                      <button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save size={18} />
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  )}

                  {/* Password Tab */}
                  {activeTab === 'password' && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Change Password</h2>
                      
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={passwords.currentPassword}
                            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                            className="w-full px-4 py-2 pr-12 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                          >
                            {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={passwords.newPassword}
                            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                            className="w-full px-4 py-2 pr-12 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                          >
                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={passwords.confirmPassword}
                          onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>

                      <button
                        onClick={handleChangePassword}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Lock size={18} />
                        {saving ? 'Updating...' : 'Change Password'}
                      </button>
                    </div>
                  )}

                  {/* Platform Settings Tab */}
                  {activeTab === 'platform' && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Platform Configuration</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Commission Rate (%)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="50"
                            value={platformSettings.platformCommissionRate}
                            onChange={(e) => setPlatformSettings({ ...platformSettings, platformCommissionRate: Number(e.target.value) })}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Minimum Withdrawal ($)
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={platformSettings.minimumWithdrawalAmount}
                            onChange={(e) => setPlatformSettings({ ...platformSettings, minimumWithdrawalAmount: Number(e.target.value) })}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Currency
                        </label>
                        <select
                          value={platformSettings.currency}
                          onChange={(e) => setPlatformSettings({ ...platformSettings, currency: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        >
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="GBP">GBP</option>
                          <option value="NPR">NPR</option>
                          <option value="INR">INR</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="maintenance"
                          checked={platformSettings.maintenanceMode?.enabled}
                          onChange={(e) => setPlatformSettings({
                            ...platformSettings,
                            maintenanceMode: { ...platformSettings.maintenanceMode, enabled: e.target.checked }
                          })}
                          className="w-5 h-5 text-blue-600 rounded"
                        />
                        <label htmlFor="maintenance" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Enable Maintenance Mode
                        </label>
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="registration"
                          checked={platformSettings.userRegistration?.enabled}
                          onChange={(e) => setPlatformSettings({
                            ...platformSettings,
                            userRegistration: { ...platformSettings.userRegistration, enabled: e.target.checked }
                          })}
                          className="w-5 h-5 text-blue-600 rounded"
                        />
                        <label htmlFor="registration" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Allow User Registration
                        </label>
                      </div>

                      <button
                        onClick={handleSavePlatformSettings}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save size={18} />
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  )}

                  {/* Notifications Tab */}
                  {activeTab === 'notifications' && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Notification Preferences</h2>
                      
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Admin Email
                        </label>
                        <input
                          type="email"
                          value={notifications.adminEmail}
                          onChange={(e) => setNotifications({ ...notifications, adminEmail: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="space-y-3">
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Notifications</p>
                        
                        {Object.entries(notifications.email || {}).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              id={key}
                              checked={value}
                              onChange={(e) => setNotifications({
                                ...notifications,
                                email: { ...notifications.email, [key]: e.target.checked }
                              })}
                              className="w-5 h-5 text-blue-600 rounded"
                            />
                            <label htmlFor={key} className="text-sm text-slate-700 dark:text-slate-300 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </label>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={handleSaveNotifications}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save size={18} />
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  )}

                  {/* Security Tab */}
                  {activeTab === 'security' && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Security Settings</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Session Timeout (minutes)
                          </label>
                          <input
                            type="number"
                            min="15"
                            max="480"
                            value={security.sessionTimeout}
                            onChange={(e) => setSecurity({ ...security, sessionTimeout: Number(e.target.value) })}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Max Login Attempts
                          </label>
                          <input
                            type="number"
                            min="3"
                            max="10"
                            value={security.maxLoginAttempts}
                            onChange={(e) => setSecurity({ ...security, maxLoginAttempts: Number(e.target.value) })}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Lockout Duration (minutes)
                        </label>
                        <input
                          type="number"
                          min="15"
                          max="1440"
                          value={security.lockoutDuration}
                          onChange={(e) => setSecurity({ ...security, lockoutDuration: Number(e.target.value) })}
                          className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="2fa"
                          checked={security.require2FA}
                          onChange={(e) => setSecurity({ ...security, require2FA: e.target.checked })}
                          className="w-5 h-5 text-blue-600 rounded"
                        />
                        <label htmlFor="2fa" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Require Two-Factor Authentication
                        </label>
                      </div>

                      <button
                        onClick={handleSaveSecurity}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save size={18} />
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;