// ============================================
// FILE: frontend/user/src/components/profile/ReviewsList.jsx
// ============================================
import React, { useState } from 'react';
import { formatRelativeTime } from '../../utils/helpers';

export default function ReviewsList({ reviews = [], averageRating = 0, totalReviews = 0 }) {
  const [filter, setFilter] = useState('all'); // all, 5, 4, 3, 2, 1

  const StarRating = ({ rating, size = 'sm' }) => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating ? 'text-yellow-500' : 'text-slate-300 dark:text-slate-600'
            }`}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
        ))}
      </div>
    );
  };

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: totalReviews > 0 ? (reviews.filter(r => r.rating === rating).length / totalReviews) * 100 : 0,
  }));

  const filteredReviews = filter === 'all' 
    ? reviews 
    : reviews.filter(r => r.rating === parseInt(filter));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-[#e7edf3] dark:border-slate-800 p-6">
      {/* Header */}
      <h2 className="text-xl font-bold text-[#0d141b] dark:text-white mb-6">
        Reviews & Ratings
      </h2>

      {reviews.length > 0 ? (
        <>
          {/* Rating Summary */}
          <div className="grid md:grid-cols-3 gap-6 mb-8 pb-8 border-b border-[#e7edf3] dark:border-slate-800">
            {/* Overall Rating */}
            <div className="text-center md:border-r border-[#e7edf3] dark:border-slate-800">
              <div className="text-5xl font-bold text-[#0d141b] dark:text-white mb-2">
                {averageRating.toFixed(1)}
              </div>
              <StarRating rating={Math.round(averageRating)} size="md" />
              <p className="text-sm text-[#4c739a] dark:text-slate-400 mt-2">
                Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="md:col-span-2 md:pl-6">
              <div className="space-y-2">
                {ratingDistribution.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center gap-3">
                    <button
                      onClick={() => setFilter(filter === rating.toString() ? 'all' : rating.toString())}
                      className="flex items-center gap-2 text-sm font-medium text-[#4c739a] dark:text-slate-400 hover:text-primary transition-colors"
                    >
                      <span>{rating}</span>
                      <svg className="w-4 h-4 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                      </svg>
                    </button>
                    
                    <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-500 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    
                    <span className="text-sm font-medium text-[#4c739a] dark:text-slate-400 w-12 text-right">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Filter Info */}
          {filter !== 'all' && (
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-[#4c739a] dark:text-slate-400">
                Showing {filteredReviews.length} review{filteredReviews.length !== 1 ? 's' : ''} with {filter} star{filter !== '1' ? 's' : ''}
              </p>
              <button
                onClick={() => setFilter('all')}
                className="text-sm font-semibold text-primary hover:underline"
              >
                Clear filter
              </button>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {filteredReviews.map((review, index) => (
              <div
                key={index}
                className="pb-6 border-b border-[#e7edf3] dark:border-slate-800 last:border-0"
              >
                <div className="flex items-start gap-4 mb-3">
                  {/* Reviewer Avatar */}
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">
                    {review.reviewer?.firstName?.charAt(0)}{review.reviewer?.lastName?.charAt(0)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-[#0d141b] dark:text-white">
                          {review.reviewer?.firstName} {review.reviewer?.lastName}
                        </h4>
                        <p className="text-xs text-[#4c739a] dark:text-slate-400">
                          {formatRelativeTime(review.createdAt)}
                        </p>
                      </div>
                      <StarRating rating={review.rating} size="sm" />
                    </div>

                    <p className="text-[#4c739a] dark:text-slate-400 leading-relaxed">
                      {review.comment}
                    </p>

                    {/* Job Info */}
                    {review.job && (
                      <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <p className="text-xs text-[#4c739a] dark:text-slate-400 mb-1">Project</p>
                        <p className="text-sm font-semibold text-[#0d141b] dark:text-white">
                          {review.job.title}
                        </p>
                      </div>
                    )}

                    {/* Helpful Count */}
                    {review.helpfulCount > 0 && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-[#4c739a] dark:text-slate-400">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
                        </svg>
                        <span>{review.helpfulCount} found this helpful</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <svg className="w-20 h-20 mx-auto text-[#4c739a] dark:text-slate-600 mb-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
          <p className="text-[#4c739a] dark:text-slate-400 text-lg">No reviews yet</p>
        </div>
      )}
    </div>
  );
}