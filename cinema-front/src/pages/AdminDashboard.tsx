import React from "react";
// import ApiStatus from "../components/ApiStatus";
// import { API_ENDPOINTS } from "../util/baseURL";
import { Statistics } from "../components/Statistics";

interface AdminDashboardProps {
	token: string | null;
	setToken: (token: string | null) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = () => {
	return (
		<div>
			<Statistics />
		</div>
	);
};

export default AdminDashboard;
