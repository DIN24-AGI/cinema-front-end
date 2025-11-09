const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const API_ENDPOINTS = {
	test: `${API_BASE_URL}/api/test`,
	dbHealth: `${API_BASE_URL}/api/db-health`,
	changePassword: `${API_BASE_URL}/auth/change-password`,
  login: `${API_BASE_URL}/auth/login`,
  protectedDashboard: `${API_BASE_URL}/admin/dashboard`,
	cinemas: `${API_BASE_URL}/admin/cinemas`,
	
};
