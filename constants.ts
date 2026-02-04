
import { UserRole, User } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Sarah Manager',
    email: 'sarah@trustguard.ai',
    role: UserRole.MANAGER,
    // Fix: Added missing required department property to Sarah Manager
    department: 'Finance',
    avatar: 'https://picsum.photos/seed/sarah/100/100',
    // Fix: Added missing required properties passwordHash and authLevel
    passwordHash: 'password123',
    authLevel: 'LOW'
  },
  {
    id: 'u2',
    name: 'John Employee',
    email: 'john@trustguard.ai',
    role: UserRole.EMPLOYEE,
    // Fix: Added missing required department property to John Employee
    department: 'Finance',
    avatar: 'https://picsum.photos/seed/john/100/100',
    // Fix: Added missing required properties passwordHash and authLevel
    passwordHash: 'password123',
    authLevel: 'LOW'
  },
  {
    id: 'u3',
    name: 'Alice Dev',
    email: 'alice@trustguard.ai',
    role: UserRole.EMPLOYEE,
    // Fix: Added missing required department property to Alice Dev
    department: 'Engineering',
    avatar: 'https://picsum.photos/seed/alice/100/100',
    // Fix: Added missing required properties passwordHash and authLevel
    passwordHash: 'password123',
    authLevel: 'LOW'
  }
];

export const OTP_EXPIRY_SECONDS = 120; // 2 minutes
