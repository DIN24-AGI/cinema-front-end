const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const API_ENDPOINTS = {
	test: `${API_BASE_URL}/api/test`,
	dbHealth: `${API_BASE_URL}/api/db-health`,
	changePassword: `${API_BASE_URL}/auth/change-password`,
  login: `${API_BASE_URL}/auth/login`,
  protectedDashboard: `${API_BASE_URL}/admin/dashboard`,
	cinemas: `${API_BASE_URL}/admin/cinemas`,
	cities: `${API_BASE_URL}/admin/cities`,
  cinemasByCity: (cityUid: string) => `${API_BASE_URL}/admin/cinemas?city_uid=${cityUid}`,
  hallsByCinema: (cinemaUid: string) => `${API_BASE_URL}/admin/halls/${cinemaUid}`,
  addHall: `${API_BASE_URL}/admin/halls`,
  hallDetails: (hallUid: string) => `${API_BASE_URL}/admin/halls/${hallUid}`, 
};
