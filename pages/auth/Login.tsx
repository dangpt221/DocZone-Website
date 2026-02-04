
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

interface LoginProps {
  onNavigateToRegister: () => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigateToRegister }) => {
  const { login, verifyOTP } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [view, setView] = useState<'LOGIN' | 'OTP'>('LOGIN');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    setTimeout(() => {
      const res = login(email, password);
      if (res.success) {
        if (res.requiresOTP) {
          setPendingUserId(res.userId!);
          setView('OTP');
        }
      } else {
        setError(res.message);
      }
      setLoading(false);
    }, 800);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    setTimeout(() => {
      const res = verifyOTP(pendingUserId!, otp);
      if (!res.success) {
        setError(res.message);
      }
      setLoading(false);
    }, 800);
  };

  const AuthCard = ({ title, subtitle, children }: any) => (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans selection:bg-blue-500/30">
      <div className="bg-slate-900 border border-slate-800 rounded-[3rem] shadow-2xl w-full max-w-md p-12 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] mx-auto flex items-center justify-center text-white text-3xl font-bold mb-6 shadow-lg shadow-blue-500/20 ring-4 ring-blue-500/10">T</div>
          <h1 className="text-2xl font-black text-white tracking-tight leading-tight uppercase">{title}</h1>
          <p className="text-slate-500 mt-2 text-[10px] font-black uppercase tracking-[0.2em]">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );

  if (view === 'OTP') {
    return (
      <AuthCard title="Xác thực Identity" subtitle="Identity Verification Required">
        <form onSubmit={handleVerify} className="space-y-8">
          <div className="text-center space-y-3">
            <p className="text-slate-300 font-semibold text-sm">Nhập mã 6 chữ số / Enter 6-digit code.</p>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest italic">Kiểm tra Console để lấy mã / Check console</p>
          </div>
          <input 
            autoFocus
            type="text" 
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6} 
            placeholder="000000" 
            value={otp} 
            onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} 
            className="text-center text-6xl tracking-[0.25em] font-mono font-black w-full p-8 bg-slate-800 border-none rounded-[2.5rem] text-blue-400 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all shadow-inner" 
            required 
          />
          {error && <p className="text-red-500 text-xs text-center font-bold bg-red-500/10 py-3 rounded-2xl border border-red-500/20">{error}</p>}
          <Button type="submit" loading={loading} className="w-full py-5">
            Xác thực / Verify & Access
          </Button>
          <button 
            type="button" 
            onClick={() => setView('LOGIN')} 
            className="w-full text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
          >
            Quay lại / Go Back
          </button>
        </form>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Truy cập Bảo mật" subtitle="Zero Trust Gateway Entry">
      <form onSubmit={handleLogin} className="space-y-6">
        <Input 
          label="Địa chỉ Email" 
          labelEn="Email Address" 
          type="email" 
          autoFocus
          placeholder="name@company.com" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <Input 
          label="Mật khẩu" 
          labelEn="Password" 
          type="password" 
          placeholder="••••••••" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        {error && <p className="text-red-400 text-xs text-center font-bold bg-red-400/10 py-3 rounded-2xl border border-red-400/20">{error}</p>}
        
        <div className="space-y-4 pt-2">
          <Button type="submit" loading={loading} className="w-full py-5">
            Đăng nhập / Connect Securely
          </Button>
          
          <div className="relative py-2 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
            <span className="relative px-4 bg-slate-900 text-[10px] font-black text-slate-600 uppercase">Hoặc / Or</span>
          </div>

          <button 
            type="button"
            className="w-full py-4 bg-white text-slate-900 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-100 transition-all text-[11px] uppercase tracking-wider"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="google" />
            Google OAuth 2.0
          </button>

          <button 
            type="button" 
            onClick={onNavigateToRegister}
            className="w-full text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-blue-400 transition-colors"
          >
            Chưa có quyền truy cập? Đăng ký / Register
          </button>
        </div>
      </form>
    </AuthCard>
  );
};
