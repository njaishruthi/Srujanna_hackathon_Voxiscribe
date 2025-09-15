const authMiddleware = (req, res, next) => {
  // Temporary: all requests are authenticated
  req.user = { id: '1', role: 'admin' };
  next();
};

const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access only' });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };
