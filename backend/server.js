require('dotenv').config();
const express = require('express');
const cors = require('cors');
const examRoutes = require('./examRoutes'); // add this line
const bodyParser = require('body-parser');
const adminRoutes = require('./adminRoutes'); // make sure path is correct
const { connectDB } = require('./utils/config');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/exams', examRoutes); // add this line



// Connect DB
connectDB();

// Routes
app.use('/api/admin', adminRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('✅ VoxiScribe Backend is running...');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});