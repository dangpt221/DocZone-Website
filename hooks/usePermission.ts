
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const usePermission = () => {
  const { user } = useAuth();

  const isAdmin = user?.role === UserRole.ADMIN;
  const isManager = user?.role === UserRole.MANAGER;
  const isEmployee = user?.role === UserRole.EMPLOYEE;

  const canAccessDepartment = (dept: string) => {
    if (isAdmin) return true;
    return user?.department === dept;
  };

  const canManageUsers = isAdmin || isManager;
  
  const canUploadToDept = (dept: string) => {
    if (isAdmin) return true;
    return isManager && user?.department === dept;
  };

  return {
    isAdmin,
    isManager,
    isEmployee,
    canAccessDepartment,
    canManageUsers,
    canUploadToDept,
    role: user?.role,
    department: user?.department
  };
};
