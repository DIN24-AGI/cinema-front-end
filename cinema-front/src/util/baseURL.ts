const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const API_ENDPOINTS = {
	test: `${API_BASE_URL}/api/test`,
	dbHealth: `${API_BASE_URL}/api/db-health`,
};
