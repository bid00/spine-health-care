import express from 'express';
import {contactForm } from '../controllers/mailController.js';

const router = express.Router();

// contact form 
router.post('/contact',contactForm);

export default router;
