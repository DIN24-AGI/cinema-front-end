import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { API_ENDPOINTS } from "../util/baseURL.ts";

interface AdminLoginProps {
	setToken: (token: string | null) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ setToken }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		try {
			const res = await fetch(API_ENDPOINTS.login, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			if (!res.ok) throw new Error("Login failed");

			const data = await res.json();
			setToken(data.token);
			localStorage.setItem("token", data.token);
			navigate("/admin/dashboard");
		} catch (err) {
			setError("Login failed. Please check your credentials.");
			console.error(err);
		}
	};

	return (
		<div className="container py-5">
			<div className="row justify-content-center">
				<div className="col-md-6 col-lg-5">
					<div className="card shadow">
						<div className="card-body p-4">
							<div className="text-center mb-4">
								<h1 className="h3 mb-3 fw-normal">🎬 Admin Login</h1>
								<p className="text-muted">Sign in to your account</p>
							</div>

							<form onSubmit={handleLogin}>
								<div className="mb-3 form-floating">
									<input
										type="email"
										className="form-control"
										id="email"
										placeholder="Email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
									/>
									<label htmlFor="email">Email</label>
								</div>

								<div className="mb-3 form-floating">
									<input
										type="password"
										className="form-control"
										id="password"
										placeholder="Password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
									/>
									<label htmlFor="password">Password</label>
								</div>

								{error && (
									<div className="alert alert-danger" role="alert">
										{error}
									</div>
								)}

								<button type="submit" className="btn btn-primary w-100 mb-3">
									Login
								</button>
							</form>

							<div className="text-center">
								<p className="text-muted mb-0">
									First time logging in?{" "}
									<Link to="/admin/change-password" className="text-decoration-none">
										Change password
									</Link>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminLogin;
