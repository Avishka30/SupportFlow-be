import { Request, Response } from 'express';
import { User, IUser } from '../models/User'; // 1. Import IUser interface
import { generateTokens } from '../utils/tokenUtils';

// --- REGISTER (No Tokens, Just Create User) ---
export const registerUser = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // 1. Validation
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // 2. Check duplicate
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // 3. Create User
        const newUser = new User({ firstName, lastName, email, password });
        await newUser.save();

        // 4. Send Response (NO TOKENS)
        res.status(201).json({
            message: 'User registered successfully. Please login to continue.',
            user: {
                id: newUser._id,
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// --- LOGIN (Generate Tokens Here) ---
export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // 1. Validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // 2. Find User
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // 3. Verify Password
        // FIX: Cast user to IUser so TypeScript sees the comparePassword method
        const isMatch = await (user as IUser).comparePassword(password);
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // 4. Generate Tokens (Access & Refresh)
        const tokens = generateTokens({ id: user._id.toString(), role: user.role });

        // 5. Send Response
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            },
            ...tokens // Returns accessToken and refreshToken
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};