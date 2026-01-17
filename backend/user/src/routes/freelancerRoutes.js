// ============================================
// FILE: backend/user/src/routes/freelancerRoutes.js
// ============================================
const express = require('express');
const router = express.Router();
const {
  getFreelancers,
  getFreelancerById,
  getFeaturedFreelancers,
  getAllSkills,
  searchBySkill,
} = require('../controllers/freelancerController');

// Public routes - no authentication required

// Get all freelancers with filters and pagination
router.get('/', getFreelancers);

// Get featured/top freelancers
router.get('/featured', getFeaturedFreelancers);

// Get all unique skills
router.get('/skills/all', getAllSkills);

// Search freelancers by skill
router.get('/search/skills', searchBySkill);

// Get single freelancer by ID
router.get('/:id', getFreelancerById);

module.exports = router;