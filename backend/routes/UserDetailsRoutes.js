// routes/userDetailsRoutes.js
import express from 'express';
import UserDetails from '../models/UserDetailsModel.js';
import User from '../models/UserModel.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).send('Access denied.');

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send('Invalid token.');
        req.user = user;
        next();
    });
};

// GET route to fetch user details
router.get('/', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) return res.status(404).send('User not found.');

        // Fetch user details
        const userDetails = await UserDetails.findOne({ userId });
        if (!userDetails) return res.status(404).send('User details not found.');

        return res.json(userDetails); // Send the user details as response
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching user details.');
    }
});

// POST route to create or update user details
router.post('/', verifyToken, async (req, res) => {
    const { fullName, address, city, district, state, phone, dateOfBirth } = req.body;

    try {
        const userId = req.user.id;

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) return res.status(404).send('User not found.');

        // Check if user details exist, then update or create
        const userDetails = await UserDetails.findOne({ userId });
        if (userDetails) {
            // Update existing user details
            userDetails.fullName = fullName;
            userDetails.address = address;
            userDetails.city = city;
            userDetails.district = district;
            userDetails.state = state;
            userDetails.phone = phone;
            userDetails.dateOfBirth = dateOfBirth;
            await userDetails.save();
            return res.send('User details updated successfully!');
        } else {
            // Create new user details
            const newUserDetails = new UserDetails({
                userId,
                fullName,
                address,
                city,
                district,
                state,
                phone,
                dateOfBirth,
            });
            await newUserDetails.save();
            return res.send('User details created successfully!');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to save user details.');
    }
});

export default router;
