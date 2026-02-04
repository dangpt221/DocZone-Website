
import React, { useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  labelEn: string;
}

export const Input: React.FC<InputProps> = ({ label, labelEn, type, className, ...props }) => {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="space-y-2 group w-full text-left">
      <div className="flex justify-between items-center ml-1">
        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider group-focus-within:text-blue-400 transition-colors">
          {label}
        </label>
        <span className="text-[9px] font-medium text-slate-600 uppercase tracking-tighter italic">
          {labelEn}
        </span>
      </div>
      <div className="relative">
        <input
          {...props}
          type={isPassword ? (show ? 'text' : 'password') : type}
          className={`w-full px-6 py-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-white text-base placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all shadow-inner ${className}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
          >
            {show ? '🙈' : '👁️'}
          </button>
        )}
      </div>
    </div>
  );
};
