import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';

// 1. Extend the Express Request to include 'user'
// This fixes the TypeScript error: "Property 'user' does not exist on type 'Request'"
export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  // 1. Check if the "Authorization" header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 2. Get the token from the header (Bearer <token>)
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify the token
      // Make sure 'JWT_SECRET' matches what you used in your Login controller
      // Use JWT_ACCESS_SECRET to match your tokenUtils file
    const decoded: any = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);

      // 4. Get the User from the database (exclude password)
      // We attach this user to the 'req' object so the Controller can use it
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Move to the next piece of middleware (the Controller)

    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // 5. If no token was found at all
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};