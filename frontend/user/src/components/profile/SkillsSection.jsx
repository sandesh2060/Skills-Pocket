
// ============================================
// FILE: frontend/user/src/components/profile/SkillsSection.jsx
// ============================================
import React, { useState } from 'react';

export default function SkillsSection({ skills = [], isOwnProfile = false, onAddSkill, onRemoveSkill }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [proficiency, setProficiency] = useState('intermediate');

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim()) {
      onAddSkill({ skill: newSkill.trim(), proficiency });
      setNewSkill('');
      setProficiency('intermediate');
      setShowAddModal(false);
    }
  };

  const getProficiencyColor = (level) => {
    const colors = {
      beginner: 'bg-green-100 dark:bg-green-900/20 text-green-600',
      intermediate: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600',
      advanced: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600',
      expert: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600',
    };
    return colors[level] || colors.intermediate;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-[#e7edf3] dark:border-slate-800 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#0d141b] dark:text-white mb-1">
            Skills & Expertise
          </h2>
          <p className="text-sm text-[#4c739a] dark:text-slate-400">
            {skills.length} skill{skills.length !== 1 ? 's' : ''} added
          </p>
        </div>
        
        {isOwnProfile && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Add Skill
          </button>
        )}
      </div>

      {/* Skills Grid */}
      {skills.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {skills.map((skillItem, index) => {
            const skillName = typeof skillItem === 'string' ? skillItem : skillItem.skill || skillItem.name;
            const skillLevel = typeof skillItem === 'object' ? skillItem.proficiency : 'intermediate';
            
            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border border-[#e7edf3] dark:border-slate-800 hover:border-primary/30 dark:hover:border-primary/30 transition-colors group"
              >
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#0d141b] dark:text-white mb-1">
                    {skillName}
                  </p>
                  {skillLevel && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getProficiencyColor(skillLevel)}`}>
                      {skillLevel}
                    </span>
                  )}
                </div>
                
                {isOwnProfile && (
                  <button
                    onClick={() => onRemoveSkill(skillName)}
                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 transition-opacity ml-2"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-[#4c739a] dark:text-slate-600 mb-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
          </svg>
          <p className="text-[#4c739a] dark:text-slate-400 mb-4">No skills added yet</p>
          {isOwnProfile && (
            <button
              onClick={() => setShowAddModal(true)}
              className="text-primary hover:underline font-semibold"
            >
              Add your first skill
            </button>
          )}
        </div>
      )}

      {/* Add Skill Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowAddModal(false)} />
          
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Add New Skill</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleAddSkill} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Skill Name
                  </label>
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="e.g., React, Node.js, UI Design"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Proficiency Level
                  </label>
                  <select
                    value={proficiency}
                    onChange={(e) => setProficiency(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg"
                  >
                    Add Skill
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}