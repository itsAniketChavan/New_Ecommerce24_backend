const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const restrictTo = (roles) => {
  return async (req, res, next) => {
    try {
      // Get token from authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by ID and check role
      const user = await User.findById(decoded.id);
      if (!user || !roles.includes(user.role)) {
        return res.status(403).json({ message: 'Not Uthorized to Access' });
      }

      // Attach user to request
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Unauthorized' });
    }
  };
};

module.exports = restrictTo;
