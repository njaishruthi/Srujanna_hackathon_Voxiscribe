const { db } = require('../utils/config');

const examController = {};

// Get all exams
examController.getExams = (req, res) => {
  db.query('SELECT id, title, questions, createdAt FROM exam', (err, exams) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Unable to fetch exams' });
    }

    // Parse questions JSON
    const formattedExams = exams.map(exam => ({
      ...exam,
      questions: JSON.parse(exam.questions || '[]')
    }));

    res.json({ success: true, data: formattedExams });
  });
};

// Get exam by ID
examController.getExamById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT id, title, questions, createdAt FROM exam WHERE id = ?', [id], (err, exams) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Unable to fetch exam' });
    }

    if (exams.length === 0) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    const exam = exams[0];
    exam.questions = JSON.parse(exam.questions || '[]');

    res.json({ success: true, data: exam });
  });
};

module.exports = examController;
