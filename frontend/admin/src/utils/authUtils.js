// ============================================
// FILE: frontend/admin/src/utils/authUtils.js
// ============================================
export const getAdminData = () => {
  const token = localStorage.getItem('adminToken');
  const adminData = localStorage.getItem('adminData');

  return {
    token,
    admin: adminData ? JSON.parse(adminData) : null,
  };
};

export const clearAdminData = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminData');
};

export const storeAdminData = (token, adminData) => {
  localStorage.setItem('adminToken', token);
  localStorage.setItem('adminData', JSON.stringify(adminData));
};

export const hasPermission = (admin, resource, action) => {
  if (!admin) return false;
  if (admin.role === 'super_admin') return true;
  return admin.permissions?.[resource]?.[action] || false;
};
