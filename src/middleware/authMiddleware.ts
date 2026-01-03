import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify the token
      const decoded: any = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);
      
      req.user = await User.findById(decoded.id).select('-password');
      next();

    } catch (error: any) {
      // 1. Handle Expired Token Gracefully (No giant error log)
      if (error.name === 'TokenExpiredError') {
        console.log("ℹ️ Token expired. Frontend should auto-refresh.");
        res.status(401).json({ message: 'Not authorized, token expired' });
        return; // Stop here
      }

      // 2. Handle Other Errors (Invalid signature, etc.)
      console.error("❌ Auth Verification Failed:", error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};