// src/pages/ManageHalls/HallDetails.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import type { Hall } from "../types/cinemaTypes";
import { API_ENDPOINTS } from "../util/baseURL";
import { useTranslation } from "react-i18next";
import ShowSeats from "../components/ShowSeats";
// import MonthView from "../components/MonthView";

const HallDetails: React.FC = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const location = useLocation();
	const hallFromState = location.state?.hall;
	const { hallUid } = useParams<{ hallUid: string }>();
	const [hall, setHall] = useState<Hall | null>(hallFromState || null);
	const [loading, setLoading] = useState(!hallFromState);
	const [error, setError] = useState("");

	const token = localStorage.getItem("token");
	console.log("Hall UID from params:", hallUid);

	useEffect(() => {
		if (!hallUid) return;
		const fetchHall = async () => {
			setLoading(true);
			try {
				console.log(API_ENDPOINTS.hallDetail(hallUid));
				const res = await fetch(API_ENDPOINTS.hallDetail(hallUid), {
					headers: { Authorization: `Bearer ${token}` },
				});
				if (!res.ok) throw new Error("Failed to load hall");
				const data: Hall = await res.json();
				console.log(data);
				setHall(data);
			} catch (err) {
				console.error(err);
				setError("Failed to load hall details");
			} finally {
				setLoading(false);
			}
		};

		fetchHall();
	}, [hallUid]);

	const handleEdit = () => {
		if (hall) navigate(`/admin/halls/add`, { state: { hall } });
	};

	const handleDelete = async () => {
		if (!hall) return;
		if (!confirm(t("halls.deleteConfirm"))) return;

		try {
			const res = await fetch(API_ENDPOINTS.hallDetails(hall.uid), {
				method: "DELETE",
				headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
			});
			if (!res.ok) throw new Error(t("halls.deleteFailed"));
			alert(t("halls.deleted"));
			navigate("/admin/halls");
		} catch (err: any) {
			console.error(err);
			alert(err.message || t("halls.deleteFailed"));
		}
	};
	if (loading) return <p>{t("util.loading")}</p>;
	if (error) return <p style={{ color: "red" }}>{error}</p>;
	if (!hall) return <p>{t("halls.notFound")}</p>;

	return (
		<div className="container py-4">
			<div className="card shadow-sm">
				<div className="card-header">
					<h2 className="mb-0">{t("halls.hallDetails")}</h2>
				</div>
				<div className="card-body">
					<div className="row mb-2">
						<div className="col-sm-3 text-muted fw-semibold">{t("halls.name")}:</div>
						<div className="col-sm-9">{hall.name}</div>
					</div>
					<div className="row mb-2">
						<div className="col-sm-3 text-muted fw-semibold">{t("halls.seatsNumber")}:</div>
						<div className="col-sm-9">{hall.rows * hall.cols}</div>
					</div>
					<div className="row mb-3">
						<div className="col-sm-3 text-muted fw-semibold">{t("util.status")}:</div>
						<div className="col-sm-9">
							<span className={`badge ${hall.active ? "bg-success" : "bg-secondary"}`}>
								{hall.active ? t("util.active") : t("util.inactive")}
							</span>
						</div>
					</div>
				</div>
				<ShowSeats hall={hall} hallUid={hall.uid} />
				<div className="card-footer d-flex gap-2">
					<button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
						{t("util.back")}
					</button>
					<button className="btn btn-primary" onClick={handleEdit}>
						{t("util.edit")}
					</button>
					<button className="btn btn-danger ms-auto" onClick={handleDelete}>
						{t("halls.deleteHall")}
					</button>
				</div>
			</div>
		</div>
	);
};

export default HallDetails;
