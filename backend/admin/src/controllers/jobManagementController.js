// ============================================
// FILE: backend/admin/src/controllers/jobManagementController.js
// FIXED: Use admin backend's own models
// ============================================
const Job = require('../models/Job');  // ✅ Use local model
const User = require('../models/User'); // ✅ Use local model

exports.getPendingProjects = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const pendingProjects = await Job.find({ 
      status: 'pending_approval' 
    })
    .populate('client', 'firstName lastName email profilePicture') // ✅ Fixed field names
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

    const formattedProjects = pendingProjects.map(project => ({
      _id: project._id,
      title: project.title,
      clientName: project.client ? `${project.client.firstName} ${project.client.lastName}` : 'Unknown Client',
      clientAvatar: project.client?.profilePicture || '',
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
    ).populate('client', 'firstName lastName email');

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

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
    ).populate('client', 'firstName lastName email');

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

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
        .populate('client', 'firstName lastName email profilePicture')
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