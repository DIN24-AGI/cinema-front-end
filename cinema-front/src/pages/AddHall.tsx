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
	const cinemaUid = (loc.state as any)?.cinemaUid as string | undefined;

	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [rows, setRows] = useState<number>(0);
	const [cols, setCols] = useState<number>(0)



	const token = localStorage.getItem("token");

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
			const res = await fetch(API_ENDPOINTS.addHall, {
				method: "POST",
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
				body: JSON.stringify({ 
					cinema_uid: cinemaUid, 
					name, 
					rows,
					cols }),
			});
			if (!res.ok) {
				const d = await res.json().catch(() => ({}));
				throw new Error(d.msg || "Failed to create hall");
			}
			const created: Hall = await res.json();
			console.log(created);
			nav("/admin/halls");
		} catch (err: any) {
			console.error(err);
			setError(err.message || "Error");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container mt-4">
			<h2 className="mb-4">{t("halls.addHall")}</h2>
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

				<div className="d-flex">
					<button type="submit" className="btn btn-primary" disabled={loading}>
						{loading ? "Saving..." : t("halls.createHall")}
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
