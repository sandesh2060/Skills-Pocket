// ============================================
// FILE: frontend/user/src/pages/FreelancerProfile.jsx
// PRODUCTION-READY - Full backend integration with Cloudinary
// ============================================
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import FreelancerNavbar from '../components/dashboard/freelancer/FreelancerNavbar';
import FreelancerSidebar from '../components/dashboard/freelancer/FreelancerSidebar';
import {
  getMyProfile,
  updateProfile,
  uploadProfilePicture,
  addSkill,
  removeSkill,
} from '../api/profileApi';

export default function FreelancerProfile() {
  const { user, updateUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [addingSkill, setAddingSkill] = useState(false);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    bio: '',
    hourlyRate: 0,
    skills: [],
    location: '',
    languages: [],
    socialLinks: {
      linkedin: '',
      github: '',
      website: '',
      twitter: '',
    },
  });

  const [originalData, setOriginalData] = useState(null);

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getMyProfile();
      
      if (response.success) {
        const profileData = {
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          phone: response.data.phone || '',
          bio: response.data.bio || '',
          hourlyRate: response.data.hourlyRate || 0,
          skills: response.data.skills || [],
          location: response.data.location || '',
          languages: response.data.languages || [],
          socialLinks: {
            linkedin: response.data.socialLinks?.linkedin || '',
            github: response.data.socialLinks?.github || '',
            website: response.data.socialLinks?.website || '',
            twitter: response.data.socialLinks?.twitter || '',
          },
        };
        setFormData(profileData);
        setOriginalData(profileData);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      toast.error(error.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Validation
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        toast.error('First name and last name are required');
        return;
      }

      if (formData.hourlyRate < 0 || formData.hourlyRate > 10000) {
        toast.error('Hourly rate must be between $0 and $10,000');
        return;
      }

      if (formData.bio.length > 500) {
        toast.error('Bio cannot exceed 500 characters');
        return;
      }

      const response = await updateProfile(formData);

      if (response.success) {
        toast.success('Profile updated successfully!');
        setOriginalData({ ...formData });
        setEditing(false);
        
        // Update auth context
        updateUser(response.data);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...originalData });
    setEditing(false);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    try {
      setUploadingImage(true);
      const response = await uploadProfilePicture(file);

      if (response.success) {
        toast.success('Profile picture updated!');
        
        // Update auth context with new profile picture
        updateUser({
          profilePicture: response.data.profilePicture,
        });
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAddSkill = async () => {
    const skillToAdd = newSkill.trim();
    
    if (!skillToAdd) {
      toast.error('Please enter a skill name');
      return;
    }

    if (formData.skills.some(s => s.toLowerCase() === skillToAdd.toLowerCase())) {
      toast.error('This skill already exists');
      return;
    }

    try {
      setAddingSkill(true);
      const response = await addSkill(skillToAdd);

      if (response.success) {
        setFormData(prev => ({
          ...prev,
          skills: response.data.skills,
        }));
        setOriginalData(prev => ({
          ...prev,
          skills: response.data.skills,
        }));
        setNewSkill('');
        toast.success('Skill added successfully!');
      }
    } catch (error) {
      console.error('Failed to add skill:', error);
      toast.error(error.response?.data?.message || 'Failed to add skill');
    } finally {
      setAddingSkill(false);
    }
  };

  const handleRemoveSkill = async (skill) => {
    try {
      const response = await removeSkill(skill);

      if (response.success) {
        setFormData(prev => ({
          ...prev,
          skills: response.data.skills,
        }));
        setOriginalData(prev => ({
          ...prev,
          skills: response.data.skills,
        }));
        toast.success('Skill removed successfully!');
      }
    } catch (error) {
      console.error('Failed to remove skill:', error);
      toast.error(error.response?.data?.message || 'Failed to remove skill');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-[#f6f7f8] dark:bg-bg-dark">
        <FreelancerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <FreelancerNavbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-[#4c739a] dark:text-slate-400">Loading profile...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f7f8] dark:bg-bg-dark">
      <FreelancerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <FreelancerNavbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Profile Header */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-[#e7edf3] dark:border-slate-800 mb-6">
              <div className="flex items-start gap-6">
                <div className="relative">
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                  )}
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  <button
                    onClick={handleImageClick}
                    disabled={uploadingImage}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadingImage ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                      </svg>
                    )}
                  </button>
                </div>
                
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-[#0d141b] dark:text-white mb-1">
                    {formData.firstName} {formData.lastName}
                  </h1>
                  <p className="text-[#4c739a] dark:text-slate-400 mb-3">
                    {user?.role === 'freelancer' ? 'Freelancer' : 'Client'}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                        </svg>
                      ))}
                      <span className="ml-2 text-sm font-semibold">
                        {user?.rating?.toFixed(1) || '0.0'} ({user?.completedJobs || 0} jobs)
                      </span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => editing ? handleCancel() : setEditing(true)}
                  disabled={saving}
                  className="px-4 py-2 border border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
            </div>

            {/* Basic Info */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-[#e7edf3] dark:border-slate-800 mb-6">
              <h2 className="text-xl font-bold text-[#0d141b] dark:text-white mb-4">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#0d141b] dark:text-white mb-2">
                    First Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0d141b] dark:text-white outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  ) : (
                    <p className="text-[#4c739a] dark:text-slate-400">{formData.firstName || 'Not set'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0d141b] dark:text-white mb-2">
                    Last Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0d141b] dark:text-white outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  ) : (
                    <p className="text-[#4c739a] dark:text-slate-400">{formData.lastName || 'Not set'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0d141b] dark:text-white mb-2">
                    Phone
                  </label>
                  {editing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0d141b] dark:text-white outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  ) : (
                    <p className="text-[#4c739a] dark:text-slate-400">{formData.phone || 'Not set'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0d141b] dark:text-white mb-2">
                    Location
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0d141b] dark:text-white outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="e.g., New York, USA"
                    />
                  ) : (
                    <p className="text-[#4c739a] dark:text-slate-400">{formData.location || 'Not set'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* About */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-[#e7edf3] dark:border-slate-800 mb-6">
              <h2 className="text-xl font-bold text-[#0d141b] dark:text-white mb-4">About</h2>
              {editing ? (
                <div>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0d141b] dark:text-white outline-none focus:ring-2 focus:ring-primary/20"
                    rows="4"
                    maxLength={500}
                    placeholder="Tell us about yourself..."
                  />
                  <p className="text-sm text-[#4c739a] dark:text-slate-400 mt-1 text-right">
                    {formData.bio.length}/500 characters
                  </p>
                </div>
              ) : (
                <p className="text-[#4c739a] dark:text-slate-400">
                  {formData.bio || 'No bio added yet.'}
                </p>
              )}
            </div>

            {/* Skills */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-[#e7edf3] dark:border-slate-800 mb-6">
              <h2 className="text-xl font-bold text-[#0d141b] dark:text-white mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="group px-4 py-2 bg-primary/10 text-primary rounded-lg font-semibold flex items-center gap-2"
                  >
                    <span>{skill}</span>
                    {!editing && (
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                  placeholder="Add a new skill..."
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0d141b] dark:text-white outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  onClick={handleAddSkill}
                  disabled={addingSkill}
                  className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addingSkill ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    'Add'
                  )}
                </button>
              </div>
            </div>

            {/* Hourly Rate */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-[#e7edf3] dark:border-slate-800 mb-6">
              <h2 className="text-xl font-bold text-[#0d141b] dark:text-white mb-4">Hourly Rate</h2>
              {editing ? (
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-[#0d141b] dark:text-white">$</span>
                  <input
                    type="number"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData({...formData, hourlyRate: parseFloat(e.target.value) || 0})}
                    min="0"
                    max="10000"
                    className="w-32 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0d141b] dark:text-white font-bold text-2xl outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <span className="text-[#4c739a] dark:text-slate-400">/hour</span>
                </div>
              ) : (
                <p className="text-3xl font-bold text-[#0d141b] dark:text-white">
                  ${formData.hourlyRate} <span className="text-lg text-[#4c739a] dark:text-slate-400 font-normal">/hour</span>
                </p>
              )}
            </div>

            {/* Social Links */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-[#e7edf3] dark:border-slate-800 mb-6">
              <h2 className="text-xl font-bold text-[#0d141b] dark:text-white mb-4">Social Links</h2>
              <div className="space-y-4">
                {['linkedin', 'github', 'website', 'twitter'].map((platform) => (
                  <div key={platform}>
                    <label className="block text-sm font-semibold text-[#0d141b] dark:text-white mb-2 capitalize">
                      {platform}
                    </label>
                    {editing ? (
                      <input
                        type="url"
                        value={formData.socialLinks[platform]}
                        onChange={(e) => setFormData({
                          ...formData,
                          socialLinks: { ...formData.socialLinks, [platform]: e.target.value }
                        })}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0d141b] dark:text-white outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder={`Your ${platform} URL`}
                      />
                    ) : (
                      <p className="text-[#4c739a] dark:text-slate-400">
                        {formData.socialLinks[platform] ? (
                          <a
                            href={formData.socialLinks[platform]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary"
                          >
                            {formData.socialLinks[platform]}
                          </a>
                        ) : (
                          'Not set'
                        )}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {editing && (
              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="px-6 py-3 border border-slate-300 dark:border-slate-700 text-[#0d141b] dark:text-white rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}