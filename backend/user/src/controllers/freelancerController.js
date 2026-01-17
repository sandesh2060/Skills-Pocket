// ============================================
// FILE: backend/user/src/controllers/freelancerController.js
// ============================================
const User = require('../models/User');
const logger = require('../utils/logger');

// @desc    Get all freelancers with filters
// @route   GET /api/freelancers
// @access  Public
exports.getFreelancers = async (req, res) => {
  try {
    const {
      search,
      skills,
      minRate,
      maxRate,
      minRating,
      location,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 12,
    } = req.query;

    // Build query
    const query = { role: 'freelancer', isActive: true };

    // Search by name or bio
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by skills
    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      query.skills = { $in: skillsArray };
    }

    // Filter by hourly rate range
    if (minRate || maxRate) {
      query.hourlyRate = {};
      if (minRate) query.hourlyRate.$gte = Number(minRate);
      if (maxRate) query.hourlyRate.$lte = Number(maxRate);
    }

    // Filter by minimum rating
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const [freelancers, total] = await Promise.all([
      User.find(query)
        .select('-password -emailVerificationToken -resetPasswordToken')
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      User.countDocuments(query),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / Number(limit));

    res.status(200).json({
      success: true,
      data: {
        freelancers,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalItems: total,
          itemsPerPage: Number(limit),
          hasNextPage: Number(page) < totalPages,
          hasPrevPage: Number(page) > 1,
        },
      },
    });
  } catch (error) {
    logger.error(`Get freelancers error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch freelancers',
      error: error.message,
    });
  }
};

// @desc    Get single freelancer by ID
// @route   GET /api/freelancers/:id
// @access  Public
exports.getFreelancerById = async (req, res) => {
  try {
    const freelancer = await User.findOne({
      _id: req.params.id,
      role: 'freelancer',
    }).select('-password -emailVerificationToken -resetPasswordToken');

    if (!freelancer) {
      return res.status(404).json({
        success: false,
        message: 'Freelancer not found',
      });
    }

    res.status(200).json({
      success: true,
      data: freelancer,
    });
  } catch (error) {
    logger.error(`Get freelancer by ID error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch freelancer',
      error: error.message,
    });
  }
};

// @desc    Get featured/top freelancers
// @route   GET /api/freelancers/featured
// @access  Public
exports.getFeaturedFreelancers = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 6;

    const freelancers = await User.find({
      role: 'freelancer',
      isActive: true,
      rating: { $gte: 4.5 },
      completedJobs: { $gte: 5 },
    })
      .select('-password -emailVerificationToken -resetPasswordToken')
      .sort({ rating: -1, completedJobs: -1 })
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      data: freelancers,
    });
  } catch (error) {
    logger.error(`Get featured freelancers error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured freelancers',
      error: error.message,
    });
  }
};

// @desc    Get unique skills from all freelancers
// @route   GET /api/freelancers/skills/all
// @access  Public
exports.getAllSkills = async (req, res) => {
  try {
    const skills = await User.distinct('skills', {
      role: 'freelancer',
      isActive: true,
    });

    res.status(200).json({
      success: true,
      data: skills.filter(Boolean).sort(),
    });
  } catch (error) {
    logger.error(`Get all skills error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch skills',
      error: error.message,
    });
  }
};

// @desc    Search freelancers by skill
// @route   GET /api/freelancers/search/skills
// @access  Public
exports.searchBySkill = async (req, res) => {
  try {
    const { skill, limit = 10 } = req.query;

    if (!skill) {
      return res.status(400).json({
        success: false,
        message: 'Skill parameter is required',
      });
    }

    const freelancers = await User.find({
      role: 'freelancer',
      isActive: true,
      skills: { $regex: skill, $options: 'i' },
    })
      .select('firstName lastName profilePicture skills hourlyRate rating completedJobs')
      .limit(Number(limit))
      .lean();

    res.status(200).json({
      success: true,
      data: freelancers,
    });
  } catch (error) {
    logger.error(`Search by skill error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to search freelancers',
      error: error.message,
    });
  }
};