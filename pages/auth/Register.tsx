
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
        alert('Đăng ký thành công! / Registration Successful!');
        onBackToLogin();
      } else {
        setError(res.message);
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 selection:bg-blue-500/30">
      <div className="bg-slate-900 border border-slate-800 rounded-[3rem] shadow-2xl w-full max-w-md p-12">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] mx-auto flex items-center justify-center text-white text-3xl font-bold mb-6 shadow-lg shadow-blue-500/20">T</div>
          <h1 className="text-2xl font-black text-white tracking-tight uppercase">Tạo Tài Khoản</h1>
          <p className="text-slate-500 mt-2 text-[10px] font-black uppercase tracking-widest">Create Identity Account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="Họ và Tên" labelEn="Full Name"
            placeholder="Nguyen Van A"
            required autoFocus
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
          <Input 
            label="Địa chỉ Email" labelEn="Email Address"
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
            label="Xác nhận Mật khẩu" labelEn="Confirm Password"
            type="password" placeholder="••••••••"
            required
            value={formData.confirmPassword}
            onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
          />

          {error && <p className="text-red-400 text-xs text-center font-bold bg-red-400/10 py-3 rounded-2xl border border-red-400/20">{error}</p>}

          <Button type="submit" loading={loading} className="w-full py-5">
            Đăng ký / Register
          </Button>

          <button 
            type="button" 
            onClick={onBackToLogin}
            className="w-full text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
          >
            Đã có tài khoản? Đăng nhập / Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};
