import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { API_ENDPOINTS } from "../util/baseURL";
import type { Hall } from "../types/cinemaTypes";

/**
 * Seat type - represents a single seat in the database
 */
type Seat = {
	uid: string;
	row: number;
	number: number;
	active: boolean;
};

/**
 * Props for ShowSeats component
 */
interface ShowSeatsProps {
	hall: Hall; // Hall information (rows, cols)
	hallUid: string; // UID of the hall to fetch seats for
}

/**
 * ShowSeats Component
 *
 * Displays cinema hall seats in a grid layout.
 *
 * Features:
 * - Fetches seats from backend for the specified hall
 * - Displays seats in a grid matching hall rows × cols
 * - Active seats shown with white background
 * - Inactive seats shown with light grey background
 * - Responsive grid layout
 */
const ShowSeats: React.FC<ShowSeatsProps> = ({ hall, hallUid }) => {
	const { t } = useTranslation();
	const [seats, setSeats] = useState<Seat[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const token = () => localStorage.getItem("token");

	/**
	 * Effect: Fetch seats when component mounts or hallUid changes
	 */
	useEffect(() => {
		if (hallUid) {
			fetchSeats();
		}
	}, [hallUid]);

	/**
	 * Fetches all seats for the hall from the backend
	 */
	const fetchSeats = async () => {
		try {
			setLoading(true);
			setError("");
			const res = await fetch(`${API_ENDPOINTS.seats(hallUid)}`, {
				headers: { Authorization: `Bearer ${token()}` },
			});

			if (!res.ok) throw new Error(t("seats.fetchError"));

			const data: Seat[] = await res.json();
			console.log("fetched seats:", data);
			setSeats(data);
		} catch (err: any) {
			console.error(err);
			setError(err.message || t("seats.fetchError"));
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Gets a seat from the seats array by row and number
	 * Returns null if seat doesn't exist
	 */
	const getSeat = (row: number, number: number): Seat | undefined => {
		return seats.find((s) => s.row === row && s.number === number);
	};

	/**
	 * Generates grid rows based on hall configuration
	 * Returns array of row indices (1 to hall.rows)
	 */
	const getRowNumbers = (): number[] => {
		const rows: number[] = [];
		for (let i = 1; i <= (hall.rows || 0); i++) {
			rows.push(i);
		}
		return rows;
	};

	/**
	 * Generates seat numbers for a row
	 * Returns array of seat numbers (1 to hall.cols)
	 */
	const getColNumbers = (): number[] => {
		const cols: number[] = [];
		for (let i = 1; i <= (hall.cols || 0); i++) {
			cols.push(i);
		}
		return cols;
	};

	if (loading) {
		return <div className="alert alert-info">{t("util.loading")}</div>;
	}

	if (error) {
		return <div className="alert alert-danger">{error}</div>;
	}

	const rows = getRowNumbers();
	const cols = getColNumbers();

	return (
		<div className="seats-container p-4">
			<h5 className="mb-4 text-center">{t("seats.hallSeats")}</h5>

			{/* Seat Legend */}
			<div className="d-flex justify-content-center gap-4 mb-4">
				<div className="d-flex align-items-center gap-2">
					<div
						style={{
							width: "30px",
							height: "30px",
							backgroundColor: "#fff",
							border: "1px solid #333",
							borderRadius: "4px",
						}}
					></div>
					<small>{t("seats.activeSeat")}</small>
				</div>
				<div className="d-flex align-items-center gap-2">
					<div
						style={{
							width: "30px",
							height: "30px",
							backgroundColor: "#e9ecef",
							border: "1px solid #999",
							borderRadius: "4px",
						}}
					></div>
					<small>{t("seats.inactiveSeat")}</small>
				</div>
			</div>

			{/* Seats Grid */}
			<div className="d-flex justify-content-center">
				<div
					style={{
						display: "grid",
						gridTemplateColumns: `repeat(${hall.cols}, 1fr)`,
						gap: "8px",
						padding: "20px",
						border: "1px solid #ddd",
						borderRadius: "8px",
						backgroundColor: "#f8f9fa",
					}}
				>
					{rows.map((rowNum) =>
						cols.map((colNum) => {
							const seat = getSeat(rowNum, colNum);
							const isActive = seat?.active ?? true; // Default to active if seat exists

							return (
								<div
									key={`${rowNum}-${colNum}`}
									style={{
										width: "40px",
										height: "40px",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										backgroundColor: isActive ? "#fff" : "#e9ecef",
										border: isActive ? "1px solid #333" : "1px solid #999",
										borderRadius: "4px",
										cursor: "pointer",
										transition: "all 0.2s ease",
										fontSize: "10px",
										fontWeight: "500",
										color: isActive ? "#333" : "#666",
									}}
									title={`${t("seats.row")} ${rowNum}, ${t("seats.seat")} ${colNum}`}
									onMouseEnter={(e) => {
										if (isActive) {
											e.currentTarget.style.backgroundColor = "#e9ecef";
											e.currentTarget.style.transform = "scale(1.1)";
										}
									}}
									onMouseLeave={(e) => {
										if (isActive) {
											e.currentTarget.style.backgroundColor = "#fff";
											e.currentTarget.style.transform = "scale(1)";
										}
									}}
								>
									{colNum}
								</div>
							);
						})
					)}
				</div>
			</div>

			{/* Total Seats Info */}
			<div className="text-center mt-4">
				<small className="text-muted">
					{t("seats.totalSeats")}: {seats.length} / {hall.rows * hall.cols}
				</small>
			</div>
		</div>
	);
};

export default ShowSeats;
