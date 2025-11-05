import React, { useState } from "react";
import { API_ENDPOINTS } from "../util/baseURL";

interface ChangePasswordProps {
	token: string | null;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ token }) => {
	const [email, setEmail] = useState("");
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const validatePassword = (password: string) => {
		// Validation: at least 8 chars, one uppercase, one number
		const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
		return regex.test(password);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		if (!email || !oldPassword || !newPassword || !confirmPassword) {
			setError("Please fill in all fields.");
			return;
		}

		if (newPassword !== confirmPassword) {
			setError("New passwords do not match.");
			return;
		}

		if (!validatePassword(newPassword)) {
			setError("Password must be at least 8 characters long, include a number and an uppercase letter.");
			return;
		}

		try {
			const res = await fetch(API_ENDPOINTS.changePassword, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ email, oldPassword, newPassword }),
			});

			if (!res.ok) throw new Error("Failed to change password");

			setSuccess("Password changed successfully. You can now log in with your new password.");
			setEmail("");
			setOldPassword("");
			setNewPassword("");
			setConfirmPassword("");
		} catch (err) {
			console.error(err);
			setError("Failed to change password. Please check your credentials.");
		}
	};

	return (
		<div className="container py-4">
			<div className="row justify-content-center">
				<div className="col-md-6">
					<div className="card">
						<div className="card-body">
							<h2 className="card-title mb-4">Change Password</h2>
							<form onSubmit={handleSubmit}>
								<div className="mb-3">
									<label htmlFor="email" className="form-label">
										Email
									</label>
									<input
										type="email"
										id="email"
										className="form-control"
										placeholder="Email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
									/>
								</div>

								<div className="mb-3">
									<label htmlFor="oldPassword" className="form-label">
										Old Password
									</label>
									<input
										type="password"
										id="oldPassword"
										className="form-control"
										placeholder="Old Password"
										value={oldPassword}
										onChange={(e) => setOldPassword(e.target.value)}
										required
									/>
								</div>

								<div className="mb-3">
									<label htmlFor="newPassword" className="form-label">
										New Password
									</label>
									<input
										type="password"
										id="newPassword"
										className="form-control"
										placeholder="New Password"
										value={newPassword}
										onChange={(e) => setNewPassword(e.target.value)}
										required
									/>
								</div>

								<div className="mb-3">
									<label htmlFor="confirmPassword" className="form-label">
										Confirm New Password
									</label>
									<input
										type="password"
										id="confirmPassword"
										className="form-control"
										placeholder="Confirm New Password"
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										required
									/>
								</div>

								{error && <div className="alert alert-danger">{error}</div>}
								{success && <div className="alert alert-success">{success}</div>}

								<button type="submit" className="btn btn-primary w-100">
									Change Password
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChangePassword;
