const express = require("express");
const router = express.Router();
const { registerFaceHandler, verifyFaceHandler } = require("./controllers/authController");

// Existing routes
// router.post("/signup", signupHandler);
// router.post("/login", loginHandler);

// 👉 New routes for face auth
router.post("/register-face", registerFaceHandler);
router.post("/verify-face", verifyFaceHandler);

module.exports = router;
