// ============================================
// FILE: backend/user/src/controllers/jobController.js
// COMPLETE WORKING VERSION
// ============================================
const Job = require('../models/Job');
const Proposal = require('../models/Proposal');
const logger = require('../utils/logger');

// @desc    Get all jobs (with filters)
// @route   GET /api/jobs
// @access  Public
exports.getAllJobs = async (req, res) => {
  try {
    const { category, skills, budgetMin, budgetMax, projectType, page = 1, limit = 10 } = req.query;
    
    const query = { status: 'open' };
    
    if (category) query.category = category;
    if (projectType) query.projectType = projectType;
    if (skills) query.skills = { $in: skills.split(',') };
    if (budgetMin || budgetMax) {
      query.budget = {};
      if (budgetMin) query.budget.$gte = Number(budgetMin);
      if (budgetMax) query.budget.$lte = Number(budgetMax);
    }

    const skip = (page - 1) * limit;

    const jobs = await Job.find(query)
      .populate('client', 'firstName lastName email profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(query);

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
    logger.error(`Get all jobs error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
    });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('client', 'firstName lastName email profilePicture company')
      .populate({
        path: 'proposals',
        populate: {
          path: 'freelancer',
          select: 'firstName lastName email profilePicture skills rating',
        },
      });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { job },
    });
  } catch (error) {
    logger.error(`Get job by ID error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
    });
  }
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private (Client only)
exports.createJob = async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      client: req.user.id,
    };

    const job = await Job.create(jobData);

    logger.info(`Job created successfully`, { jobId: job._id, userId: req.user.id });

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: { job },
    });
  } catch (error) {
    logger.error(`Create job error: ${error.message}`, { userId: req.user?.id });
    res.status(500).json({
      success: false,
      message: 'Failed to create job',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
    });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Client - job owner only)
exports.updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Check if user is the job owner
    if (job.client.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job',
      });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: { job },
    });
  } catch (error) {
    logger.error(`Update job error: ${error.message}`, { jobId: req.params.id });
    res.status(500).json({
      success: false,
      message: 'Failed to update job',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
    });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Client - job owner only)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Check if user is the job owner
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
    logger.error(`Delete job error: ${error.message}`, { jobId: req.params.id });
    res.status(500).json({
      success: false,
      message: 'Failed to delete job',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
    });
  }
};

// @desc    Get client's jobs
// @route   GET /api/jobs/my-jobs
// @access  Private (Client only)
exports.getMyJobs = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const query = { client: req.user.id };
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const jobs = await Job.find(query)
      .populate('hiredFreelancer', 'firstName lastName email profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(query);

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
    logger.error(`Get my jobs error: ${error.message}`, { userId: req.user?.id });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
    });
  }
};

// @desc    Get freelancer's active jobs (accepted proposals)
// @route   GET /api/jobs/freelancer/my-jobs
// @access  Private (Freelancer only)
exports.getFreelancerJobs = async (req, res) => {
  try {
    logger.info(`Get freelancer jobs request`, { 
      userId: req.user?.id, 
      role: req.user?.role,
      query: req.query 
    });

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const { page = 1, limit = 10, status } = req.query;
    
    // Build query for proposals
    const proposalQuery = { 
      freelancer: req.user.id,
      status: 'accepted' // Only accepted proposals
    };

    const skip = (page - 1) * limit;

    // Find accepted proposals with populated job details
    const proposals = await Proposal.find(proposalQuery)
      .populate({
        path: 'job',
        populate: {
          path: 'client',
          select: 'firstName lastName email profilePicture'
        }
      })
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Filter out proposals where job might have been deleted
    const validProposals = proposals.filter(p => p.job);

    // Transform data to match frontend expectations
    const jobs = validProposals.map(proposal => {
      const job = proposal.job;
      
      // Calculate progress based on milestones if they exist
      let progress = 0;
      if (job.milestones && job.milestones.length > 0) {
        const completedMilestones = job.milestones.filter(m => m.status === 'completed' || m.status === 'approved').length;
        progress = Math.round((completedMilestones / job.milestones.length) * 100);
      } else if (job.status === 'in_progress') {
        progress = 50; // Default progress for in-progress jobs without milestones
      } else if (job.status === 'completed') {
        progress = 100;
      }

      // Get current milestone
      const currentMilestone = job.milestones?.find(m => m.status === 'in_progress') || 
                              job.milestones?.find(m => m.status === 'pending');

      return {
        _id: job._id,
        title: job.title,
        description: job.description,
        client: {
          _id: job.client._id,
          name: `${job.client.firstName} ${job.client.lastName}`,
          email: job.client.email,
          profilePicture: job.client.profilePicture,
        },
        status: job.status,
        budget: proposal.proposedBudget,
        budgetType: job.projectType,
        deadline: job.endDate,
        startDate: job.startDate,
        completedAt: job.completedAt,
        progress,
        currentMilestone: currentMilestone ? {
          title: currentMilestone.title,
          description: currentMilestone.description,
          dueDate: currentMilestone.dueDate,
          status: currentMilestone.status,
        } : null,
        milestones: job.milestones,
        proposalId: proposal._id,
        acceptedAt: proposal.respondedAt,
        category: job.category,
        skills: job.skills,
      };
    });

    // Filter by status if provided
    let filteredJobs = jobs;
    if (status) {
      if (status === 'active') {
        filteredJobs = jobs.filter(j => j.status === 'in_progress');
      } else if (status === 'completed') {
        filteredJobs = jobs.filter(j => j.status === 'completed');
      }
    }

    const total = await Proposal.countDocuments(proposalQuery);

    logger.info(`Get freelancer jobs success`, { 
      userId: req.user.id, 
      jobsCount: filteredJobs.length,
      total 
    });

    res.status(200).json({
      success: true,
      data: {
        jobs: filteredJobs,
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
    logger.error(`Get freelancer jobs error: ${error.message}`, { 
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

// @desc    Get active jobs count for freelancer
// @route   GET /api/jobs/freelancer/active-count
// @access  Private (Freelancer only)
exports.getFreelancerActiveJobsCount = async (req, res) => {
  try {
    const proposals = await Proposal.find({
      freelancer: req.user.id,
      status: 'accepted'
    }).populate('job');

    const activeJobs = proposals.filter(p => 
      p.job && p.job.status === 'in_progress'
    );

    res.status(200).json({
      success: true,
      data: {
        count: activeJobs.length,
      },
    });
  } catch (error) {
    logger.error(`Get active jobs count error: ${error.message}`, { 
      userId: req.user?.id,
      stack: error.stack 
    });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active jobs count',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
    });
  }
};

// @desc    Update job milestone status (Freelancer)
// @route   PATCH /api/jobs/:jobId/milestones/:milestoneId
// @access  Private (Freelancer working on job)
exports.updateMilestoneStatus = async (req, res) => {
  try {
    const { jobId, milestoneId } = req.params;
    const { status } = req.body;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Check if freelancer is hired for this job
    if (job.hiredFreelancer?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this milestone',
      });
    }

    const milestone = job.milestones.id(milestoneId);
    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found',
      });
    }

    milestone.status = status;
    if (status === 'completed') {
      milestone.completedAt = new Date();
    }

    await job.save();

    res.status(200).json({
      success: true,
      message: 'Milestone updated successfully',
      data: { milestone },
    });
  } catch (error) {
    logger.error(`Update milestone error: ${error.message}`, { 
      jobId: req.params.jobId,
      milestoneId: req.params.milestoneId,
      userId: req.user?.id,
      stack: error.stack 
    });
    res.status(500).json({
      success: false,
      message: 'Failed to update milestone',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
    });
  }
};