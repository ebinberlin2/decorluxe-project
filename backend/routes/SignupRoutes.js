import express from "express";
import { signup } from '../controllers/SignupController.js';

const router = express.Router();

router.post('/', signup);

export default router;