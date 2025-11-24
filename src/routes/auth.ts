// src/routes/auth.ts
import { Router } from 'express';
import { registerUser } from '../controllers/authController';

const router = Router();

router.post('/register', registerUser);
// router.post('/login', loginUser); // Login route to be added later
// router.post('/refresh-token', refreshToken); // Token refresh route to be added later

export default router;