
import { AppState, User, UserRole, AuditLog, OTPRequest, AuthLevel } from '../types';

class MockDatabase {
  private state: AppState = {
    currentUser: null,
    settings: {
      otpEnforcedForManagers: true,
      otpExpirySeconds: 300,
      loginFailureLimit: 5
    },
    users: [
      {
        id: 'u_admin',
        name: 'System Admin',
        email: 'admin@trustguard.ai',
        role: UserRole.ADMIN,
        department: 'Security',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
        passwordHash: 'pass123',
        authLevel: 'LOW',
        isLocked: false
      },
      {
        id: 'u_manager',
        name: 'Sarah Manager',
        email: 'manager@trustguard.ai',
        role: UserRole.MANAGER,
        department: 'Finance',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        passwordHash: 'pass123',
        authLevel: 'LOW',
        isLocked: false
      },
      {
        id: 'u_staff',
        name: 'Alex Staff',
        email: 'staff@trustguard.ai',
        role: UserRole.EMPLOYEE,
        department: 'Operations',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        passwordHash: 'pass123',
        authLevel: 'LOW',
        isLocked: false
      }
    ],
    otps: [],
    auditLogs: []
  };

  getCurrentUser() { return this.state.currentUser; }

  register(name: string, email: string, passwordHash: string) {
    const existing = this.state.users.find(u => u.email === email);
    if (existing) return { success: false, message: 'Email đã tồn tại / Email already exists' };

    const newUser: User = {
      id: `u${Date.now()}`,
      name,
      email,
      role: UserRole.EMPLOYEE,
      department: 'General',
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
    
    if (!user || user.passwordHash !== passwordHash) {
      this.logAction({ name: 'Unknown', email } as User, 'LOGIN_ATTEMPT', 'FAILURE');
      return { success: false, message: 'Thông tin không chính xác / Invalid credentials' };
    }

    if (user.isLocked) return { success: false, message: 'Tài khoản đã bị khóa / Account locked' };

    // Zero Trust Policy Update: ALL roles now require OTP verification
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    this.state.otps.push({
      id: `otp-${Date.now()}`,
      userId: user.id,
      otpHash: otpCode,
      expiresAt: Date.now() + 300000,
      used: false,
      type: 'LOGIN'
    });
    
    // Log OTP to console for simulation
    console.log(`%c[ZERO-TRUST GATEWAY] MFA OTP FOR ${user.role} (${user.name}): ${otpCode}`, "color: #3b82f6; font-weight: bold; font-size: 14px; border: 1px solid #3b82f6; padding: 4px 8px; border-radius: 4px;");
    
    this.logAction(user, 'MFA_REQUIRED', 'SUCCESS');
    return { success: true, requiresOTP: true, userId: user.id };
  }

  verifyOTP(userId: string, code: string) {
    const user = this.state.users.find(u => u.id === userId);
    if (!user) return { success: false, message: 'Lỗi định danh / Identity error' };

    const otp = this.state.otps.find(o => 
      o.userId === userId && o.type === 'LOGIN' && !o.used && o.expiresAt > Date.now()
    );

    if (otp && otp.otpHash === code) {
      otp.used = true;
      this.state.currentUser = { ...user, authLevel: 'HIGH' }; // Promote to HIGH trust session
      this.logAction(user, 'MFA_VERIFIED', 'SUCCESS');
      return { success: true, user: this.state.currentUser };
    }

    this.logAction(user, 'MFA_VERIFIED', 'FAILURE');
    return { success: false, message: 'Mã không đúng hoặc đã hết hạn / Invalid or expired OTP' };
  }

  logout() {
    if (this.state.currentUser) {
      this.logAction(this.state.currentUser, 'TERMINATE_SESSION', 'SUCCESS');
      this.state.currentUser = null;
    }
  }

  getAuditLogs() { return [...this.state.auditLogs].reverse(); }

  private logAction(user: User, action: string, status: 'SUCCESS' | 'FAILURE') {
    this.state.auditLogs.push({
      id: `log-${Date.now()}`,
      userId: user.id || 'anonymous',
      userName: user.name || 'Anonymous',
      action,
      status,
      ip: '10.0.0.' + Math.floor(Math.random() * 255),
      timestamp: Date.now()
    });
  }
}

export const db = new MockDatabase();
