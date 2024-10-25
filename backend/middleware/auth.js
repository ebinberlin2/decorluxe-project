import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authMiddleware = (req, res, next) => {
  // Retrieve token from the Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token and extract the user data
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // Attach userId to the request for use in subsequent middleware/controllers
    next(); // Proceed to the next middleware/controller
  } catch (error) {
    console.error('Invalid token:', error);
    res.status(403).json({ message: 'Invalid token.' });
  }
};

export default authMiddleware;
