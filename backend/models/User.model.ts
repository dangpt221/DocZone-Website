
import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['ADMIN', 'MANAGER', 'EMPLOYEE'], 
    default: 'EMPLOYEE' 
  },
  department: { type: String, required: true },
  authLevel: { 
    type: String, 
    enum: ['LOW', 'HIGH', 'CRITICAL'], 
    default: 'LOW' 
  },
  isLocked: { type: Boolean, default: false },
  mfaEnabled: { type: Boolean, default: true },
  lastLogin: { type: Date }
}, { timestamps: true });

export const UserModel = model('User', UserSchema);
