
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/layout/Sidebar';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Overview } from './pages/dashboard/Overview';
import { AccessLogs } from './pages/admin/AccessLogs';
import { UserRole } from './types';

const DashboardOrchestrator = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('login');

  useEffect(() => {
    if (user) {
      if (user.role === UserRole.ADMIN) setCurrentPage('dashboard-admin');
      else if (user.role === UserRole.MANAGER) setCurrentPage('dashboard-manager');
      else setCurrentPage('dashboard-employee');
    } else {
      // Giữ nguyên page hiện tại nếu là 'register', nếu không thì về 'login'
      if (currentPage !== 'register') {
        setCurrentPage('login');
      }
    }
  }, [user]);

  if (!user) {
    if (currentPage === 'register') {
      return <Register onBackToLogin={() => setCurrentPage('login')} />;
    }
    return <Login onNavigateToRegister={() => setCurrentPage('register')} />;
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard-admin':
      case 'dashboard-manager':
      case 'dashboard-employee':
        return <Overview />;
      case 'logs':
        return <AccessLogs />;
      case 'documents':
        return (
          <div className="py-20 text-center space-y-4">
             <div className="text-6xl mb-6">📁</div>
             <h2 className="text-2xl font-bold text-slate-900">Kho lưu trữ Tài liệu / Vault</h2>
             <p className="text-slate-500">Đang đồng bộ hóa dữ liệu bảo mật / Syncing secure vault...</p>
          </div>
        );
      case 'requests':
        return (
          <div className="py-20 text-center space-y-4">
             <div className="text-6xl mb-6">🔑</div>
             <h2 className="text-2xl font-bold text-slate-900">Phê duyệt Quyền / Governance</h2>
             <p className="text-slate-500">Kiểm tra yêu cầu từ Zero Trust Gateway / Validating requests...</p>
          </div>
        );
      default:
        return <Overview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-1 ml-72 p-12 min-h-screen">
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export const App = () => (
  <AuthProvider>
    <DashboardOrchestrator />
  </AuthProvider>
);
