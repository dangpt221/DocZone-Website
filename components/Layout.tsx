
import React from 'react';
import { UserRole } from '../types';
import { db } from '../services/db';

interface LayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onLogout, currentPage, setCurrentPage }) => {
  const user = db.getCurrentUser();

  if (!user) return <>{children}</>;

  const getDashboardId = () => {
    if (user.role === UserRole.ADMIN) return 'dashboard-admin';
    if (user.role === UserRole.MANAGER) return 'dashboard-manager';
    return 'dashboard-employee';
  };

  const menuItems = [
    { id: getDashboardId(), label: 'Dashboard', icon: '📊' },
    { id: 'documents', label: 'Vault', icon: '📁' },
    { id: 'requests', label: 'Governance', icon: '🔑' },
  ];

  if (user.role === UserRole.ADMIN) {
    menuItems.push(
      { id: 'admin-users', label: 'Identities', icon: '👥' },
      { id: 'admin-security', label: 'Hardening', icon: '🛡️' }
    );
  }

  if (user.role !== UserRole.EMPLOYEE) {
    menuItems.push({ id: 'logs', label: 'Audit Logs', icon: '🕵️' });
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-950 text-white flex flex-col fixed inset-y-0 shadow-2xl z-30 border-r border-slate-900">
        <div className="p-10 flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-2xl shadow-lg shadow-blue-500/30">T</div>
          <span className="font-black text-2xl tracking-tighter">TrustGuard</span>
        </div>
        
        <nav className="flex-1 px-6 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${
                currentPage === item.id 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' 
                  : 'text-slate-500 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <span className={`text-xl transition-transform group-hover:scale-110 ${currentPage === item.id ? 'scale-110' : ''}`}>{item.icon}</span>
              <span className="font-bold text-sm tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-slate-900">
          <div className="flex items-center gap-4 mb-8 p-4 bg-slate-900 rounded-3xl border border-slate-800">
            <img src={user.avatar} className="w-10 h-10 rounded-2xl border-2 border-slate-700" alt="avatar" />
            <div className="overflow-hidden">
              <p className="font-bold truncate text-sm text-white">{user.name}</p>
              <p className={`text-[9px] uppercase tracking-widest font-black ${user.role === 'ADMIN' ? 'text-red-500' : 'text-blue-400'}`}>
                {user.role}
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-3 py-4 bg-slate-900 border border-slate-800 rounded-2xl hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-500 transition-all text-xs font-bold"
          >
            <span>🚪</span> Terminate Session
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-12 min-h-screen bg-slate-50/30 backdrop-blur-3xl">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
