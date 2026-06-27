import express from 'express';
import { google, signin, signup } from '../controllers/auth.controller.js';
import { signupValidation, signinValidation, validate } from '../middleware/validators.js';

const router = express.Router();

router.post('/signup', signupValidation, validate, signup);
router.post('/signin', signinValidation, validate, signin);
router.post('/google', google);

export default router;
