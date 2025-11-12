import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import type { Cinema, Hall } from "../types/cinemaTypes";
import { API_ENDPOINTS } from "../util/baseURL";
import { useTranslation } from "react-i18next";

const CinemaDetails: React.FC = () => {
	const { t } = useTranslation();
	const location = useLocation();
	const cinema = location.state?.cinema;

	const navigate = useNavigate();
	const { id: cinema_uid } = useParams<{ id: string }>();
	const [cinemaData, setCinemaData] = useState<Cinema | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const token = localStorage.getItem("token");

	useEffect(() => {
		const fetchCinema = async () => {
			if (!cinema_uid) return;
			if (!token) {
				setError("No token found. Please log in.");
				setLoading(false);
				return;
			}

			try {
				const res = await fetch(`${API_ENDPOINTS.cinemas}/${cinema_uid}`, {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				});

				if (!res.ok) throw new Error("Failed to fetch cinema");

				const data: Cinema = await res.json();
				setCinemaData(data);
			} catch (err: any) {
				console.error(err);
				setError(err.message || "Something went wrong");
			} finally {
				setLoading(false);
			}
		};

		fetchCinema();
	}, [cinema_uid]);

	const handleEdit = () => {
		if (cinemaData) {
			navigate("/admin/add-cinema", { state: { cinema } });
		}
	};

	const handleBack = () => {
		navigate("/admin/cinemas");
	};

	const handleDelete = async () => {
		if (!cinema) return;

		const confirmed = window.confirm("Are you sure you want to delete this cinema? This cannot be undone.");
		if (!confirmed) return;

		const token = localStorage.getItem("token");
		if (!token) {
			alert("No token found. Please log in.");
			return;
		}

		try {
			const res = await fetch(`${API_ENDPOINTS.cinemas}/${cinema.uid}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			if (!res.ok) throw new Error("Failed to delete cinema");

			alert("Cinema deleted successfully!");
			navigate("/admin/cinemas");
		} catch (err: any) {
			console.error(err);
			alert(err.message || "Failed to delete cinema");
		}
	};

	if (loading) return <p>Loading cinema details...</p>;
	if (error) return <p style={{ color: "red" }}>{error}</p>;
	if (!cinema) return <p>Cinema not found.</p>;

	return (
		<div className="container py-4">
			<div className="card shadow-sm">
				<div className="card-header">
					<h2 className="mb-0">Cinema Details</h2>
				</div>

				<div className="card-body">
					<div className="row mb-2">
						<div className="col-sm-3 text-muted fw-semibold">{t("cinemas.name")}:</div>
						<div className="col-sm-9">{cinema.name}</div>
					</div>
					<div className="row mb-2">
						<div className="col-sm-3 text-muted fw-semibold">{t("cinemas.address")}:</div>
						<div className="col-sm-9">{cinema.address || "Add the address"}</div>
					</div>
					<div className="row mb-3">
						<div className="col-sm-3 text-muted fw-semibold">{t("cinemas.phone")}:</div>
						<div className="col-sm-9">{cinema.phone || "Add the phone number"}</div>
					</div>

					<h5 className="mt-3">{t("cinemas.halls")}</h5>
					{cinema.halls && cinema.halls.length > 0 ? (
						<ul className="list-group">
							{cinema.halls.map((aud: Hall) => (
								<li key={aud.uid} className="list-group-item d-flex justify-content-between align-items-center">
									<span>{aud.name}</span>
									<span className="badge text-bg-secondary">{aud.seats} seats</span>
								</li>
							))}
						</ul>
					) : (
						<div className="alert alert-info mt-2 mb-0">{t("cinemas.noHallsAdded")}</div>
					)}
				</div>

				<div className="card-footer d-flex gap-2">
					<button type="button" className="btn btn-outline-secondary" onClick={handleBack}>
						{t("util.back")}
					</button>
					<button type="button" className="btn btn-primary" onClick={handleEdit}>
						{t("cinemas.editCinema")}
					</button>
					<button type="button" className="btn btn-danger ms-auto" onClick={handleDelete}>
						{t("cinemas.deleteCinema")}
					</button>
				</div>
			</div>
		</div>
	);
};

export default CinemaDetails;
