import React, { useState } from "react";
import type { ShowTime } from "../types/cinemaTypes";
import { API_ENDPOINTS } from "../util/baseURL";

const parseTime = (time: string) => {
	// If looks like an ISO datetime, format to local HH:mm, otherwise return as-is (e.g. "14:30")
	if (time.includes("T") || time.includes("-")) {
		const d = new Date(time);
		if (!isNaN(d.getTime())) {
			return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
		}
	}
	return time;
};

type ShowingViewProps = ShowTime & {
	movieTitle: string;
	fullPrice?: number;
	discountedPrice?: number;
	onDeleted?: (uid: string) => void;
};

const ShowingView: React.FC<ShowingViewProps> = ({
	id,
	movieTitle,
	startTime,
	endTime,
	fullPrice,
	discountedPrice,
	onDeleted,
}) => {
	const [deleting, setDeleting] = useState(false);

	// Normalize fields
	const showingUid = id as string;
	const startSrc = startTime as string;
	const endSrc = endTime as string | undefined;

	const start = parseTime(startSrc);
	const end = endSrc ? parseTime(endSrc) : undefined;

	const calculateDuration = (startTimeStr: string, endTimeStr: string): string => {
		const startD = new Date(startTimeStr.replace(" ", "T"));
		const endD = new Date(endTimeStr.replace(" ", "T"));
		if (isNaN(startD.getTime()) || isNaN(endD.getTime())) return "N/A";
		const diffMs = endD.getTime() - startD.getTime();
		const diffMinutes = Math.floor(diffMs / 60000);
		if (diffMinutes < 0) return "Invalid";
		const hours = Math.floor(diffMinutes / 60);
		const minutes = diffMinutes % 60;
		return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
	};

	const duration = calculateDuration(startSrc, endSrc || startSrc);

	const handleDelete = async () => {
		if (!showingUid) return;
		try {
			setDeleting(true);
			const token = localStorage.getItem("token") || "";
			const res = await fetch(`${API_ENDPOINTS.showings}/${showingUid}`, {
				method: "DELETE",
				headers: {
					Authorization: token ? `Bearer ${token}` : "",
				},
			});
			if (!res.ok) throw new Error(await res.text().catch(() => "Failed to delete showtime"));
			onDeleted?.(showingUid);
		} catch (err) {
			console.error(err);
			alert("Failed to delete showtime");
		} finally {
			setDeleting(false);
		}
	};

	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				gap: 12,
				padding: "8px 12px",
				border: "1px solid #e0e0e0",
				borderRadius: 6,
				background: "#fff",
				whiteSpace: "nowrap",
			}}
			role="group"
			aria-label={`Showing ${showingUid}`}
		>
			<span style={{ fontWeight: 600 }}>{movieTitle}</span>
			<span style={{ fontWeight: 200 }}>Duration: {duration}</span>
			<span style={{ color: "#333" }}>
				{start}
				{end ? ` — ${end}` : ""}
			</span>
			{fullPrice !== undefined && fullPrice !== null && (
				<span style={{ color: "#7c7c7cff" }}>Full: €{(fullPrice / 100).toFixed(2)}</span>
			)}
			{discountedPrice !== undefined && discountedPrice !== null && (
				<span style={{ color: "#a5a5a5ff", fontWeight: 500 }}>Discounted: €{(discountedPrice / 100).toFixed(2)}</span>
			)}
			<button
				type="button"
				aria-label={`Delete showing ${showingUid}`}
				style={{
					cursor: "pointer",
					padding: "6px 10px",
					borderRadius: 4,
					border: "1px solid #dc3545",
					background: deleting ? "#f8d7da" : "#f5f5f5",
					color: "#dc3545",
					marginLeft: "auto",
				}}
				onClick={handleDelete}
				disabled={deleting}
			>
				{deleting ? "Deleting..." : "Delete"}
			</button>
		</div>
	);
};

export default ShowingView;
