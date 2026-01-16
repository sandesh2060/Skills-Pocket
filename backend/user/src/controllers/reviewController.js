
// ============================================
// FILE: backend/user/src/controllers/reviewController.js
// ============================================
const Review = require('../models/Review');
const User = require('../models/User');
const Job = require('../models/Job');
const logger = require('../utils/logger');

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res) => {
  try {
    const { jobId, revieweeId, rating, comment, categories } = req.body;

    // Check if job exists and user is authorized
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({
      job: jobId,
      reviewer: req.user.id,
    });

    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: 'You have already reviewed this job',
      });
    }

    const review = await Review.create({
      job: jobId,
      reviewer: req.user.id,
      reviewee: revieweeId,
      rating,
      comment,
      categories,
    });

    // Update reviewee's rating
    const reviewee = await User.findById(revieweeId);
    const totalRating = (reviewee.rating * reviewee.totalReviews + rating) / (reviewee.totalReviews + 1);
    reviewee.rating = totalRating;
    reviewee.totalReviews += 1;
    await reviewee.save();

    await review.populate('reviewer', 'firstName lastName profilePicture');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review,
    });
  } catch (error) {
    logger.error(`Create review error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to create review',
      error: error.message,
    });
  }
};

// @desc    Get reviews for user
// @route   GET /api/reviews/user/:userId
// @access  Public
exports.getUserReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find({ reviewee: req.params.userId })
        .populate('reviewer', 'firstName lastName profilePicture')
        .populate('job', 'title')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Review.countDocuments({ reviewee: req.params.userId }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalReviews: total,
        },
      },
    });
  } catch (error) {
    logger.error(`Get user reviews error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message,
    });
  }
};

// @desc    Get reviews for job
// @route   GET /api/reviews/job/:jobId
// @access  Public
exports.getJobReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ job: req.params.jobId })
      .populate('reviewer', 'firstName lastName profilePicture')
      .populate('reviewee', 'firstName lastName profilePicture');

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    logger.error(`Get job reviews error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message,
    });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    if (review.reviewer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedReview,
    });
  } catch (error) {
    logger.error(`Update review error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to update review',
      error: error.message,
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    if (review.reviewer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    logger.error(`Delete review error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
      error: error.message,
    });
  }
};