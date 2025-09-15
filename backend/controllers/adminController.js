const { db } = require('../utils/config');
const { formatPlagiarismScore } = require('../utils/plagiarism');

const adminController = {};

// Dashboard
adminController.getDashboard = (req, res) => {
  db.query('SELECT COUNT(*) AS count FROM users', (err, totalUsers) => {
    if (err) return res.status(500).json({ success: false, message: 'Server Error' });

    db.query('SELECT COUNT(*) AS count FROM exam', (err2, totalExams) => {
      if (err2) return res.status(500).json({ success: false, message: 'Server Error' });

      res.json({
        success: true,
        data: {
          totalUsers: totalUsers[0].count,
          totalExams: totalExams[0].count,
        },
      });
    });
  });
};

// All users
adminController.getAllUsers = (req, res) => {
  db.query('SELECT id, name, email, marks, edit_count, plagiarismScore FROM users', (err, users) => {
    if (err) return res.status(500).json({ success: false, message: 'Unable to fetch users' });

    const formattedUsers = users.map(u => ({
      ...u,
      plagiarismScore: formatPlagiarismScore(u.plagiarismScore),
    }));

    res.json({ success: true, data: formattedUsers });
  });
};

// Update marks
adminController.updateMarks = (req, res) => {
  const { id } = req.params;
  const { marks } = req.body;

  if (typeof marks !== 'number') {
    return res.status(400).json({ success: false, message: 'Marks must be a number' });
  }

  db.query('UPDATE users SET marks = ?, edit_count = edit_count + 1 WHERE id = ?', [marks, id], (err) => {
    if (err) return res.status(500).json({ success: false, message: 'Unable to update marks' });

    res.json({ success: true, message: 'Marks updated successfully' });
  });
};

// Plagiarism report
adminController.getPlagiarismReport = (req, res) => {
  db.query('SELECT id, name, email, plagiarismScore FROM users', (err, users) => {
    if (err) return res.status(500).json({ success: false, message: 'Unable to fetch plagiarism report' });

    const formattedUsers = users.map(u => ({
      ...u,
      plagiarismScore: formatPlagiarismScore(u.plagiarismScore),
    }));

    res.json({ success: true, data: formattedUsers });
  });
};

module.exports = adminController;
