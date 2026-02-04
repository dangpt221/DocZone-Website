
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
  department: string; // Added for ABAC
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

export interface Document {
  id: string;
  title: string;
  description: string;
  department: string; // Added for ABAC
  ownerId: string;
  createdAt: number;
  encryptedContent: string;
  mimeType: string;
  size: number;
}

export interface DocumentRequest {
  id: string;
  documentId: string;
  userId: string;
  status: RequestStatus;
  requestedAt: number;
  approvedBy?: string;
  approvedAt?: number;
}

export interface OTPRequest {
  id: string;
  userId: string;
  documentId?: string;
  otpHash: string; 
  expiresAt: number;
  used: boolean;
  type: 'LOGIN' | 'DOCUMENT';
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  documentId?: string;
  documentTitle?: string;
  action: string;
  ip: string;
  status: 'SUCCESS' | 'FAILURE';
  timestamp: number;
}

export interface AppState {
  currentUser: User | null;
  users: User[];
  documents: Document[];
  requests: DocumentRequest[];
  otps: OTPRequest[];
  auditLogs: AuditLog[];
  settings: SystemSettings;
}
