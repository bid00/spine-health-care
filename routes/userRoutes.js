import express from "express";
import { changePassword, deleteAccount, getProfile, updateProfile } from "../controllers/userController.js";
import upload from "../middlewares/uploadMiddleware.js";
const router = express.Router();

// Get Profile
router.get('/profile',getProfile);

// Update Profile
router.patch('/update',upload.single("picture"),updateProfile);

// change Password
router.patch('/changepassword',changePassword);

// delete account
router.post('/deleteaccount',deleteAccount);


export default router;