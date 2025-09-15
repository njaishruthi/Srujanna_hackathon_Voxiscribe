const express = require('express');
const router = express.Router();
const examController = require('./controllers/examController');
const { authMiddleware } = require('./utils/auth-middleware');

router.use(authMiddleware); // only logged-in users

router.get('/', examController.getExams);
router.get('/:id', examController.getExamById);

module.exports = router;
