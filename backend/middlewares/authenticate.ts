
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Fix: Cast req and res to any to bypass environment-specific property existence errors (headers, status)
export const authenticate = (req: any, res: any, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      message: 'UNAUTHORIZED: No Identity Token Provided' 
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ 
      success: false, 
      message: 'FORBIDDEN: Session Expired or Compromised' 
    });
  }
};
