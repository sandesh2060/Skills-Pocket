// ============================================
// FILE: frontend/user/src/components/hire/FreelancerDetails.jsx
// ============================================
import { X, Star, MapPin, Briefcase, DollarSign, Award, GraduationCap, Sparkles } from 'lucide-react';

export default function FreelancerDetails({ freelancer, onClose, onHire }) {
  const {
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
    portfolio = [],
    experience = [],
    education = [],
    certifications = [],
    totalEarnings,
  } = freelancer;

  const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-4xl w-full my-8">
        {/* Header */}
        <div className="sticky top-0 px-6 py-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between rounded-t-xl z-10">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Freelancer Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[calc(90vh-8rem)] overflow-y-auto">
          {/* Profile Header */}
          <div className="flex items-start gap-6 pb-6 border-b border-slate-200 dark:border-slate-700">
            {profilePicture?.url ? (
              <img
                src={profilePicture.url}
                alt={`${firstName} ${lastName}`}
                className="w-24 h-24 rounded-full object-cover border-4 border-slate-200 dark:border-slate-600"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl border-4 border-slate-200 dark:border-slate-600">
                {initials}
              </div>
            )}

            <div className="flex-1">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {firstName} {lastName}
              </h3>
              
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {rating > 0 ? rating.toFixed(1) : 'New'}
                  </span>
                  {totalReviews > 0 && (
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      ({totalReviews} reviews)
                    </span>
                  )}
                </div>

                {completedJobs > 0 && (
                  <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                    <Briefcase className="w-4 h-4" />
                    <span className="text-sm">{completedJobs} jobs completed</span>
                  </div>
                )}

                {location && (
                  <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{location}</span>
                  </div>
                )}
              </div>

              {hourlyRate > 0 && (
                <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg">
                  <DollarSign className="w-5 h-5" />
                  <span className="font-bold text-lg">${hourlyRate}/hr</span>
                </div>
              )}
            </div>
          </div>

          {/* Bio */}
          {bio && (
            <div>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                About
              </h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {bio}
              </p>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-lg"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Portfolio */}
          {portfolio.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                Portfolio
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {portfolio.map((item, index) => (
                  <div
                    key={index}
                    className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    {item.image?.url && (
                      <img
                        src={item.image.url}
                        alt={item.title}
                        className="w-full h-40 object-cover rounded-lg mb-3"
                      />
                    )}
                    <h5 className="font-semibold text-slate-900 dark:text-white mb-1">
                      {item.title}
                    </h5>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      {item.description}
                    </p>
                    {item.technologies && item.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.technologies.map((tech, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Work Experience
              </h4>
              <div className="space-y-4">
                {experience.map((exp, index) => (
                  <div key={index} className="border-l-2 border-blue-500 pl-4">
                    <h5 className="font-semibold text-slate-900 dark:text-white">
                      {exp.position}
                    </h5>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {exp.company} · {exp.current ? 'Present' : new Date(exp.endDate).getFullYear()}
                    </p>
                    {exp.description && (
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Education
              </h4>
              <div className="space-y-4">
                {education.map((edu, index) => (
                  <div key={index} className="border-l-2 border-green-500 pl-4">
                    <h5 className="font-semibold text-slate-900 dark:text-white">
                      {edu.degree} in {edu.field}
                    </h5>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {edu.institution}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Certifications
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg"
                  >
                    <h5 className="font-semibold text-slate-900 dark:text-white text-sm">
                      {cert.name}
                    </h5>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {cert.issuer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 px-6 py-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex gap-3 rounded-b-xl">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onHire(freelancer);
            }}
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            Send Hire Proposal
          </button>
        </div>
      </div>
    </div>
  );
}