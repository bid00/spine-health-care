import express from "express";
import { changePassword, deleteAccount, getProfile, updateProfile } from "../controllers/userController.js";
import upload from "../middlewares/uploadMiddleware.js";
const router = express.Router();

//@desc Get Profile
router.get('/profile',getProfile);

//@desc Update Profile
router.patch('/update',upload.single("picture"),updateProfile);

//@desc change Password
router.patch('/changepassword',changePassword);

//@desc delete account
router.post('/deleteaccount',deleteAccount);


export default router;