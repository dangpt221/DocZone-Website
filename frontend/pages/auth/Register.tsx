
import React, { useState } from 'react';
import { db } from '../../services/db';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

interface RegisterProps {
  onBackToLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onBackToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu không khớp / Passwords do not match');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = db.register(formData.name, formData.email, formData.password);
      if (res.success) {
        alert('Đăng ký định danh thành công! / Identity registration successful!');
        onBackToLogin();
      } else {
        setError(res.message);
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 selection:bg-blue-500/30">
      <div className="bg-slate-900 border border-slate-800 rounded-[3rem] shadow-2xl w-full max-w-md p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center text-white text-3xl font-bold mb-4">T</div>
          <h1 className="text-xl font-black text-white uppercase tracking-tight">Tạo Định Danh</h1>
          <p className="text-slate-500 mt-2 text-[10px] font-black uppercase tracking-widest">Register New Identity</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Họ và Tên" labelEn="Full Name"
            placeholder="Nguyen Van A"
            required autoFocus
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
          <Input 
            label="Email" labelEn="Email Address"
            type="email" placeholder="name@company.com"
            required
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
          <Input 
            label="Mật khẩu" labelEn="Password"
            type="password" placeholder="••••••••"
            required
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
          />
          <Input 
            label="Xác nhận" labelEn="Confirm Password"
            type="password" placeholder="••••••••"
            required
            value={formData.confirmPassword}
            onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
          />

          <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
            <p className="text-[9px] text-blue-400 font-bold uppercase leading-relaxed italic">
              * Mặc định: Nhân viên / Role Default: Employee. 
              Admin/Manager requires manual hardening.
            </p>
          </div>

          {error && <p className="text-red-400 text-xs text-center font-bold bg-red-400/10 py-3 rounded-xl border border-red-400/20">{error}</p>}

          <Button type="submit" loading={loading} className="w-full py-5 mt-2">Xác nhận Đăng ký / Confirm</Button>

          <button 
            type="button" onClick={onBackToLogin}
            className="w-full text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
          >
            Đã có tài khoản? / Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};
