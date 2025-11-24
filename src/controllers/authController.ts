// src/controllers/authController.ts (or src/routes/auth.ts)
import { Request, Response } from 'express';
import { User, IUser } from '../models/User';
import { generateTokens } from '../utils/tokenUtils';

// --- Registration Handler ---
export const registerUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;

  // Basic validation
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    // 1. Create the new user (password is hashed by the pre-save hook)
    const newUser: IUser = new User({
      firstName,
      lastName,
      email,
      password, // Mongoose pre-save hook handles hashing
      role: 'user', // Default 'user' role as requested
    });

    await newUser.save();

    // 2. Generate tokens
    const { accessToken, refreshToken } = generateTokens({
      id: newUser._id.toString(),
      role: newUser.role,
    });

    // 3. Send response
    // NOTE: In a production setup, the refresh token should be stored 
    // in a database (e.g., in a separate Tokens collection) 
    // to manage revocation.
    return res.status(201).json({
      message: 'Registration successful!',
      user: {
        id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
      },
      tokens: { 
          accessToken, 
          refreshToken 
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error during registration.' });
  }
};