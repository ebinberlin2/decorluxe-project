import User from '../models/UserModel.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Password received for login:', password);  // Debugging line

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user);  // Debugging line

    // Verify the password
    const isMatch = await argon2.verify(user.password, password);
    console.log('Password verification result during login:', isMatch);  // Debugging line

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h', // Token expiration time (can be adjusted)
    });

    // Send response with the token
    res.status(200).json({
      message: 'Login successful',
      token, // Include the token in the response
      user: {
        id: user._id,
        email: user.email,
        // Optionally add more user data if needed
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
