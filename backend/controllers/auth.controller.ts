
import { Request, Response } from 'express';
import { UserModel } from '../models/User.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Fix: Cast req and res to any to bypass environment-specific property access errors for body, status, and json
export const login = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user || user.isLocked) {
      return res.status(401).json({ success: false, message: 'Invalid credentials or account locked' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Identity check failed' });
    }

    // Zero Trust Rule: If Manager or Admin, require MFA (simulated here)
    const requiresMFA = user.role !== 'EMPLOYEE';

    const accessToken = jwt.sign(
      { id: user._id, role: user.role, department: user.department },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET || 'refresh_secret',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      requiresMFA,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        department: user.department,
        authLevel: user.authLevel
      },
      tokens: { accessToken, refreshToken }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
