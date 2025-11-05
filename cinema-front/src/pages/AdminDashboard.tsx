import React from "react";
import Navbar from "../components/NavBar/NavBar";
import ApiStatus from "../components/ApiStatus";
import { API_ENDPOINTS } from "../util/baseURL";

interface AdminDashboardProps {
	token: string | null;
	setToken: (token: string | null) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ token, setToken }) => {
	const handleLogout = () => {
		setToken(null);
		localStorage.removeItem("token");
	};

	return (
		<div>
			<h2>Admin Dashboard</h2>
			<p>Welcome, admin!</p>
			<div className="row g-3 mb-4">
				<div className="col-md-6">
					<ApiStatus endpoint={API_ENDPOINTS.test} title="Backend Test" />
				</div>
				<div className="col-md-6">
					<ApiStatus endpoint={API_ENDPOINTS.dbHealth} title="Database Health" />
				</div>
			</div>
			<button onClick={handleLogout}>Logout</button>
		</div>
	);
};

export default AdminDashboard;
