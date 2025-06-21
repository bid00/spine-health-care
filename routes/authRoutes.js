import express from "express";
import { login,register } from "../controllers/authController.js";
const router = express.Router();

// register new user
router.post("/signup",register);

// login existing user
router.post("/login",login);

export default router;

