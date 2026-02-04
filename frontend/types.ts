
export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE'
}

export enum RequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export type AuthLevel = 'LOW' | 'HIGH' | 'CRITICAL';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar: string;
  passwordHash: string;
  authLevel: AuthLevel;
  isLocked?: boolean;
  lastLogin?: number;
}

export interface SystemSettings {
  otpEnforcedForManagers: boolean;
  otpExpirySeconds: number;
  loginFailureLimit: number;
}

export interface OTPRequest {
  id: string;
  userId: string;
  otpHash: string; 
  expiresAt: number;
  used: boolean;
  type: 'LOGIN' | 'DOCUMENT';
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  ip: string;
  status: 'SUCCESS' | 'FAILURE';
  timestamp: number;
}

export interface AppState {
  currentUser: User | null;
  users: User[];
  otps: OTPRequest[];
  auditLogs: AuditLog[];
  settings: SystemSettings;
}
