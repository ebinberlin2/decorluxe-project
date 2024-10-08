import User from '../models/UserModel.js';
import Seller from '../models/SellerModel.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    const seller = await Seller.findOne({ email });

    if (!user && !seller) {
      return res.status(404).json({ message: 'Account not found' });
    }

    const account = user || seller;  // Use the found account
    const role = user ? 'user' : 'seller';

    const isMatch = await argon2.verify(account.password, password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: account._id, email: account.email, role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const userData = {
      id: account._id,
      email: account.email,
      firstName: account.firstName,
      lastName: account.lastName,
    };

    res.status(200).json({
      message: 'Login successful',
      token,
      role,
      account: userData,
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
