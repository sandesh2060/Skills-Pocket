
// ============================================
// FILE: frontend/user/src/pages/Profile.jsx
// ============================================
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FreelancerNavbar from '../components/dashboard/freelancer/FreelancerNavbar';
import FreelancerSidebar from '../components/dashboard/freelancer/FreelancerSidebar';
import { getUserById, updateProfile, uploadProfilePicture } from '../api/profileApi';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';

export default function Profile() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const isOwnProfile = !id || id === currentUser?._id;

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const userId = id || currentUser?._id;
      const response = await getUserById(userId);
      
      if (response.success) {
        setProfile(response.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <FreelancerSidebar />
        <div className="flex-1">
          <FreelancerNavbar />
          <Loader fullScreen text="Loading profile..." />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <FreelancerSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <FreelancerNavbar />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto">
            {/* Profile Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-6">
              <div className="flex items-start gap-6">
                <div
                  className="w-24 h-24 rounded-full bg-cover bg-center"
                  style={{
                    backgroundImage: profile?.profilePicture?.url 
                      ? `url(${profile.profilePicture.url})`
                      : `url(https://ui-avatars.com/api/?name=${profile?.firstName}+${profile?.lastName}&background=137fec&color=fff&size=200)`
                  }}
                />
                
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {profile?.firstName} {profile?.lastName}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {profile?.bio || 'No bio added yet'}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                      </svg>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {profile?.rating?.toFixed(1) || '0.0'}
                      </span>
                      <span className="text-gray-500">({profile?.totalReviews || 0} reviews)</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      {profile?.location || 'Location not set'}
                    </div>
                    
                    {profile?.hourlyRate && (
                      <div className="flex items-center gap-2 font-semibold text-primary">
                        ${profile.hourlyRate}/hr
                      </div>
                    )}
                  </div>
                </div>
                
                {isOwnProfile && (
                  <button
                    onClick={() => setEditing(!editing)}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    {editing ? 'Cancel' : 'Edit Profile'}
                  </button>
                )}
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile?.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                )) || <p className="text-gray-500">No skills added yet</p>}
              </div>
            </div>

            {/* Portfolio */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Portfolio
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profile?.portfolio?.length > 0 ? (
                  profile.portfolio.map((item, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      {item.image?.url && (
                        <img
                          src={item.image.url}
                          alt={item.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {item.description}
                        </p>
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            View Project →
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 col-span-full">No portfolio items yet</p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
