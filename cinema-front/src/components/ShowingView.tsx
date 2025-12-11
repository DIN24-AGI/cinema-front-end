import React, { useState } from "react";
import type { ShowTime } from "../types/cinemaTypes";
import { API_ENDPOINTS } from "../util/baseURL";
import { useTranslation } from "react-i18next";

/**
 * Parses a time string and converts it to local HH:mm format
 *
 * Handles two formats:
 * 1. ISO datetime strings (e.g., "2025-12-10T14:30:00")
 * 2. Simple time strings (e.g., "14:30")
 *
 * @param time - Time string to parse
 * @returns Formatted time string in HH:mm format
 */
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

/**
 * Props for ShowingView component
 * Extends ShowTime type with additional display properties
 */
type ShowingViewProps = ShowTime & {
	movieTitle: string; // Title of the movie being shown
	fullPrice?: number; // Full/adult ticket price in cents (e.g., 1250 = €12.50)
	discountedPrice?: number; // Discounted/child ticket price in cents
	onDeleted?: (uid: string) => void; // Callback when showing is deleted
};

/**
 * ShowingView Component
 *
 * Displays a single movie showing with:
 * - Movie title
 * - Duration (calculated from start/end times)
 * - Start and end times
 * - Ticket prices (full and discounted)
 * - Delete button
 *
 * Features:
 * - Calculates and displays movie duration
 * - Handles showing deletion with loading state
 * - Converts prices from cents to euros for display
 * - Shows error alerts on delete failure
 */
const ShowingView: React.FC<ShowingViewProps> = ({
	id,
	movieTitle,
	startTime,
	endTime,
	fullPrice,
	discountedPrice,
	onDeleted,
}) => {
	const { t } = useTranslation();

	// Deletion state - tracks if delete request is in progress
	const [deleting, setDeleting] = useState(false);

	// Normalize field names (ShowTime type uses various property names)
	const showingUid = id as string;
	const startSrc = startTime as string;
	const endSrc = endTime as string | undefined;

	// Parse time strings to local HH:mm format
	const start = parseTime(startSrc);
	const end = endSrc ? parseTime(endSrc) : undefined;

	/**
	 * Calculates duration between start and end times
	 *
	 * @param startTimeStr - Start time string
	 * @param endTimeStr - End time string
	 * @returns Formatted duration string (e.g., "2h 28m" or "45m")
	 */
	const calculateDuration = (startTimeStr: string, endTimeStr: string): string => {
		// Replace space with 'T' for proper ISO format parsing
		const startD = new Date(startTimeStr.replace(" ", "T"));
		const endD = new Date(endTimeStr.replace(" ", "T"));

		// Validate parsed dates
		if (isNaN(startD.getTime()) || isNaN(endD.getTime())) return t("showingView.invalidDuration");

		// Calculate difference in milliseconds and convert to minutes
		const diffMs = endD.getTime() - startD.getTime();
		const diffMinutes = Math.floor(diffMs / 60000);

		// Handle invalid (negative) durations
		if (diffMinutes < 0) return t("showingView.invalidDuration");

		// Format as hours and minutes
		const hours = Math.floor(diffMinutes / 60);
		const minutes = diffMinutes % 60;
		return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
	};

	// Calculate duration for display
	const duration = calculateDuration(startSrc, endSrc || startSrc);

	/**
	 * Handles showing deletion
	 *
	 * Process:
	 * 1. Sets deleting state to show loading feedback
	 * 2. Sends DELETE request to backend
	 * 3. Calls onDeleted callback on success
	 * 4. Shows error alert on failure
	 * 5. Resets deleting state
	 */
	const handleDelete = async () => {
		if (!showingUid) return;
		try {
			setDeleting(true);
			const token = localStorage.getItem("token") || "";

			// Send DELETE request
			const res = await fetch(`${API_ENDPOINTS.showings}/${showingUid}`, {
				method: "DELETE",
				headers: {
					Authorization: token ? `Bearer ${token}` : "",
				},
			});

			if (!res.ok) throw new Error(await res.text().catch(() => t("showingView.deleteError")));

			// Notify parent component of successful deletion
			onDeleted?.(showingUid);
		} catch (err) {
			console.error(err);
			alert(t("showingView.deleteError"));
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
			aria-label={`${t("showingView.showing")} ${showingUid}`}
		>
			{/* Movie title - bold for emphasis */}
			<span style={{ fontWeight: 600 }}>{movieTitle}</span>

			{/* Duration - lighter weight */}
			<span style={{ fontWeight: 200 }}>
				{t("showingView.duration")}: {duration}
			</span>

			{/* Start and end times */}
			<span style={{ color: "#333" }}>
				{start}
				{end ? ` — ${end}` : ""}
			</span>

			{/* Full/adult ticket price - displayed in gray */}
			{fullPrice !== undefined && fullPrice !== null && (
				<span style={{ color: "#7c7c7cff" }}>
					{t("showingView.fullPrice")}: €{(fullPrice / 100).toFixed(2)} {/* Convert cents to euros */}
				</span>
			)}

			{/* Discounted/child ticket price - displayed in lighter gray */}
			{discountedPrice !== undefined && discountedPrice !== null && (
				<span style={{ color: "#a5a5a5ff", fontWeight: 500 }}>
					{t("showingView.discountedPrice")}: €{(discountedPrice / 100).toFixed(2)} {/* Convert cents to euros */}
				</span>
			)}

			{/* Delete button - positioned at the far right */}
			<button
				type="button"
				aria-label={`${t("showingView.deleteShowing")} ${showingUid}`}
				style={{
					cursor: "pointer",
					padding: "6px 10px",
					borderRadius: 4,
					border: "1px solid #dc3545",
					background: deleting ? "#f8d7da" : "#f5f5f5", // Pink background when deleting
					color: "#dc3545",
					marginLeft: "auto", // Push to far right
				}}
				onClick={handleDelete}
				disabled={deleting} // Prevent multiple delete attempts
			>
				{deleting ? t("util.deleting") : t("util.delete")}
			</button>
		</div>
	);
};

export default ShowingView;
