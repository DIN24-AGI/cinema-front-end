// src/pages/ManageCinemas/ManageCinemas.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import CinemaCard from "../components/CinemaCard/CinemaCard";
import { API_ENDPOINTS } from "../util/baseURL";
import type { Cinema } from "../types/cinemaTypes";
import { useTranslation } from "react-i18next";

const ManageCinemas: React.FC = () => {
	const { t } = useTranslation();
	const [cinemas, setCinemas] = useState<Cinema[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		const fetchCinemas = async () => {
			const token = localStorage.getItem("token");
			if (!token) return;
			try {
				setLoading(true);
				setError("");
				const res = await fetch(API_ENDPOINTS.cinemas, {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				});
				if (!res.ok) throw new Error("fetchFailed");
				const data: Cinema[] = await res.json();
				setCinemas(data);
			} catch (e: any) {
				setError(e.message === "fetchFailed" ? t("cinemas.fetchError") : t("cinemas.genericError"));
			} finally {
				setLoading(false);
			}
		};
		fetchCinemas();
	}, [t]);

	const handleToggleActive = async (cinemaId: string, currentState: boolean) => {
		try {
			const token = localStorage.getItem("token");
			if (!token) throw new Error("noToken");
			const res = await fetch(`${API_ENDPOINTS.cinemas}/${cinemaId}/activate`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ active: !currentState }),
			});
			if (!res.ok) throw new Error("toggleFailed");
			const updatedCinema = await res.json();
			setCinemas((prev) => prev.map((c) => (c.uid === cinemaId ? updatedCinema : c)));
		} catch (e: any) {
			console.error(e);
			alert(
				e.message === "toggleFailed"
					? t("cinemas.toggleError")
					: e.message === "noToken"
					? t("cinemas.noToken")
					: t("cinemas.genericError")
			);
		}
	};

	const handleAddCinema = () => navigate("/admin/add-cinema");
	const handleViewDetails = (cinema: Cinema) => navigate(`/admin/cinemas/${cinema.uid}`, { state: { cinema } });

	return (
		<div className="container mt-4">
			<h2 className="mb-4">{t("cinemas.title")}</h2>

			<button className="btn btn-primary mb-3" onClick={handleAddCinema}>
				+ {t("cinemas.addCinema")}
			</button>

			{loading && <div className="alert alert-info">{t("cinemas.loading")}</div>}
			{error && <div className="alert alert-danger">{t("cinemas.genericError")}</div>}

			<div className="row">
				{!loading && !error && cinemas.length === 0 && (
					<div className="col-12">
						<div className="alert alert-warning">{t("cinemas.noCinemas")}</div>
					</div>
				)}

				{cinemas.map((cinema) => (
					<div className="col-md-6 col-lg-4 mb-4" key={cinema.uid}>
						<CinemaCard
							id={cinema.uid}
							name={cinema.name}
							address={cinema.address}
							phone={cinema.phone}
							hallsCount={cinema.halls?.length || 0}
							active={cinema.active}
							onToggleActive={() => handleToggleActive(cinema.uid, cinema.active)}
							onViewDetails={() => handleViewDetails(cinema)}
						/>
					</div>
				))}
			</div>
		</div>
	);
};

export default ManageCinemas;
