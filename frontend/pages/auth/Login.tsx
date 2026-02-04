
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

interface LoginProps {
  onNavigateToRegister: () => void;
  onNavigateToOTP: (userId: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigateToRegister, onNavigateToOTP }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    setTimeout(() => {
      const res = login(email, password);
      if (res.success) {
        if (res.requiresOTP) {
          onNavigateToOTP(res.userId!);
        }
      } else {
        setError(res.message);
      }
      setLoading(false);
    }, 1000);
  };

  const testAccounts = [
    { role: 'Manager', email: 'manager@trustguard.ai', pass: 'pass123', otp: 'Yes' },
    { role: 'Staff', email: 'staff@trustguard.ai', pass: 'pass123', otp: 'Yes' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 selection:bg-blue-500/30 font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-[3rem] shadow-2xl w-full max-w-md p-10 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg shadow-blue-500/20">T</div>
          <h1 className="text-xl font-black text-white uppercase tracking-tight">Truy cập Hệ thống</h1>
          <p className="text-slate-500 mt-2 text-[10px] font-black uppercase tracking-widest">Secure Gateway Entry</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <Input 
            label="Email" labelEn="Email Address"
            type="email" placeholder="name@company.com"
            required autoFocus
            value={email} onChange={e => setEmail(e.target.value)}
          />
          <Input 
            label="Mật khẩu" labelEn="Password"
            type="password" placeholder="••••••••"
            required
            value={password} onChange={e => setPassword(e.target.value)}
          />
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-4 rounded-2xl font-bold text-center">
              {error}
            </div>
          )}
          
          <Button type="submit" loading={loading} className="w-full py-5">Đăng nhập / Sign In</Button>

          <button 
            type="button" onClick={onNavigateToRegister}
            className="w-full text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-blue-400 transition-colors"
          >
            Chưa có tài khoản? Đăng ký / Register
          </button>
        </form>
      </div>

      {/* Test Credentials Helper */}
      <div className="mt-10 w-full max-w-md bg-slate-900/50 border border-slate-800 p-6 rounded-[2rem] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">Tài khoản dùng thử / Test Credentials</h3>
          <span className="bg-blue-500/10 text-blue-400 text-[8px] px-2 py-0.5 rounded-full font-bold">MFA ENFORCED FOR ALL</span>
        </div>
        <div className="space-y-3">
          {testAccounts.map((acc, i) => (
            <div key={i} className="flex items-center justify-between text-[11px] p-3 rounded-xl bg-slate-950/50 border border-slate-800">
              <div className="flex flex-col">
                <span className="text-blue-400 font-black uppercase text-[9px] mb-0.5">{acc.role}</span>
                <span className="text-slate-300 font-mono">{acc.email}</span>
              </div>
              <div className="text-right flex flex-col items-end">
                <div className="flex gap-2 mb-1">
                  <span className="text-slate-500">Pass:</span>
                  <span className="text-slate-300 font-mono">{acc.pass}</span>
                </div>
                <span className="bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded text-[8px] font-bold">
                  OTP REQUIRED
                </span>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[9px] text-slate-500 text-center italic">Lấy mã OTP tại Console (F12) sau khi nhấn Đăng nhập</p>
      </div>
    </div>
  );
};
