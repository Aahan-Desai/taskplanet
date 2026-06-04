import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

// Extend the Express Request interface to include the authenticated user model
export interface AuthRequest extends Request {
  user?: IUser;
}

interface JwtPayload {
  id: string;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token;

  // Check if token exists in Authorization header (Bearer <token>)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from string
      token = req.headers.authorization.split(' ')[1];

      // Verify the token signature
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

      // Fetch the user from database and attach to request (exclude password)
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        res.status(401).json({ message: 'Not authorized, user not found' });
        return;
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token validation failed' });
      return;
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
    return;
  }
};