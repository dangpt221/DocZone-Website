
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

interface VerifyOTPProps {
  userId: string;
  onBack: () => void;
}

export const VerifyOTP: React.FC<VerifyOTPProps> = ({ userId, onBack }) => {
  const { verifyOTP } = useAuth();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    setTimeout(() => {
      const res = verifyOTP(userId, otp);
      if (!res.success) {
        setError(res.message);
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 selection:bg-blue-500/30 font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-[3rem] shadow-2xl w-full max-w-md p-10 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg shadow-blue-500/20">OTP</div>
          <h1 className="text-xl font-black text-white uppercase tracking-tight">Xác thực Identity</h1>
          <p className="text-slate-500 mt-2 text-[10px] font-black uppercase tracking-widest">Multi-Factor Authentication</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-center">
          <p className="text-slate-400 text-sm">Vui lòng nhập mã OTP 6 chữ số / Please enter the 6-digit code.</p>
          <Input 
            label="Mã xác thực" labelEn="6-Digit OTP"
            type="text" placeholder="000000"
            maxLength={6} required autoFocus
            value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
            className="text-center text-4xl tracking-[0.5em] font-mono py-6"
          />
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-4 rounded-2xl font-bold">
              {error}
            </div>
          )}
          
          <Button type="submit" loading={loading} className="w-full py-5">Xác thực & Truy cập / Verify</Button>
          
          <button type="button" onClick={onBack} className="w-full text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">
            Quay lại / Go Back
          </button>
        </form>
      </div>
    </div>
  );
};
