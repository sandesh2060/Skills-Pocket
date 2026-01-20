//==========================================================
// FILE: frontend/admin/src/pages/Settings.jsx
//==========================================================
import { useState, useEffect } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import toast from 'react-hot-toast';
import {
  Settings as SettingsIcon,
  User,
  Lock,
  DollarSign,
  Globe,
  Bell,
  Shield,
  Eye,
  EyeOff,
  Save,
  Loader2,
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:5001/api/admin';

const Settings = () => {
  const { token, adminData } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Profile State
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Platform Settings State
  const [platformSettings, setPlatformSettings] = useState({
    platformCommissionRate: 10,
    minimumWithdrawalAmount: 50,
    currency: "USD",
    maintenanceMode: {
      enabled: false,
      message: "",
    },
    userRegistration: {
      enabled: true,
      requireEmailVerification: true,
    },
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    email: {
      disputes: true,
      newUsers: true,
      supportTickets: true,
      paymentIssues: true,
    },
    adminEmail: "admin@skillspocket.com",
  });

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    lockoutDuration: 120,
  });

  // Fetch all settings on mount
  useEffect(() => {
    fetchAllSettings();
  }, []);

  const fetchAllSettings = async () => {
    try {
      setLoading(true);

      // Fetch profile
      const profileRes = await fetch(`${API_BASE_URL}/settings/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const profileData = await profileRes.json();

      if (profileData.success) {
        setProfile({
          firstName: profileData.data.firstName || "",
          lastName: profileData.data.lastName || "",
          email: profileData.data.email || "",
        });
      }

      // Fetch platform settings
      const platformRes = await fetch(`${API_BASE_URL}/settings/platform`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const platformData = await platformRes.json();

      if (platformData.success) {
        setPlatformSettings(platformData.data);
      }

      // Fetch notification settings
      const notifRes = await fetch(`${API_BASE_URL}/settings/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const notifData = await notifRes.json();

      if (notifData.success) {
        setNotificationSettings(notifData.data);
      }

      // Fetch security settings
      const securityRes = await fetch(`${API_BASE_URL}/settings/security`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const securityData = await securityRes.json();

      if (securityData.success) {
        setSecuritySettings(securityData.data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  // Update Profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`${API_BASE_URL}/settings/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Profile updated successfully");
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`${API_BASE_URL}/settings/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwordData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Password changed successfully");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(data.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  // Update Platform Settings
  const handleUpdatePlatformSettings = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`${API_BASE_URL}/settings/platform`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(platformSettings),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Platform settings updated successfully");
      } else {
        toast.error(data.message || "Failed to update settings");
      }
    } catch (error) {
      console.error("Error updating platform settings:", error);
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  // Update Notification Settings
  const handleUpdateNotifications = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`${API_BASE_URL}/settings/notifications`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(notificationSettings),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Notification settings updated successfully");
      } else {
        toast.error(data.message || "Failed to update settings");
      }
    } catch (error) {
      console.error("Error updating notifications:", error);
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  // Update Security Settings
  const handleUpdateSecurity = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`${API_BASE_URL}/settings/security`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(securitySettings),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Security settings updated successfully");
      } else {
        toast.error(data.message || "Failed to update settings");
      }
    } catch (error) {
      console.error("Error updating security settings:", error);
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "profile", name: "Profile", icon: User },
    { id: "security", name: "Security", icon: Lock },
    { id: "platform", name: "Platform", icon: Globe },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "advanced", name: "Advanced", icon: Shield },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <SettingsIcon className="w-8 h-8 text-blue-500" />
          <h1 className="text-3xl font-bold text-white">Settings</h1>
        </div>
        <p className="text-slate-400">
          Manage your account and platform settings
        </p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">
                  Profile Settings
                </h2>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={profile.firstName}
                        onChange={(e) =>
                          setProfile({ ...profile, firstName: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={profile.lastName}
                        onChange={(e) =>
                          setProfile({ ...profile, lastName: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">
                  Change Password
                </h2>
                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            current: !showPasswords.current,
                          })
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showPasswords.current ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            new: !showPasswords.new,
                          })
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showPasswords.new ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            confirm: !showPasswords.confirm,
                          })
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                    {saving ? "Changing..." : "Change Password"}
                  </button>
                </form>
              </div>
            )}

            {/* Platform Tab */}
            {activeTab === "platform" && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">
                  Platform Settings
                </h2>
                <form
                  onSubmit={handleUpdatePlatformSettings}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Commission Rate (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={platformSettings.platformCommissionRate}
                        onChange={(e) =>
                          setPlatformSettings({
                            ...platformSettings,
                            platformCommissionRate: Number(e.target.value),
                          })
                        }
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Minimum Withdrawal Amount
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={platformSettings.minimumWithdrawalAmount}
                        onChange={(e) =>
                          setPlatformSettings({
                            ...platformSettings,
                            minimumWithdrawalAmount: Number(e.target.value),
                          })
                        }
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Currency
                    </label>
                    <select
                      value={platformSettings.currency}
                      onChange={(e) =>
                        setPlatformSettings({
                          ...platformSettings,
                          currency: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="NPR">NPR - Nepalese Rupee</option>
                      <option value="INR">INR - Indian Rupee</option>
                    </select>
                  </div>

                  <div className="border-t border-slate-700 pt-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Feature Toggles
                    </h3>

                    <div className="space-y-4">
                      <label className="flex items-center justify-between p-4 bg-slate-700 rounded-lg cursor-pointer">
                        <div>
                          <div className="font-medium text-white">
                            Maintenance Mode
                          </div>
                          <div className="text-sm text-slate-400">
                            Disable access to the platform
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={
                            platformSettings.maintenanceMode?.enabled || false
                          }
                          onChange={(e) =>
                            setPlatformSettings({
                              ...platformSettings,
                              maintenanceMode: {
                                ...platformSettings.maintenanceMode,
                                enabled: e.target.checked,
                              },
                            })
                          }
                          className="w-5 h-5 text-blue-600 bg-slate-600 border-slate-500 rounded focus:ring-blue-500"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 bg-slate-700 rounded-lg cursor-pointer">
                        <div>
                          <div className="font-medium text-white">
                            User Registration
                          </div>
                          <div className="text-sm text-slate-400">
                            Allow new user sign-ups
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={
                            platformSettings.userRegistration?.enabled || false
                          }
                          onChange={(e) =>
                            setPlatformSettings({
                              ...platformSettings,
                              userRegistration: {
                                ...platformSettings.userRegistration,
                                enabled: e.target.checked,
                              },
                            })
                          }
                          className="w-5 h-5 text-blue-600 bg-slate-600 border-slate-500 rounded focus:ring-blue-500"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 bg-slate-700 rounded-lg cursor-pointer">
                        <div>
                          <div className="font-medium text-white">
                            Email Verification
                          </div>
                          <div className="text-sm text-slate-400">
                            Require email verification for new users
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={
                            platformSettings.userRegistration
                              ?.requireEmailVerification || false
                          }
                          onChange={(e) =>
                            setPlatformSettings({
                              ...platformSettings,
                              userRegistration: {
                                ...platformSettings.userRegistration,
                                requireEmailVerification: e.target.checked,
                              },
                            })
                          }
                          className="w-5 h-5 text-blue-600 bg-slate-600 border-slate-500 rounded focus:ring-blue-500"
                        />
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">
                  Notification Settings
                </h2>
                <form
                  onSubmit={handleUpdateNotifications}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Admin Email
                    </label>
                    <input
                      type="email"
                      value={notificationSettings.adminEmail}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          adminEmail: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="border-t border-slate-700 pt-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Email Notifications
                    </h3>

                    <div className="space-y-4">
                      <label className="flex items-center justify-between p-4 bg-slate-700 rounded-lg cursor-pointer">
                        <div>
                          <div className="font-medium text-white">
                            Dispute Notifications
                          </div>
                          <div className="text-sm text-slate-400">
                            Get notified about new disputes
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={
                            notificationSettings.email?.disputes || false
                          }
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              email: {
                                ...notificationSettings.email,
                                disputes: e.target.checked,
                              },
                            })
                          }
                          className="w-5 h-5 text-blue-600 bg-slate-600 border-slate-500 rounded focus:ring-blue-500"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 bg-slate-700 rounded-lg cursor-pointer">
                        <div>
                          <div className="font-medium text-white">
                            New User Registrations
                          </div>
                          <div className="text-sm text-slate-400">
                            Get notified when users sign up
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={
                            notificationSettings.email?.newUsers || false
                          }
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              email: {
                                ...notificationSettings.email,
                                newUsers: e.target.checked,
                              },
                            })
                          }
                          className="w-5 h-5 text-blue-600 bg-slate-600 border-slate-500 rounded focus:ring-blue-500"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 bg-slate-700 rounded-lg cursor-pointer">
                        <div>
                          <div className="font-medium text-white">
                            Support Tickets
                          </div>
                          <div className="text-sm text-slate-400">
                            Get notified about new support tickets
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={
                            notificationSettings.email?.supportTickets || false
                          }
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              email: {
                                ...notificationSettings.email,
                                supportTickets: e.target.checked,
                              },
                            })
                          }
                          className="w-5 h-5 text-blue-600 bg-slate-600 border-slate-500 rounded focus:ring-blue-500"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 bg-slate-700 rounded-lg cursor-pointer">
                        <div>
                          <div className="font-medium text-white">
                            Payment Issues
                          </div>
                          <div className="text-sm text-slate-400">
                            Get notified about payment problems
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={
                            notificationSettings.email?.paymentIssues || false
                          }
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              email: {
                                ...notificationSettings.email,
                                paymentIssues: e.target.checked,
                              },
                            })
                          }
                          className="w-5 h-5 text-blue-600 bg-slate-600 border-slate-500 rounded focus:ring-blue-500"
                        />
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              </div>
            )}

            {/* Advanced Tab */}
            {activeTab === "advanced" && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">
                  Security Settings
                </h2>
                <form onSubmit={handleUpdateSecurity} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Session Timeout (minutes)
                      </label>
                      <input
                        type="number"
                        min="15"
                        max="480"
                        value={securitySettings.sessionTimeout}
                        onChange={(e) =>
                          setSecuritySettings({
                            ...securitySettings,
                            sessionTimeout: Number(e.target.value),
                          })
                        }
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-slate-400 mt-1">
                        15-480 minutes
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Max Login Attempts
                      </label>
                      <input
                        type="number"
                        min="3"
                        max="10"
                        value={securitySettings.maxLoginAttempts}
                        onChange={(e) =>
                          setSecuritySettings({
                            ...securitySettings,
                            maxLoginAttempts: Number(e.target.value),
                          })
                        }
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-slate-400 mt-1">
                        3-10 attempts
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Lockout Duration (minutes)
                    </label>
                    <input
                      type="number"
                      min="15"
                      max="1440"
                      value={securitySettings.lockoutDuration}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          lockoutDuration: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      15-1440 minutes (1 day max)
                    </p>
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                    <div className="flex gap-3">
                      <Shield className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-amber-500 font-medium mb-1">
                          Security Notice
                        </h4>
                        <p className="text-sm text-slate-300">
                          Changing these settings will affect all admin users.
                          Make sure to notify your team about any security
                          policy changes.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
