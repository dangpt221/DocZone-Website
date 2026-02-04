
import React from 'react';
import { UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
  const { user, logout } = useAuth();
  if (!user) return null;

  const getDashboardId = () => {
    if (user.role === UserRole.ADMIN) return 'dashboard-admin';
    if (user.role === UserRole.MANAGER) return 'dashboard-manager';
    return 'dashboard-employee';
  };

  const menuItems = [
    { id: getDashboardId(), label: 'Tổng quan', labelEn: 'Overview', icon: '📊' },
    { id: 'documents', label: 'Kho dữ liệu', labelEn: 'Vault', icon: '📁' },
    { id: 'requests', label: 'Phê duyệt', labelEn: 'Governance', icon: '🔑' },
  ];

  if (user.role === UserRole.ADMIN) {
    menuItems.push(
      { id: 'admin-users', label: 'Nhân sự', labelEn: 'Identities', icon: '👥' },
      { id: 'admin-security', label: 'Chính sách', labelEn: 'Policy', icon: '🛡️' }
    );
  }

  if (user.role !== UserRole.EMPLOYEE) {
    menuItems.push({ id: 'logs', label: 'Nhật ký', labelEn: 'Audit Logs', icon: '🕵️' });
  }

  return (
    <aside className="w-72 bg-slate-950 text-white flex flex-col fixed inset-y-0 shadow-2xl z-30 border-r border-slate-900">
      <div className="p-10 flex items-center gap-4">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-2xl shadow-lg shadow-blue-500/30">T</div>
        <span className="font-black text-2xl tracking-tighter">TrustGuard</span>
      </div>
      
      <nav className="flex-1 px-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 group ${
              currentPage === item.id 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' 
                : 'text-slate-500 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className={`text-xl transition-transform group-hover:scale-110 ${currentPage === item.id ? 'scale-110' : ''}`}>{item.icon}</span>
              <div className="text-left">
                <p className="font-bold text-xs tracking-tight">{item.label}</p>
                <p className="text-[8px] uppercase tracking-widest opacity-50 font-black">{item.labelEn}</p>
              </div>
            </div>
            {currentPage === item.id && <span className="w-1.5 h-1.5 bg-white rounded-full"></span>}
          </button>
        ))}
      </nav>

      <div className="p-8 border-t border-slate-900">
        <div className="flex items-center gap-4 mb-8 p-4 bg-slate-900 rounded-3xl border border-slate-800">
          <img src={user.avatar} className="w-10 h-10 rounded-2xl border-2 border-slate-700" alt="avatar" />
          <div className="overflow-hidden">
            <p className="font-bold truncate text-[11px] text-white">{user.name}</p>
            <p className={`text-[8px] uppercase tracking-widest font-black ${user.role === 'ADMIN' ? 'text-red-500' : 'text-blue-400'}`}>
              {user.role} | {user.department}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-3 py-4 bg-slate-900 border border-slate-800 rounded-2xl hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-500 transition-all text-[10px] font-bold uppercase tracking-widest"
        >
          <span>🚪</span> Terminate Session
        </button>
      </div>
    </aside>
  );
};
