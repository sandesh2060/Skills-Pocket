// ============================================
// FILE: backend/user/src/controllers/jobController.js
// ============================================
const Job = require('../models/Job');
const User = require('../models/User');
const logger = require('../utils/logger');

// @desc    Create job
// @route   POST /api/jobs
// @access  Private (Client only)
exports.createJob = async (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({
        success: false,
        message: 'Only clients can post jobs',
      });
    }

    const jobData = {
      ...req.body,
      client: req.user.id,
    };

    const job = await Job.create(jobData);
    await job.populate('client', 'firstName lastName email profilePicture');

    res.status(201).json({
      success: true,
      message: 'Job posted successfully',
      data: job,
    });
  } catch (error) {
    logger.error(`Create job error: ${error.message}`, { 
      userId: req.user?.id, 
      stack: error.stack 
    });
    res.status(500).json({
      success: false,
      message: 'Failed to create job',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
    });
  }
};

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
exports.getAllJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      skills,
      budget_min,
      budget_max,
      experienceLevel,
      search,
      status = 'open',
    } = req.query;

    const query = { status };

    // Filters
    if (category) query.category = category;
    if (experienceLevel) query.experienceLevel = experienceLevel;
    if (skills) query.skills = { $in: skills.split(',') };
    if (budget_min || budget_max) {
      query['budget.min'] = { $gte: budget_min || 0 };
      query['budget.max'] = { $lte: budget_max || Infinity };
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate('client', 'firstName lastName profilePicture rating')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Job.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: {
        jobs,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalJobs: total,
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    logger.error(`Get all jobs error: ${error.message}`, { stack: error.stack });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
    });
  }
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Public
exports.getJobById = async (req, res) => {
  try {
    // Validate MongoDB ObjectId
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid job ID format',
      });
    }

    const job = await Job.findById(req.params.id)
      .populate('client', 'firstName lastName email profilePicture rating totalReviews')
      .populate({
        path: 'proposals',
        populate: { path: 'freelancer', select: 'firstName lastName profilePicture rating' },
      });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Increment views
    job.views += 1;
    await job.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    logger.error(`Get job by ID error: ${error.message}`, { 
      jobId: req.params.id, 
      stack: error.stack 
    });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
    });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Client - job owner)
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    if (job.client.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job',
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: updatedJob,
    });
  } catch (error) {
    logger.error(`Update job error: ${error.message}`, { 
      jobId: req.params.id, 
      userId: req.user?.id, 
      stack: error.stack 
    });
    res.status(500).json({
      success: false,
      message: 'Failed to update job',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
    });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Client - job owner)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    if (job.client.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job',
      });
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully',
    });
  } catch (error) {
    logger.error(`Delete job error: ${error.message}`, { 
      jobId: req.params.id, 
      userId: req.user?.id, 
      stack: error.stack 
    });
    res.status(500).json({
      success: false,
      message: 'Failed to delete job',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
    });
  }
};

// @desc    Get my posted jobs
// @route   GET /api/jobs/my-jobs
// @access  Private (Client)
exports.getMyJobs = async (req, res) => {
  try {
    // Enhanced logging for debugging
    logger.info(`Get my jobs request`, { 
      userId: req.user?.id, 
      role: req.user?.role,
      query: req.query 
    });

    // Verify user exists
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const { page = 1, limit = 10, status } = req.query;
    const query = { client: req.user.id };
    
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate('hiredFreelancer', 'firstName lastName profilePicture')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Job.countDocuments(query),
    ]);

    logger.info(`Get my jobs success`, { 
      userId: req.user.id, 
      jobsCount: jobs.length,
      total 
    });

    res.status(200).json({
      success: true,
      data: {
        jobs,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalJobs: total,
        },
      },
    });
  } catch (error) {
    logger.error(`Get my jobs error: ${error.message}`, { 
      userId: req.user?.id,
      query: req.query,
      stack: error.stack 
    });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
    });
  }
};