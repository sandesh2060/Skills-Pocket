// ============================================
// FILE: frontend/user/src/pages/ClientSettings.jsx
// FIXED VERSION - Appearance tab moved outside Profile form
// ============================================
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  User,
  Lock,
  Bell,
  Shield,
  Trash2,
  Save,
  Upload,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Twitter,
  Eye,
  EyeOff,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import ClientSidebar from "../components/dashboard/client/ClientSidebar";
import ClientNavbar from "../components/dashboard/client/ClientNavbar";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function ClientSettings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Profile State
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
    socialLinks: {
      linkedin: "",
      github: "",
      website: "",
      twitter: "",
    },
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

  // Notification Preferences
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    jobAlerts: true,
    proposalUpdates: true,
    messageNotifications: true,
    marketingEmails: false,
  });

  // Load user data on mount
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
        location: user.location || "",
        socialLinks: {
          linkedin: user.socialLinks?.linkedin || "",
          github: user.socialLinks?.github || "",
          website: user.socialLinks?.website || "",
          twitter: user.socialLinks?.twitter || "",
        },
      });
    }
  }, [user]);

  // Handle Profile Update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.put("/users/profile", profileData);

      if (response.data.success) {
        updateUser(response.data.data);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Handle Profile Picture Upload
  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("photo", file);

      const response = await api.post("/users/profile-picture", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        updateUser(response.data.data);
        toast.success("Profile picture updated successfully");
      }
    } catch (error) {
      toast.error(error.message || "Failed to upload profile picture");
    } finally {
      setUploading(false);
    }
  };

  // Handle Password Change
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await api.put("/auth/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.data.success) {
        toast.success("Password changed successfully");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  // Handle Account Deactivation
  const handleDeactivateAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate your account? This action can be reversed by contacting support."
    );

    if (!confirmed) return;

    setLoading(true);

    try {
      const response = await api.post("/users/deactivate");

      if (response.data.success) {
        toast.success("Account deactivated. You will be logged out.");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    } catch (error) {
      toast.error(error.message || "Failed to deactivate account");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "appearance", label: "Appearance", icon: theme === "dark" ? Moon : Sun },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] dark:bg-[#0b1219]">
      <ClientSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <ClientNavbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-6">
              Settings
            </h1>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Tabs Sidebar */}
              <div className="lg:w-64 flex-shrink-0">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          activeTab === tab.id
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1">
                {/* Profile Tab */}
                {activeTab === "profile" && (
                  <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                      Profile Information
                    </h2>

                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      {/* Profile Picture */}
                      <div className="flex items-center gap-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                        <div className="relative">
                          <div
                            className="w-24 h-24 rounded-full bg-cover bg-center border-4 border-slate-200 dark:border-slate-700"
                            style={{
                              backgroundImage: user?.profilePicture
                                ? `url(${user.profilePicture})`
                                : `url("https://ui-avatars.com/api/?name=${user?.firstName || "User"}&size=200&background=137fec&color=fff")`,
                            }}
                          ></div>
                          {uploading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                              <Loader2 className="w-6 h-6 text-white animate-spin" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                            Profile Picture
                          </h3>
                          <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                            <Upload className="w-4 h-4" />
                            <span>Upload New Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleProfilePictureUpload}
                              className="hidden"
                              disabled={uploading}
                            />
                          </label>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                            JPG, PNG or GIF. Max size 5MB.
                          </p>
                        </div>
                      </div>

                      {/* Name Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            First Name
                          </label>
                          <input
                            type="text"
                            value={profileData.firstName}
                            onChange={(e) =>
                              setProfileData({ ...profileData, firstName: e.target.value })
                            }
                            className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Last Name
                          </label>
                          <input
                            type="text"
                            value={profileData.lastName}
                            onChange={(e) =>
                              setProfileData({ ...profileData, lastName: e.target.value })
                            }
                            className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* Contact Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            <Mail className="w-4 h-4 inline mr-2" />
                            Email
                          </label>
                          <input
                            type="email"
                            value={profileData.email}
                            disabled
                            className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            <Phone className="w-4 h-4 inline mr-2" />
                            Phone
                          </label>
                          <input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) =>
                              setProfileData({ ...profileData, phone: e.target.value })
                            }
                            className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* Location */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          <MapPin className="w-4 h-4 inline mr-2" />
                          Location
                        </label>
                        <input
                          type="text"
                          value={profileData.location}
                          onChange={(e) =>
                            setProfileData({ ...profileData, location: e.target.value })
                          }
                          placeholder="City, Country"
                          className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {/* Bio */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Bio
                        </label>
                        <textarea
                          value={profileData.bio}
                          onChange={(e) =>
                            setProfileData({ ...profileData, bio: e.target.value })
                          }
                          rows={4}
                          maxLength={500}
                          placeholder="Tell us about yourself..."
                          className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {profileData.bio.length}/500 characters
                        </p>
                      </div>

                      {/* Social Links */}
                      <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                          Social Links
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              <Globe className="w-4 h-4 inline mr-2" />
                              Website
                            </label>
                            <input
                              type="url"
                              value={profileData.socialLinks.website}
                              onChange={(e) =>
                                setProfileData({
                                  ...profileData,
                                  socialLinks: { ...profileData.socialLinks, website: e.target.value },
                                })
                              }
                              placeholder="https://yourwebsite.com"
                              className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              <Linkedin className="w-4 h-4 inline mr-2" />
                              LinkedIn
                            </label>
                            <input
                              type="url"
                              value={profileData.socialLinks.linkedin}
                              onChange={(e) =>
                                setProfileData({
                                  ...profileData,
                                  socialLinks: { ...profileData.socialLinks, linkedin: e.target.value },
                                })
                              }
                              placeholder="https://linkedin.com/in/username"
                              className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              <Github className="w-4 h-4 inline mr-2" />
                              GitHub
                            </label>
                            <input
                              type="url"
                              value={profileData.socialLinks.github}
                              onChange={(e) =>
                                setProfileData({
                                  ...profileData,
                                  socialLinks: { ...profileData.socialLinks, github: e.target.value },
                                })
                              }
                              placeholder="https://github.com/username"
                              className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              <Twitter className="w-4 h-4 inline mr-2" />
                              Twitter
                            </label>
                            <input
                              type="url"
                              value={profileData.socialLinks.twitter}
                              onChange={(e) =>
                                setProfileData({
                                  ...profileData,
                                  socialLinks: { ...profileData.socialLinks, twitter: e.target.value },
                                })
                              }
                              placeholder="https://twitter.com/username"
                              className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Save Button */}
                      <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-5 h-5" />
                              <span>Save Changes</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Appearance Tab - NOW PROPERLY SEPARATED */}
                {activeTab === "appearance" && (
                  <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                      Appearance Settings
                    </h2>

                    <div className="space-y-6">
                      {/* Theme Selection */}
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                          Theme Preference
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                          Choose how SkillsPocket looks to you.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Light Theme Card */}
                          <button
                            type="button"
                            onClick={() => theme === "dark" && toggleTheme()}
                            className={`relative p-6 rounded-xl border-2 transition-all ${
                              theme === "light"
                                ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                                : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                            }`}
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                                <Sun className="w-6 h-6 text-white" />
                              </div>
                              <div className="text-left">
                                <h4 className="font-semibold text-slate-900 dark:text-white">
                                  Light Mode
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  Easy on the eyes during daytime
                                </p>
                              </div>
                            </div>

                            <div className="mt-4 p-3 bg-white rounded-lg border border-slate-200">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                              </div>
                              <div className="space-y-2">
                                <div className="h-2 bg-slate-200 rounded"></div>
                                <div className="h-2 bg-slate-100 rounded w-3/4"></div>
                                <div className="h-2 bg-slate-100 rounded w-1/2"></div>
                              </div>
                            </div>

                            {theme === "light" && (
                              <div className="absolute top-4 right-4 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </button>

                          {/* Dark Theme Card */}
                          <button
                            type="button"
                            onClick={() => theme === "light" && toggleTheme()}
                            className={`relative p-6 rounded-xl border-2 transition-all ${
                              theme === "dark"
                                ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                                : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                            }`}
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <Moon className="w-6 h-6 text-white" />
                              </div>
                              <div className="text-left">
                                <h4 className="font-semibold text-slate-900 dark:text-white">
                                  Dark Mode
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  Reduces eye strain in low light
                                </p>
                              </div>
                            </div>

                            <div className="mt-4 p-3 bg-slate-800 rounded-lg border border-slate-700">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                              </div>
                              <div className="space-y-2">
                                <div className="h-2 bg-slate-700 rounded"></div>
                                <div className="h-2 bg-slate-600 rounded w-3/4"></div>
                                <div className="h-2 bg-slate-600 rounded w-1/2"></div>
                              </div>
                            </div>

                            {theme === "dark" && (
                              <div className="absolute top-4 right-4 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Quick Toggle */}
                      <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                              Quick Toggle
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Current theme: <span className="font-medium">{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={toggleTheme}
                            className="relative inline-flex h-8 w-16 items-center rounded-full transition-colors bg-blue-600"
                          >
                            <span className={`inline-flex h-6 w-6 transform items-center justify-center rounded-full bg-white transition-transform ${theme === "dark" ? "translate-x-9" : "translate-x-1"}`}>
                              {theme === "dark" ? <Moon className="w-4 h-4 text-blue-600" /> : <Sun className="w-4 h-4 text-blue-600" />}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                          <strong>Tip:</strong> Your theme preference is saved automatically and will be applied across all pages.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === "security" && (
                  <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                      Security Settings
                    </h2>

                    <form
                      onSubmit={handlePasswordChange}
                      className="space-y-6 max-w-2xl"
                    >
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
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
                            className="w-full px-4 py-2.5 pr-12 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPasswords({
                                ...showPasswords,
                                current: !showPasswords.current,
                              })
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
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
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
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
                            className="w-full px-4 py-2.5 pr-12 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPasswords({
                                ...showPasswords,
                                new: !showPasswords.new,
                              })
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
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
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
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
                            className="w-full px-4 py-2.5 pr-12 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPasswords({
                                ...showPasswords,
                                confirm: !showPasswords.confirm,
                              })
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
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
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Changing Password...</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-5 h-5" />
                            <span>Change Password</span>
                          </>
                        )}
                      </button>
                    </form>

                    {/* Danger Zone */}
                    <div className="mt-8 pt-8 border-t border-red-200 dark:border-red-900/30">
                      <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">
                        Danger Zone
                      </h3>
                      <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                              Deactivate Account
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Temporarily disable your account. You can
                              reactivate by contacting support.
                            </p>
                          </div>
                          <button
                            onClick={handleDeactivateAccount}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Deactivate</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === "notifications" && (
                  <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                      Notification Preferences
                    </h2>

                    <div className="space-y-4">
                      {Object.entries({
                        emailNotifications: "Email Notifications",
                        jobAlerts: "Job Alerts",
                        proposalUpdates: "Proposal Updates",
                        messageNotifications: "Message Notifications",
                        marketingEmails: "Marketing Emails",
                      }).map(([key, label]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700 last:border-0"
                        >
                          <span className="text-slate-700 dark:text-slate-300">
                            {label}
                          </span>
                          <button
                            onClick={() =>
                              setNotifications({
                                ...notifications,
                                [key]: !notifications[key],
                              })
                            }
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              notifications[key]
                                ? "bg-blue-600"
                                : "bg-slate-300 dark:bg-slate-600"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                notifications[key]
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                      <button
                        onClick={() =>
                          toast.success("Notification preferences saved")
                        }
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Save className="w-5 h-5" />
                        <span>Save Preferences</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Privacy Tab */}
                {activeTab === "privacy" && (
                  <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                      Privacy Settings
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                      Privacy settings coming soon. Manage who can see your
                      profile and activity.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
