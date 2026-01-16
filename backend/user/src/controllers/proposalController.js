// ============================================
// FILE: backend/user/src/controllers/proposalController.js
// ============================================
const Proposal = require('../models/Proposal');
const Notification = require('../models/Notification');
const { createNotification } = require('../services/notificationService');

// @desc    Submit proposal
// @route   POST /api/proposals
// @access  Private (Freelancer only)
exports.submitProposal = async (req, res) => {
  try {
    if (req.user.role !== 'freelancer') {
      return res.status(403).json({
        success: false,
        message: 'Only freelancers can submit proposals',
      });
    }

    const { jobId, coverLetter, proposedBudget, estimatedDuration, milestones } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    if (job.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'This job is no longer accepting proposals',
      });
    }

    // Check if already submitted
    const existingProposal = await Proposal.findOne({
      job: jobId,
      freelancer: req.user.id,
    });

    if (existingProposal) {
      return res.status(409).json({
        success: false,
        message: 'You have already submitted a proposal for this job',
      });
    }

    const proposal = await Proposal.create({
      job: jobId,
      freelancer: req.user.id,
      coverLetter,
      proposedBudget,
      estimatedDuration,
      milestones,
    });

    // Update job proposal count
    job.proposalCount += 1;
    job.proposals.push(proposal._id);
    await job.save();

    // Notify client
    await createNotification({
      user: job.client,
      type: 'proposal_received',
      title: 'New Proposal Received',
      message: `You received a new proposal for "${job.title}"`,
      link: `/jobs/${job._id}`,
    });

    await proposal.populate('freelancer', 'firstName lastName profilePicture rating');

    res.status(201).json({
      success: true,
      message: 'Proposal submitted successfully',
      data: proposal,
    });
  } catch (error) {
    logger.error(`Submit proposal error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to submit proposal',
      error: error.message,
    });
  }
};

// @desc    Get proposals for job
// @route   GET /api/proposals/job/:jobId
// @access  Private (Client - job owner)
exports.getJobProposals = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    if (job.client.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view proposals',
      });
    }

    const proposals = await Proposal.find({ job: req.params.jobId })
      .populate('freelancer', 'firstName lastName profilePicture rating totalReviews skills hourlyRate')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      data: proposals,
    });
  } catch (error) {
    logger.error(`Get job proposals error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch proposals',
      error: error.message,
    });
  }
};

// @desc    Get my proposals
// @route   GET /api/proposals/my-proposals
// @access  Private (Freelancer)
exports.getMyProposals = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = { freelancer: req.user.id };
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const [proposals, total] = await Promise.all([
      Proposal.find(query)
        .populate('job', 'title category budget status client')
        .populate({
          path: 'job',
          populate: { path: 'client', select: 'firstName lastName profilePicture' },
        })
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Proposal.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: {
        proposals,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalProposals: total,
        },
      },
    });
  } catch (error) {
    logger.error(`Get my proposals error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch proposals',
      error: error.message,
    });
  }
};

// @desc    Accept proposal
// @route   PUT /api/proposals/:id/accept
// @access  Private (Client - job owner)
exports.acceptProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id).populate('job');

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal not found',
      });
    }

    if (proposal.job.client.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    proposal.status = 'accepted';
    proposal.respondedAt = Date.now();
    await proposal.save();

    // Update job
    const job = await Job.findById(proposal.job._id);
    job.status = 'in_progress';
    job.hiredFreelancer = proposal.freelancer;
    job.acceptedProposal = proposal._id;
    job.startDate = Date.now();
    await job.save();

    // Notify freelancer
    await createNotification({
      user: proposal.freelancer,
      type: 'proposal_accepted',
      title: 'Proposal Accepted',
      message: `Your proposal for "${job.title}" has been accepted!`,
      link: `/jobs/${job._id}`,
    });

    res.status(200).json({
      success: true,
      message: 'Proposal accepted successfully',
      data: proposal,
    });
  } catch (error) {
    logger.error(`Accept proposal error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to accept proposal',
      error: error.message,
    });
  }
};

// @desc    Reject proposal
// @route   PUT /api/proposals/:id/reject
// @access  Private (Client - job owner)
exports.rejectProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id).populate('job');

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal not found',
      });
    }

    if (proposal.job.client.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    proposal.status = 'rejected';
    proposal.respondedAt = Date.now();
    await proposal.save();

    // Notify freelancer
    await createNotification({
      user: proposal.freelancer,
      type: 'proposal_rejected',
      title: 'Proposal Update',
      message: `Your proposal for "${proposal.job.title}" was not selected`,
      link: `/proposals/${proposal._id}`,
    });

    res.status(200).json({
      success: true,
      message: 'Proposal rejected',
      data: proposal,
    });
  } catch (error) {
    logger.error(`Reject proposal error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to reject proposal',
      error: error.message,
    });
  }
};

// @desc    Withdraw proposal
// @route   DELETE /api/proposals/:id
// @access  Private (Freelancer - proposal owner)
exports.withdrawProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal not found',
      });
    }

    if (proposal.freelancer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    if (proposal.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot withdraw a proposal that has been responded to',
      });
    }

    await proposal.deleteOne();

    // Update job proposal count
    await Job.findByIdAndUpdate(proposal.job, {
      $inc: { proposalCount: -1 },
      $pull: { proposals: proposal._id },
    });

    res.status(200).json({
      success: true,
      message: 'Proposal withdrawn successfully',
    });
  } catch (error) {
    logger.error(`Withdraw proposal error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to withdraw proposal',
      error: error.message,
    });
  }
};