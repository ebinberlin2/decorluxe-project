import express from "express";
import { sendSignupOtp, verifySignupOtp } from '../controllers/signupController.js';

const router = express.Router();

router.post('/send-otp', sendSignupOtp);

// Route for verifying OTP and completing signup
router.post('/verify-otp', verifySignupOtp);

// Route for sending OTP

export default router;
