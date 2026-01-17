
// ============================================
// FILE: frontend/user/src/components/profile/ProfileHeader.jsx
// ============================================
import React, { useState } from 'react';
import { formatCurrency } from '../../utils/helpers';

export default function ProfileHeader({ user, isOwnProfile = false, onEdit }) {
  const [showContactModal, setShowContactModal] = useState(false);

  const {
    firstName,
    lastName,
    profilePicture,
    bio,
    location,
    skills,
    hourlyRate,
    rating,
    totalReviews,
    completedJobs,
    totalEarnings,
    isVerified,
  } = user;

  const getInitials = () => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-[#e7edf3] dark:border-slate-800 overflow-hidden">
      {/* Cover Image */}
      <div className="h-32 bg-gradient-to-r from-primary to-blue-400"></div>

      {/* Profile Content */}
      <div className="px-8 pb-8">
        {/* Avatar & Basic Info */}
        <div className="flex items-start gap-6 -mt-16 mb-6">
          {/* Avatar */}
          <div className="relative">
            {profilePicture?.url ? (
              <img
                src={profilePicture.url}
                alt={`${firstName} ${lastName}`}
                className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-900 object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-900 bg-primary flex items-center justify-center text-white text-3xl font-bold">
                {getInitials()}
              </div>
            )}
            
            {isVerified && (
              <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 pt-16">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h1 className="text-3xl font-bold text-[#0d141b] dark:text-white mb-1">
                  {firstName} {lastName}
                  {isVerified && (
                    <span className="ml-2 text-green-500">
                      <svg className="w-6 h-6 inline" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.69 3.61.82 1.89 3.2L12 21.04l3.4 1.46 1.89-3.2 3.61-.82-.34-3.69L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z"/>
                      </svg>
                    </span>
                  )}
                </h1>
                
                <div className="flex items-center gap-4 text-sm text-[#4c739a] dark:text-slate-400">
                  {location && (
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      {location}
                    </span>
                  )}
                  
                  {hourlyRate && (
                    <>
                      <span>•</span>
                      <span className="font-semibold text-[#0d141b] dark:text-white">
                        {formatCurrency(hourlyRate)}/hr
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                {isOwnProfile ? (
                  <button
                    onClick={onEdit}
                    className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setShowContactModal(true)}
                      className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                      Contact
                    </button>
                    <button className="px-6 py-2.5 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold rounded-lg transition-colors">
                      Hire
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Bio */}
            {bio && (
              <p className="text-[#4c739a] dark:text-slate-400 leading-relaxed mb-4">
                {bio}
              </p>
            )}

            {/* Stats */}
            <div className="grid grid-cols-4 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-5 h-5 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                  <p className="text-xs text-[#4c739a] dark:text-slate-400">Rating</p>
                </div>
                <p className="text-2xl font-bold text-[#0d141b] dark:text-white">
                  {rating || 0}/5
                  <span className="text-sm font-normal text-[#4c739a] dark:text-slate-400 ml-2">
                    ({totalReviews || 0})
                  </span>
                </p>
              </div>

              <div>
                <p className="text-xs text-[#4c739a] dark:text-slate-400 mb-1">Completed Jobs</p>
                <p className="text-2xl font-bold text-[#0d141b] dark:text-white">
                  {completedJobs || 0}
                </p>
              </div>

              {isOwnProfile && totalEarnings !== undefined && (
                <div>
                  <p className="text-xs text-[#4c739a] dark:text-slate-400 mb-1">Total Earnings</p>
                  <p className="text-2xl font-bold text-[#0d141b] dark:text-white">
                    {formatCurrency(totalEarnings)}
                  </p>
                </div>
              )}

              <div>
                <p className="text-xs text-[#4c739a] dark:text-slate-400 mb-1">Response Time</p>
                <p className="text-2xl font-bold text-[#0d141b] dark:text-white">
                  ~2hrs
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Skills Preview */}
        {skills && skills.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-6 border-t border-[#e7edf3] dark:border-slate-800">
            {skills.slice(0, 8).map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-lg"
              >
                {skill}
              </span>
            ))}
            {skills.length > 8 && (
              <span className="px-3 py-1.5 text-primary text-sm font-medium">
                +{skills.length - 8} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}