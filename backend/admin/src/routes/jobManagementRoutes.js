
// ============================================
// FILE: backend/admin/src/routes/jobManagementRoutes.js
// ============================================

const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobManagementController');
const { adminAuth } = require('../middlewares/adminAuth');

router.use(adminAuth);

router.get('/projects/pending', jobController.getPendingProjects);
router.get('/projects', jobController.getAllProjects);
router.put('/projects/:projectId/approve', jobController.approveProject);
router.put('/projects/:projectId/reject', jobController.rejectProject);

module.exports = router;