// ============================================
// FILE: backend/admin/src/controllers/jobManagementController.js
// ============================================
const Job = require('../models/Job');
const logger = require('../utils/logger');

// @desc    Get all jobs
// @route   GET /api/admin/jobs
// @access  Private (Admin)
exports.getAllJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      category,
      search,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const query = {};

    if (status) query.status = status;
    if (category) query.category = category;
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const jobs = await Job.find(query)
      .populate('client', 'firstName lastName email')
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        jobs,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalJobs: count,
          hasNext: page * limit < count,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    logger.error(`Get jobs error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs',
    });
  }
};

// @desc    Delete job
// @route   DELETE /api/admin/jobs/:jobId
// @access  Private (Admin)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    job.status = 'deleted';
    job.deletedAt = Date.now();
    job.deletedBy = req.admin.id;
    await job.save();

    logger.warn(`Job deleted: ${job._id} by admin: ${req.admin.email}`);

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully',
    });
  } catch (error) {
    logger.error(`Delete job error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error deleting job',
    });
  }
};

// @desc    Feature/Unfeature job
// @route   PUT /api/admin/jobs/:jobId/feature
// @access  Private (Admin)
exports.toggleJobFeature = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    job.isFeatured = !job.isFeatured;
    await job.save();

    logger.info(`Job ${job.isFeatured ? 'featured' : 'unfeatured'}: ${job._id} by admin: ${req.admin.email}`);

    res.status(200).json({
      success: true,
      message: `Job ${job.isFeatured ? 'featured' : 'unfeatured'} successfully`,
      data: job,
    });
  } catch (error) {
    logger.error(`Toggle job feature error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error updating job',
    });
  }
};