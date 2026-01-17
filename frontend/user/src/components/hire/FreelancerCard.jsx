// ============================================
// FILE: frontend/user/src/components/hire/FreelancerCard.jsx
// ============================================
import { Star, MapPin, Briefcase, DollarSign } from 'lucide-react';

export default function FreelancerCard({ freelancer, onViewDetails, onHire }) {
  const {
    _id,
    firstName,
    lastName,
    profilePicture,
    bio,
    skills = [],
    hourlyRate,
    rating,
    totalReviews,
    completedJobs,
    location,
  } = freelancer;

  const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  const displaySkills = skills.slice(0, 4);
  const remainingSkills = skills.length - 4;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200 overflow-hidden group">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative">
            {profilePicture?.url ? (
              <img
                src={profilePicture.url}
                alt={`${firstName} ${lastName}`}
                className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 dark:border-slate-600"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg border-2 border-slate-200 dark:border-slate-600">
                {initials}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
              {firstName} {lastName}
            </h3>
            
            {/* Rating & Reviews */}
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {rating > 0 ? rating.toFixed(1) : 'New'}
                </span>
                {totalReviews > 0 && (
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    ({totalReviews})
                  </span>
                )}
              </div>
              
              {completedJobs > 0 && (
                <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span className="text-xs">{completedJobs} jobs</span>
                </div>
              )}
            </div>

            {/* Location */}
            {location && (
              <div className="flex items-center gap-1 mt-1 text-slate-600 dark:text-slate-400">
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-xs">{location}</span>
              </div>
            )}
          </div>

          {/* Hourly Rate */}
          {hourlyRate > 0 && (
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                ${hourlyRate}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">per hour</div>
            </div>
          )}
        </div>
      </div>

      {/* Bio */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3">
          {bio || 'No bio available.'}
        </p>
      </div>

      {/* Skills */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex flex-wrap gap-2">
          {displaySkills.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full"
            >
              {skill}
            </span>
          ))}
          {remainingSkills > 0 && (
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-medium rounded-full">
              +{remainingSkills} more
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 flex gap-3">
        <button
          onClick={() => onViewDetails(freelancer)}
          className="flex-1 px-4 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium text-sm"
        >
          View Profile
        </button>
        <button
          onClick={() => onHire(freelancer)}
          className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm"
        >
          Hire Now
        </button>
      </div>
    </div>
  );
}