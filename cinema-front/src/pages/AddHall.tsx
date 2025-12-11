// src/pages/ManageHalls/AddHall.tsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import type { Hall } from "../types/cinemaTypes";
import { API_ENDPOINTS } from "../util/baseURL";
import { useTranslation } from "react-i18next";

const AddHall: React.FC = () => {
	const { t } = useTranslation();
	const nav = useNavigate();
	const loc = useLocation();

	const existingHall = (loc.state as any)?.hall as Hall | undefined;
	const cinemaUidFromState = (loc.state as any)?.cinemaUid as string | undefined;

	const [name, setName] = useState(existingHall?.name || "");
	const [rows, setRows] = useState<number>(existingHall?.rows || 0);
	const [cols, setCols] = useState<number>(existingHall?.cols || 0);
	const [cinemaUid] = useState<string>(existingHall?.cinema_uid || cinemaUidFromState || "");
	const [active, setActive] = useState<boolean>(existingHall?.active || false);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const token = localStorage.getItem("token");

	/**
	 * Recreates seats for the hall based on rows/cols configuration
	 */
	const recreateSeats = async (hallUid: string) => {
		try {
			const res = await fetch(API_ENDPOINTS.recreateHallSeats(hallUid), {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			if (!res.ok) {
				const d = await res.json().catch(() => ({}));
				throw new Error(d.msg || "Failed to recreate seats");
			}

			console.log("Seats recreated successfully");
		} catch (err: any) {
			console.error("Error recreating seats:", err);
			// Don't throw - continue even if seat recreation fails
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!cinemaUid) {
			setError("No cinema selected");
			return;
		}
		if (rows < 1 || cols < 1) {
			setError("Rows and columns must be at least 1");
			return;
		}
		setLoading(true);

		try {
			const body = { cinema_uid: cinemaUid, name, rows, cols, active: !!active };

			const url = existingHall ? `${API_ENDPOINTS.hallDetails(existingHall.uid)}` : API_ENDPOINTS.addHall;

			const method = existingHall ? "PUT" : "POST";

			const res = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
				body: JSON.stringify(body),
			});

			if (!res.ok) {
				const d = await res.json().catch(() => ({}));
				throw new Error(d.msg || (existingHall ? "Failed to update hall" : "Failed to create hall"));
			}

			const savedHall: Hall = await res.json();
			console.log("Saved hall:", savedHall);

			// Recreate seats after hall is saved
			await recreateSeats(savedHall.uid);

			nav(-1);
		} catch (err: any) {
			console.error(err);
			setError(err.message || "Error");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container mt-4">
			<h2 className="mb-4">{existingHall ? t("halls.editHall") : t("halls.addHall")}</h2>

			{error && <div className="alert alert-danger">{error}</div>}

			<form onSubmit={handleSubmit} className="card p-4 shadow-sm">
				<div className="mb-3">
					<label className="form-label">{t("halls.name")}</label>
					<input className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
				</div>

				<div className="mb-3">
					<label className="form-label">{t("halls.colNumber")}</label>
					<input
						type="number"
						className="form-control"
						value={cols}
						onChange={(e) => setCols(Number(e.target.value))}
						min={1}
						required
					/>
				</div>
				<div className="mb-3">
					<label className="form-label">{t("halls.rowsNumber")}</label>
					<input
						type="number"
						className="form-control"
						value={rows}
						onChange={(e) => setRows(Number(e.target.value))}
						min={1}
						required
					/>
				</div>
				<div className="mb-3 form-check">
					<input
						type="checkbox"
						className="form-check-input"
						id="hallActive"
						checked={active}
						onChange={(e) => setActive(e.target.checked)}
					/>
					<label className="form-check-label" htmlFor="hallActive">
						{t("halls.active")}
					</label>
				</div>

				<div className="d-flex">
					<button type="submit" className="btn btn-primary" disabled={loading}>
						{loading ? t("util.saving") : existingHall ? t("halls.updateHall") : t("halls.createHall")}
					</button>
					<button type="button" className="btn btn-secondary ms-2" onClick={() => nav(-1)}>
						{t("util.cancel")}
					</button>
				</div>
			</form>
		</div>
	);
};

export default AddHall;
