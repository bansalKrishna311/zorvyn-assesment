const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) return res.status(401).json({ msg: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('isActive role');
    if (!user) {
      return res.status(401).json({ msg: 'User not found' });
    }

    if (!user.isActive) {
      return res.status(403).json({ msg: 'User is inactive' });
    }

    req.user = decoded;
    req.user.role = user.role;
    next();
  } catch {
    res.status(401).json({ msg: 'Invalid token' });
  }
};