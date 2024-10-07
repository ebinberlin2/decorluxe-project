// routes/userDetailsRoutes.js
import express from 'express';
import authMiddleware from '../middleware/authenticateToken.js'; // Middleware to check token
import UserDetails from '../models/UserDetailsModel.js';

const router = express.Router();

// Fetch user details
router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Assuming req.user is populated by authMiddleware
        const userDetails = await UserDetails.findOne({ userId });

        if (!userDetails) {
            return res.status(404).json({ message: 'User details not found' });
        }

        res.status(200).json(userDetails);
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create or update user details
router.post('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { address, phone, dateOfBirth } = req.body;

        let userDetails = await UserDetails.findOne({ userId });

        if (userDetails) {
            // Update existing user details
            userDetails.address = address;
            userDetails.phone = phone;
            userDetails.dateOfBirth = dateOfBirth;
            await userDetails.save();
            return res.status(200).json({ message: 'User details updated successfully' });
        } else {
            // Create new user details
            userDetails = new UserDetails({ userId, address, phone, dateOfBirth });
            await userDetails.save();
            return res.status(201).json({ message: 'User details created successfully' });
        }
    } catch (error) {
        console.error("Error saving user details:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/', authMiddleware, async (req, res) => {
    const { userId, address, phone, dateOfBirth } = req.body;

    try {
        const userDetails = new UserDetails({
            userId,
            address,
            phone,
            dateOfBirth,
        });

        await userDetails.save();
        res.status(201).json({ message: 'User details saved successfully', userDetails });
    } catch (error) {
        console.error("Error saving user details:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
