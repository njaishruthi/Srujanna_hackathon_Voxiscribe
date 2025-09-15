// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database/db"); // MySQL connection

// POST /register
async function register(req, res) {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // check if user already exists
    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // save user
    await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role]
    );

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("❌ Register error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// POST /login
async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (!users || users.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = users[0];

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "defaultsecret", // fallback in case .env not set
      { expiresIn: "1h" }
    );

    return res.json({
      message: "Login successful",
      token,
      role: user.role,
      name: user.name,
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = { register, login };
