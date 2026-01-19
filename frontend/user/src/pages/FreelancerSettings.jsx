// ============================================
// FILE: frontend/user/src/pages/FreelancerSettings.jsx
// Updated with Appearance Settings Tab
// ============================================
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import FreelancerSidebar from '../components/dashboard/freelancer/FreelancerSidebar';
import FreelancerNavbar from '../components/dashboard/freelancer/FreelancerNavbar';
import { updateProfile, updateNotificationPreferences, uploadProfilePicture, deactivateAccount } from '../api/profileApi';
import { changePassword } from '../api/authApi';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { toast } from 'react-hot-toast';

export default function FreelancerSettings() {
  const { user, updateUser, logout } = useAuth();
  const { theme, setLightTheme, setDarkTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    jobAlerts: true,
    proposalUpdates: true,
    messageNotifications: true,
    marketingEmails: false,
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        location: user.location || '',
      });
      setNotifications(user.notificationPreferences || notifications);
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await updateProfile(profileData);
      if (response.success) {
        updateUser(response.data);
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await changePassword(passwordData.currentPassword, passwordData.newPassword);
      if (response.success) {
        toast.success('Password changed successfully');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await updateNotificationPreferences(notifications);
      if (response.success) {
        updateUser(response.data);
        toast.success('Notification preferences updated');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploadingImage(true);

    try {
      const response = await uploadProfilePicture(file);
      if (response.success) {
        updateUser({ profilePicture: response.data.profilePicture });
        toast.success('Profile picture updated');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeactivateAccount = async () => {
    if (!window.confirm('Are you sure you want to deactivate your account? This action cannot be undone.')) {
      return;
    }

    setLoading(true);

    try {
      const response = await deactivateAccount();
      if (response.success) {
        toast.success('Account deactivated successfully');
        setTimeout(() => logout(), 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to deactivate account');
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = (newTheme) => {
    if (newTheme === 'light') {
      setLightTheme();
    } else {
      setDarkTheme();
    }
    toast.success(`Theme changed to ${newTheme} mode`);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'account', label: 'Account', icon: '⚙️' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-bg-dark">
      <FreelancerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <FreelancerNavbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Back Button & Header */}
            <div className="max-w-5xl mx-auto mb-6">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-4"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Back</span>
              </button>

              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Settings</h1>
                <p className="text-slate-600 dark:text-slate-400">Manage your account settings and preferences</p>
              </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                {/* Tabs */}
                <div className="border-b border-slate-200 dark:border-slate-700">
                  <div className="flex space-x-1 p-2 overflow-x-auto">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                          activeTab === tab.id
                            ? 'bg-primary text-white'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        <span>{tab.icon}</span>
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === 'profile' && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <div 
                            className="w-24 h-24 rounded-full bg-cover bg-center ring-4 ring-primary/20"
                            style={{
                              backgroundImage: user?.profilePicture 
                                ? `url("${user.profilePicture}")` 
                                : `url("https://ui-avatars.com/api/?name=${user?.firstName || 'User'}&background=137fec&color=fff&size=200")`
                            }}
                          />
                          <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary-dark transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageUpload}
                              disabled={uploadingImage}
                            />
                          </label>
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">Profile Picture</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">JPG, PNG or GIF. Max 5MB</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="First Name"
                          value={profileData.firstName}
                          onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                          required
                          fullWidth
                        />
                        <Input
                          label="Last Name"
                          value={profileData.lastName}
                          onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                          required
                          fullWidth
                        />
                      </div>

                      <Input
                        label="Email"
                        type="email"
                        value={profileData.email}
                        disabled
                        fullWidth
                        helperText="Email cannot be changed"
                      />

                      <Input
                        label="Phone"
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        fullWidth
                      />

                      <Input
                        label="Location"
                        value={profileData.location}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        placeholder="City, Country"
                        fullWidth
                      />

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Bio
                        </label>
                        <textarea
                          value={profileData.bio}
                          onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                          maxLength={500}
                          rows={4}
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary"
                          placeholder="Tell clients about yourself..."
                        />
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{profileData.bio.length}/500 characters</p>
                      </div>

                      <Button onClick={handleProfileUpdate} loading={loading} fullWidth>
                        Save Changes
                      </Button>
                    </div>
                  )}

                  {activeTab === 'appearance' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Theme</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                          Choose how SkillsPocket looks to you. Select a single theme, or sync with your system.
                        </p>
                      </div>

                      {/* Theme Options */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Light Mode */}
                        <button
                          onClick={() => handleThemeChange('light')}
                          className={`relative group p-6 rounded-xl border-2 transition-all ${
                            theme === 'light'
                              ? 'border-primary bg-primary/5'
                              : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                                </svg>
                              </div>
                              <div className="text-left">
                                <h4 className="font-semibold text-slate-900 dark:text-white">Light</h4>
                                <p className="text-xs text-slate-600 dark:text-slate-400">Bright and clear</p>
                              </div>
                            </div>
                            {theme === 'light' && (
                              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </div>
                          
                          {/* Preview */}
                          <div className="bg-white rounded-lg border border-slate-200 p-3 space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded bg-slate-100"></div>
                              <div className="flex-1 h-2 bg-slate-200 rounded"></div>
                            </div>
                            <div className="h-2 bg-slate-100 rounded w-3/4"></div>
                            <div className="h-2 bg-slate-100 rounded w-1/2"></div>
                          </div>
                        </button>

                        {/* Dark Mode */}
                        <button
                          onClick={() => handleThemeChange('dark')}
                          className={`relative group p-6 rounded-xl border-2 transition-all ${
                            theme === 'dark'
                              ? 'border-primary bg-primary/5'
                              : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                                </svg>
                              </div>
                              <div className="text-left">
                                <h4 className="font-semibold text-slate-900 dark:text-white">Dark</h4>
                                <p className="text-xs text-slate-600 dark:text-slate-400">Easy on the eyes</p>
                              </div>
                            </div>
                            {theme === 'dark' && (
                              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </div>
                          
                          {/* Preview */}
                          <div className="bg-slate-900 rounded-lg border border-slate-700 p-3 space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded bg-slate-800"></div>
                              <div className="flex-1 h-2 bg-slate-700 rounded"></div>
                            </div>
                            <div className="h-2 bg-slate-800 rounded w-3/4"></div>
                            <div className="h-2 bg-slate-800 rounded w-1/2"></div>
                          </div>
                        </button>
                      </div>

                      {/* Additional Info */}
                      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="flex gap-3">
                          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm mb-1">Theme Preference</h4>
                            <p className="text-sm text-blue-800 dark:text-blue-300">
                              Your theme preference is saved locally and will be remembered across sessions.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Current Theme Status */}
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">Current Theme</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                              You are currently using {theme} mode
                            </p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            theme === 'light' 
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400'
                          }`}>
                            {theme === 'light' ? '☀️ Light' : '🌙 Dark'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'security' && (
                    <div className="space-y-6">
                      <Input
                        label="Current Password"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        required
                        fullWidth
                      />

                      <Input
                        label="New Password"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        required
                        fullWidth
                        helperText="Minimum 8 characters"
                      />

                      <Input
                        label="Confirm New Password"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        required
                        fullWidth
                      />

                      <Button onClick={handlePasswordChange} loading={loading} fullWidth>
                        Change Password
                      </Button>
                    </div>
                  )}

                  {activeTab === 'notifications' && (
                    <div className="space-y-6">
                      {Object.entries({
                        emailNotifications: 'Email Notifications',
                        jobAlerts: 'Job Alerts',
                        proposalUpdates: 'Proposal Updates',
                        messageNotifications: 'Message Notifications',
                        marketingEmails: 'Marketing Emails',
                      }).map(([key, label]) => (
                        <div key={key} className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700 last:border-0">
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{label}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Receive {label.toLowerCase()} notifications
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notifications[key]}
                              onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      ))}

                      <Button onClick={handleNotificationUpdate} loading={loading} fullWidth>
                        Save Preferences
                      </Button>
                    </div>
                  )}

                  {activeTab === 'account' && (
                    <div className="space-y-6">
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">Danger Zone</h3>
                        <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                          Once you deactivate your account, there is no going back. Please be certain.
                        </p>
                        <Button variant="danger" onClick={handleDeactivateAccount} loading={loading}>
                          Deactivate Account
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}