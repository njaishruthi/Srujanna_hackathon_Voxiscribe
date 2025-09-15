const express = require('express');
const router = express.Router();
const adminController = require('./controllers/adminController'); // <-- fixed path
const { authMiddleware, adminMiddleware } = require('./utils/auth-middleware');

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/dashboard', adminController.getDashboard);
router.get('/users', adminController.getAllUsers);
router.post('/user/:id/mark', adminController.updateMarks);
router.get('/plagiarism', adminController.getPlagiarismReport);

module.exports = router;
