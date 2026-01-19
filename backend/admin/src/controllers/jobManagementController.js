// ============================================
// FILE: backend/admin/src/controllers/jobManagementController.js
// ============================================
// jobManagementController.js
const Job = require('../../../user/src/models/Job');
const User = require('../../../user/src/models/User');

exports.getPendingProjects = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const pendingProjects = await Job.find({ 
      status: 'pending_approval' 
    })
    .populate('client', 'name email avatar')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

    const formattedProjects = pendingProjects.map(project => ({
      _id: project._id,
      title: project.title,
      clientName: project.client?.name || 'Unknown Client',
      clientAvatar: project.client?.avatar || '',
      budget: project.budget,
      category: project.category,
      createdAt: project.createdAt
    }));

    res.json(formattedProjects);
  } catch (error) {
    console.error('Get pending projects error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.approveProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = await Job.findByIdAndUpdate(
      projectId,
      { 
        status: 'active',
        approvedBy: req.admin._id,
        approvedAt: new Date()
      },
      { new: true }
    ).populate('client', 'name email');

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // TODO: Send notification to client
    // await notificationService.send(project.client._id, 'project_approved', { project });

    res.json({ message: 'Project approved successfully', project });
  } catch (error) {
    console.error('Approve project error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.rejectProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { reason } = req.body;
    
    const project = await Job.findByIdAndUpdate(
      projectId,
      { 
        status: 'rejected',
        rejectedBy: req.admin._id,
        rejectedAt: new Date(),
        rejectionReason: reason
      },
      { new: true }
    ).populate('client', 'name email');

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // TODO: Send notification to client
    // await notificationService.send(project.client._id, 'project_rejected', { project, reason });

    res.json({ message: 'Project rejected', project });
  } catch (error) {
    console.error('Reject project error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const query = status ? { status } : {};
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [projects, total] = await Promise.all([
      Job.find(query)
        .populate('client', 'name email avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Job.countDocuments(query)
    ]);

    res.json({
      projects,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get all projects error:', error);
    res.status(500).json({ error: error.message });
  }
};