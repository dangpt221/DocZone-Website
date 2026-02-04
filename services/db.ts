
import { AppState, Document, DocumentRequest, AuditLog, OTPRequest, User, UserRole, RequestStatus, AuthLevel, SystemSettings } from '../types';

class MockDatabase {
  private state: AppState = {
    currentUser: null,
    settings: {
      otpEnforcedForManagers: true,
      otpExpirySeconds: 120,
      loginFailureLimit: 5
    },
    users: [
      {
        id: 'u1',
        name: 'Sarah Manager',
        email: 'manager@trustguard.ai',
        role: UserRole.MANAGER,
        department: 'Finance',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        passwordHash: 'password123',
        authLevel: 'LOW',
        isLocked: false,
        lastLogin: Date.now() - 3600000
      },
      {
        id: 'u4',
        name: 'Super Admin',
        email: 'admin@trustguard.ai',
        role: UserRole.ADMIN,
        department: 'System',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
        passwordHash: 'admin123',
        authLevel: 'LOW',
        isLocked: false,
        lastLogin: Date.now()
      }
    ],
    documents: [],
    requests: [],
    otps: [],
    auditLogs: []
  };

  getCurrentUser() { return this.state.currentUser; }
  
  register(name: string, email: string, passwordHash: string) {
    const existing = this.state.users.find(u => u.email === email);
    if (existing) return { success: false, message: 'Email đã được đăng ký / Email already exists' };

    const newUser: User = {
      id: `u${Date.now()}`,
      name,
      email,
      role: UserRole.EMPLOYEE, // Bắt buộc là EMPLOYEE khi đăng ký công khai
      department: 'Finance',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      passwordHash,
      authLevel: 'LOW',
      isLocked: false
    };

    this.state.users.push(newUser);
    this.logAction(newUser, 'REGISTER_ACCOUNT', 'SUCCESS');
    return { success: true };
  }

  login(email: string, passwordHash: string) {
    const user = this.state.users.find(u => u.email === email);
    if (!user) {
      this.logAction({ name: 'Unknown', email } as User, 'LOGIN_ATTEMPT', 'FAILURE');
      return { success: false, message: 'Thông tin không chính xác / Invalid credentials' };
    }

    if (user.isLocked) return { success: false, message: 'Tài khoản đã bị khóa / Account is locked' };

    if (user.passwordHash === passwordHash) {
      const isPrivileged = user.role === UserRole.ADMIN || user.role === UserRole.MANAGER;
      
      if (isPrivileged) {
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        this.state.otps.push({
          id: `otp-${Date.now()}`,
          userId: user.id,
          otpHash: otpCode,
          expiresAt: Date.now() + 300000,
          used: false,
          type: 'LOGIN'
        });
        console.log(`[ZERO-TRUST] MFA OTP for ${user.role}: ${otpCode}`);
        return { success: true, requiresOTP: true, userId: user.id };
      }

      user.lastLogin = Date.now();
      this.state.currentUser = { ...user, authLevel: 'LOW' };
      this.logAction(user, 'LOGIN_SUCCESS', 'SUCCESS');
      return { success: true, requiresOTP: false, user: this.state.currentUser };
    }
    
    this.logAction(user, 'LOGIN_FAILURE', 'FAILURE');
    return { success: false, message: 'Thông tin không chính xác / Invalid credentials' };
  }

  verifyLoginOTP(userId: string, code: string) {
    const user = this.state.users.find(u => u.id === userId);
    if (!user) return { success: false, message: 'Người dùng không tồn tại / User not found' };

    const otp = this.state.otps.find(o => 
      o.userId === userId && o.type === 'LOGIN' && !o.used && o.expiresAt > Date.now()
    );

    if (otp && otp.otpHash === code) {
      otp.used = true;
      user.lastLogin = Date.now();
      this.state.currentUser = { ...user, authLevel: 'HIGH' }; // Nâng cấp quyền sau OTP
      this.logAction(user, 'OTP_VERIFICATION', 'SUCCESS');
      return { success: true, user: this.state.currentUser };
    }

    this.logAction(user, 'OTP_VERIFICATION', 'FAILURE');
    return { success: false, message: 'Mã không đúng hoặc hết hạn / Invalid or expired code' };
  }

  logout() {
    if (this.state.currentUser) {
      this.logAction(this.state.currentUser, 'LOGOUT', 'SUCCESS');
      this.state.currentUser = null;
    }
  }

  getAuditLogs() {
    return this.state.auditLogs.sort((a, b) => b.timestamp - a.timestamp);
  }

  private logAction(user: User, action: string, status: 'SUCCESS' | 'FAILURE', documentId?: string) {
    this.state.auditLogs.push({
      id: `log-${Date.now()}`,
      userId: user.id || 'system',
      userName: user.name || 'System',
      action,
      status,
      ip: '10.0.0.' + Math.floor(Math.random() * 255),
      timestamp: Date.now(),
      documentId
    });
  }
}

export const db = new MockDatabase();
