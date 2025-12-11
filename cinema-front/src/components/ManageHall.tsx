import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import type { Hall, Cinema, Seat } from "../types/cinemaTypes";
import { API_ENDPOINTS } from "../util/baseURL";
import { useTranslation } from "react-i18next";

/**
 * Props for ManageHall component
 */
interface ManageHallProps {
	hall: Hall; // Hall object to display
	cinema: Cinema; // Associated cinema information
	onDeleted?: () => void; // Callback when hall is deleted
}

/**
 * ManageHall Component
 *
 * Component for viewing and managing a single cinema hall.
 *
 * Features:
 * - View hall details (name, capacity, rows/cols, active status)
 * - Edit hall information
 * - Toggle active/inactive status
 * - Delete hall
 */
const ManageHall: React.FC<ManageHallProps> = ({ hall: initialHall, cinema, onDeleted }) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [hall, setHall] = useState<Hall>(initialHall);
	const [activeSeatsCount, setActiveSeatsCount] = useState<number>(0);

	const token = () => localStorage.getItem("token");

	/**
	 * Effect: Fetch seats when component mounts or hall.uid changes
	 */
	useEffect(() => {
		if (hall.uid) {
			fetchSeats();
		}
	}, [hall.uid]);
	/**
	 * Toggles the active status of the hall
	 */
	const handleToggleActive = async () => {
		const newStatus = !hall.active;
		try {
			const res = await fetch(`${API_ENDPOINTS.halls}/${hall.uid}/activate`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token()}`,
				},
				body: JSON.stringify({ active: newStatus }),
			});

			if (!res.ok) throw new Error(t("halls.toggleFailed"));

			const data = await res.json();
			console.log(data);
			setHall({ ...hall, active: newStatus });
		} catch (error) {
			console.error(error);
			alert(t("halls.toggleFailed"));
		}
	};

	/**
	 * Deletes the hall after confirmation
	 */
	const handleDelete = async () => {
		if (!confirm(t("halls.deleteConfirm"))) return;
		try {
			const res = await fetch(API_ENDPOINTS.hallDetails(hall.uid), {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token()}`,
					"Content-Type": "application/json",
				},
			});
			if (!res.ok) throw new Error(t("halls.deleteFailed"));
			onDeleted?.(); // Notify parent to refresh list
		} catch (err) {
			console.error(err);
			alert(t("halls.deleteFailed"));
		}
	};

	const fetchSeats = async () => {
		try {
			const res = await fetch(`${API_ENDPOINTS.seats(hall.uid)}`, {
				headers: { Authorization: `Bearer ${token()}` },
			});

			if (!res.ok) throw new Error(t("seats.fetchError"));

			const data: Seat[] = await res.json();
			console.log("fetched seats:", data);
			setActiveSeatsCount(data.filter((seat) => seat.active).length);
		} catch (err: any) {
			console.error(err);
		}
	};

	return (
		<div className="card">
			<div className="card-body">
				<div className="row">
					<div className="col-md-6">
						<h4 className="card-title">{hall.name}</h4>
					</div>
					<div className="col-md-6 text-md-end">
						<span className={`badge ${hall.active ? "bg-success" : "bg-secondary"} fs-6`}>
							{hall.active ? t("util.active") : t("util.inactive")}
						</span>
					</div>
				</div>

				<div className="row align-items-center">
					<div className="col-12 d-flex align-items-center gap-2 flex-wrap">
						<p>
							{t("seats.activeSeats")}: {activeSeatsCount} / {hall.rows * hall.cols}
						</p>
						{/* Action buttons inline and right-aligned */}
						<div className="d-flex align-items-center gap-2 flex-wrap ms-auto justify-content-end">
							<button
								className="btn btn-sm btn-outline-secondary"
								onClick={() => navigate(`/admin/hall/${hall.uid}`, { state: { hall } })}
							>
								{t("halls.view")}
							</button>
							<button
								className="btn btn-primary btn-sm"
								onClick={() => navigate(`/admin/halls/add`, { state: { hall } })}
							>
								{t("util.edit")}
							</button>
							<button
								className={`btn btn-sm ${hall.active ? "btn-warning" : "btn-success"}`}
								onClick={handleToggleActive}
							>
								{hall.active ? t("util.deactivate") : t("util.activate")}
							</button>
							<button className="btn btn-danger btn-sm" onClick={handleDelete}>
								{t("util.delete")}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ManageHall;
