// src/pages/ManageHalls/HallDetails.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import type { Hall } from "../types/cinemaTypes";
import { API_ENDPOINTS } from "../util/baseURL";
import { useTranslation } from "react-i18next";

const HallDetails: React.FC = () => {
	const { t } = useTranslation();
	const { hallUid: paramHallUid } = useParams<{ hallUid: string }>();
	const loc = useLocation();
	const hallUid = paramHallUid || (loc.state as any)?.hallUid;
	const nav = useNavigate();
	const [hall, setHall] = useState<Hall | null>(null);
	const [loading, setLoading] = useState(true);
	const [editing, setEditing] = useState(false);
	const [name, setName] = useState("");
	const [seats, setSeats] = useState<number>(0);

	const token = localStorage.getItem("token");

	useEffect(() => {
    if (!hallUid) {
        console.error("No hall UID provided!");
        return;
    }
		console.log("Fetching hall with UID:", hallUid);

    const fetchHall = async () => {
        setLoading(true);
        try {
            const res = await fetch(API_ENDPOINTS.hallDetails(hallUid), {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to load hall");
            const data = await res.json();
						console.log(data)
            setHall(data);
            setName(data.name);
            setSeats(data.seats);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    fetchHall();
	}, [hallUid]);

	const handleSave = async () => {
		if (!hallUid) return;
		try {
			const res = await fetch(API_ENDPOINTS.hallDetails(hallUid), {
				method: "PUT",
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
				body: JSON.stringify({ name, seats }),
			});
			if (!res.ok) throw new Error("Save failed");
			const updated = await res.json();
			setHall(updated);
			setEditing(false);
		} catch (err) {
			console.error(err);
			alert("Save failed");
		}
	};

	if (loading) return <p>Loading...</p>;
	if (!hall) return <p>Hall not found</p>;

	return (
		<div className="container mt-4">
			<h2 className="mb-4">{t("halls.hallDetails")}</h2>
			{!editing ? (
				<>
					<div className="card">
						<div className="card-body">
							<p className="card-text">
								<strong>{t("halls.name")}:</strong> {hall.name}
							</p>
							<p className="card-text">
								<strong>{t("halls.seatsNumber")}:</strong> {hall.seats}
							</p>
							<p className="card-text">
								<strong>{t("util.status")}:</strong>{" "}
								<span className={`badge ${hall.active ? "bg-success" : "bg-secondary"}`}>
									{hall.active ? t("util.active") : t("util.inactive")}
								</span>
							</p>
						</div>
					</div>

					<div className="mt-3">
						<button className="btn btn-primary" onClick={() => setEditing(true)}>
							{t("util.edit")}
						</button>
						<button className="btn btn-secondary ms-2" onClick={() => nav(-1)}>
							Back
						</button>
					</div>
				</>
			) : (
				<>
					<div className="mb-3">
						<label className="form-label">{t("halls.name")}</label>
						<input className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
					</div>
					<div className="mb-3">
						<label className="form-label">{t("halls.seatsNumber")}</label>
						<input
							className="form-control"
							type="number"
							value={seats}
							onChange={(e) => setSeats(Number(e.target.value))}
						/>
					</div>
					<button className="btn btn-success" onClick={handleSave}>
						{t("util.save")}
					</button>
					<button className="btn btn-secondary ms-2" onClick={() => setEditing(false)}>
						{t("util.cancel")}
					</button>
				</>
			)}
		</div>
	);
};

export default HallDetails;
