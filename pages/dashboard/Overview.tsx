
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePermission } from '../../hooks/usePermission';

export const Overview: React.FC = () => {
  const { user } = useAuth();
  const { isAdmin } = usePermission();

  const stats = [
    { label: 'Cấp độ Bảo mật', labelEn: 'Security Level', value: 'OPTIMAL', icon: '🛡️', color: 'text-emerald-500' },
    { label: 'Yêu cầu chờ xử lý', labelEn: 'Pending Approvals', value: '04', icon: '🔑', color: 'text-blue-500' },
    { label: 'Cảnh báo Hệ thống', labelEn: 'System Alerts', value: '00', icon: '⚠️', color: 'text-slate-400' },
  ];

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Trung tâm Chỉ huy</h1>
          <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-widest font-black">Command Center / Zero Trust Console</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live Monitoring Active</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-6">
              <span className="text-4xl group-hover:scale-125 transition-transform duration-500">{stat.icon}</span>
              <span className={`font-black text-3xl ${stat.color}`}>{stat.value}</span>
            </div>
            <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{stat.label}</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter italic">{stat.labelEn}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] -mr-40 -mt-40"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-6">Trạng thái Identity</h2>
            <div className="space-y-6">
              <div className="flex justify-between items-center py-4 border-b border-slate-800">
                <span className="text-slate-400 text-sm">Xác thực Đa yếu tố (MFA)</span>
                <span className="bg-emerald-500/20 text-emerald-400 px-4 py-1 rounded-full text-[10px] font-black uppercase">ENFORCED</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-slate-800">
                <span className="text-slate-400 text-sm">Cấp độ Truy cập (ABAC)</span>
                <span className="text-white font-bold">{user?.authLevel} | {user?.department}</span>
              </div>
              <div className="flex justify-between items-center py-4">
                <span className="text-slate-400 text-sm">Thiết bị Tin cậy</span>
                <span className="bg-blue-500/20 text-blue-400 px-4 py-1 rounded-full text-[10px] font-black uppercase">VERIFIED</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Hoạt động Gần đây</h2>
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-4 items-center">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-lg">📄</div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Truy cập tài liệu: Financial_Q4.pdf</p>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">14:20 PM • IP: 192.168.1.{i}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
