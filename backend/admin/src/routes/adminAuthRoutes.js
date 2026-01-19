// ============================================
// FILE: backend/admin/src/routes/adminAuthRoutes.js
// ============================================
const express = require('express');
const router = express.Router();
const { login, getCurrentAdmin, logout } = require('../controllers/adminAuthController');
const { adminAuth } = require('../middlewares/adminAuth'); // FIXED: Changed from 'protect' to 'adminAuth'

router.post('/login', login);
router.get('/me', adminAuth, getCurrentAdmin); // FIXED: Using adminAuth instead of protect
router.post('/logout', adminAuth, logout); // FIXED: Using adminAuth instead of protect

module.exports = router;