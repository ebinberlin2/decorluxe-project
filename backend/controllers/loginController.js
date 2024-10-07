import User from '../models/UserModel.js';
import Seller from '../models/SellerModel.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // First, try finding the user by email in both User and Seller collections
    const user = await User.findOne({ email });
    const seller = await Seller.findOne({ email });

    // Check if the account is either a user or a seller
    if (!user && !seller) {
      return res.status(404).json({ message: 'Account not found' });
    }

    const account = user || seller;  // Determine whether it's a user or seller
    const role = user ? 'user' : 'seller'; // Identify the role for JWT

    // Verify the password using argon2
    const isMatch = await argon2.verify(account.password, password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token on successful login
    const token = jwt.sign(
      { id: account._id, email: account.email, role }, // Add the role in the payload
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }  // Token expiration (adjust as needed)
    );

    // Retrieve additional user or seller data
    const userData = {
      id: account._id,
      email: account.email,
      firstName: account.firstName,
      lastName: account.lastName,
      // Include any other necessary fields
    };

    // Send response with token and user/seller data (omit password)
    res.status(200).json({
      message: 'Login successful',
      token,
      role,  // Pass the role directly in the response
      account: userData, // Return the user or seller data
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
