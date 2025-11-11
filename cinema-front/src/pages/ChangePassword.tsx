import React, { useState } from "react";
import { API_ENDPOINTS } from "../util/baseURL";
import { useTranslation } from "react-i18next";

export interface ChangePasswordProps {
	token: string | null;
	setToken: (token: string | null) => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ token, setToken }) => {
	const { t } = useTranslation();
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
			setToken(null);
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
							<h2 className="card-title mb-4">{t("changePassword.title")}</h2>
							<form onSubmit={handleSubmit}>
								<div className="form-floating mb-3">
									<input
										id="email"
										type="email"
										className="form-control"
										placeholder={t("changePassword.email")}
										value={email}
										onChange={(e) => setEmail(e.target.value)}
									/>
									<label htmlFor="email">{t("changePassword.email")}</label>
								</div>

								<div className="form-floating mb-3">
									<input
										id="oldPassword"
										type="password"
										className="form-control"
										placeholder={t("changePassword.oldPassword")}
										value={oldPassword}
										onChange={(e) => setOldPassword(e.target.value)}
									/>
									<label htmlFor="oldPassword">{t("changePassword.oldPassword")}</label>
								</div>

								<div className="form-floating mb-3">
									<input
										id="newPassword"
										type="password"
										className="form-control"
										placeholder={t("changePassword.newPassword")}
										value={newPassword}
										onChange={(e) => setNewPassword(e.target.value)}
									/>
									<label htmlFor="newPassword">{t("changePassword.newPassword")}</label>
								</div>

								<div className="form-floating mb-4">
									<input
										id="confirmPassword"
										type="password"
										className="form-control"
										placeholder={t("changePassword.confirmPassword")}
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
									/>
									<label htmlFor="confirmPassword">{t("changePassword.confirmPassword")}</label>
								</div>

								{error && <div className="alert alert-danger">{error}</div>}
								{success && <div className="alert alert-success">{success}</div>}

								<button type="submit" className="btn btn-primary w-100">
									{t("changePassword.button")}
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
