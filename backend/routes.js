const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware, adminMiddleware } = require('../utils/auth-middleware');

// Protect all admin routes
router.use(authMiddleware);      // only logged-in users
router.use(adminMiddleware);     // only admins

// Routes
router.get('/dashboard', adminController.getDashboard);          // Admin dashboard stats
router.get('/users', adminController.getAllUsers);              // List all users
router.post('/user/:id/mark', adminController.updateMarks);     // Update marks for a user
router.get('/plagiarism', adminController.getPlagiarismReport); // Get plagiarism report

module.exports = router;
