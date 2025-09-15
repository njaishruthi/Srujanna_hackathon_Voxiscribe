-- ============================================
-- VoxiScribe / Scribe_Chanyaka Database Setup
-- ============================================

-- 1️⃣ Create database
CREATE DATABASE IF NOT EXISTS voxiscribe;
USE voxiscribe;

-- 2️⃣ Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  marks INT DEFAULT 0,
  edit_count INT DEFAULT 0,
  plagiarismScore FLOAT DEFAULT 0
);

-- 3️⃣ Exams table
CREATE TABLE IF NOT EXISTS exams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4️⃣ Sample data for users
INSERT INTO users (name, email, password, marks, edit_count, plagiarismScore)
VALUES 
('Test User', 'test@example.com', 'password123', 50, 0, 0.2),
('Alice', 'alice@example.com', 'alicepass', 75, 1, 0.1),
('Bob', 'bob@example.com', 'bobpass', 60, 2, 0.05);

-- 5️⃣ Sample data for exams
INSERT INTO exams (title)
VALUES
('Math Exam'),
('Science Exam'),
('English Exam');

-- ============================================
-- Database ready for Scribe_Chanyaka backend
-- ============================================
