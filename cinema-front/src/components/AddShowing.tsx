import React, { useState, useEffect } from "react";
import type { Movie } from "../types/cinemaTypes";
import { API_ENDPOINTS } from "../util/baseURL";

/**
 * ShowTime type - represents a movie showing in the database
 */
type ShowTime = {
	uid: string;
	movie_uid: string;
	hall_uid: string;
	starts_at: string;
	ends_at: string;
};

/**
 * Props for AddShowing component
 */
type AddMovieProps = {
	movies: Movie[]; // List of available movies to schedule
	date: string; // Selected date in YYYY-MM-DD format
	hall_uid: string; // UID of the hall where showing will be added
	fullPrice?: number; // Default full/adult ticket price
	discountedPrice?: number; // Default discounted/child ticket price
	existingShowings?: ShowTime[]; // Current showings in this hall (for overlap detection)
	onCreated?: (show: ShowTime) => void; // Callback when showing is successfully created
};

/**
 * AddShowing Component
 *
 * Form component for adding a new movie showing to a cinema hall.
 * Features:
 * - Movie selection dropdown
 * - Time picker for showing start time
 * - Price inputs (full and discounted)
 * - Overlap detection with existing showings
 * - Automatic end time calculation based on movie duration
 *
 * Validation:
 * - Prevents scheduling overlapping showings in the same hall
 * - Ensures all required fields are filled
 * - Handles timezone offsets correctly
 */
const AddShowing: React.FC<AddMovieProps> = ({
	movies,
	date,
	hall_uid,
	fullPrice: initialFullPrice = 12, // Default €12 for full price
	discountedPrice: initialDiscountedPrice = 10, // Default €10 for discounted
	existingShowings = [],
	onCreated,
}) => {
	// Form state
	const [time, setTime] = useState(""); // Selected start time (HH:mm format)
	const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null); // Currently selected movie
	const [options, setOptions] = useState<string[]>([]); // List of movie titles for dropdown

	// Price state - allows per-showing price customization
	const [fullPrice, setFullPrice] = useState<number>(initialFullPrice);
	const [discountedPrice, setDiscountedPrice] = useState<number>(initialDiscountedPrice);

	/**
	 * Effect: Initialize movie options and auto-select first movie
	 * Runs when movies list changes
	 */
	useEffect(() => {
		const titles = movies.map((m) => m.title);
		setOptions(titles);
		// Preselect first movie if none selected
		if (!selectedMovie && movies.length > 0) {
			setSelectedMovie(movies[0]);
		}
	}, [movies]);

	/**
	 * Checks if a new showing overlaps with any existing showings in the same hall
	 *
	 * Overlap logic:
	 * Two time ranges [A_start, A_end] and [B_start, B_end] overlap if:
	 * A_start < B_end AND A_end > B_start
	 *
	 * @param newStart - Start time of the new showing
	 * @param newEnd - End time of the new showing
	 * @returns true if there's an overlap, false otherwise
	 */
	const checkOverlap = (newStart: Date, newEnd: Date): boolean => {
		for (const showing of existingShowings) {
			// Parse existing showing times
			const existingStart = new Date(showing.starts_at);
			const existingEnd = new Date(showing.ends_at);

			// Check if new showing overlaps with existing showing
			// Overlap occurs if: new start is before existing end AND new end is after existing start
			if (newStart < existingEnd && newEnd > existingStart) {
				return true; // Overlap detected
			}
		}
		return false; // No overlap
	};

	/**
	 * Handles form submission to create a new showing
	 *
	 * Process:
	 * 1. Validates all required fields
	 * 2. Calculates start and end times with timezone offset
	 * 3. Checks for overlaps with existing showings
	 * 4. Sends POST request to backend
	 * 5. Calls onCreated callback on success
	 */
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validation: ensure all required fields are present
		if (!selectedMovie || !time || !selectedMovie.uid || !hall_uid) return;

		/**
		 * Helper: Pads number to 2 digits (e.g., 5 -> "05")
		 */
		const pad2 = (n: number) => String(n).padStart(2, "0");

		// Parse time input (HH:mm format from time input)
		const [hhRaw, mmRaw] = time.split(":").map(Number);
		const hh = Number.isFinite(hhRaw) ? hhRaw : 0;
		const mm = Number.isFinite(mmRaw) ? mmRaw : 0;

		// Build start Date object in local timezone
		const [year, month, day] = date.split("-").map(Number);
		const startDT = new Date(year, (month || 1) - 1, day || 1, hh, mm, 0, 0);

		// Calculate end time by adding movie duration
		const durationMin = Number(selectedMovie.duration_minutes ?? 0);
		const endDT = new Date(startDT.getTime() + (isNaN(durationMin) ? 0 : durationMin) * 60_000);

		// Check for overlaps before submitting
		if (checkOverlap(startDT, endDT)) {
			alert("This showing overlaps with an existing showing in the same hall. Please choose a different time.");
			return;
		}

		/**
		 * Helper: Formats timezone offset for a Date (e.g., "+02:00" or "-05:00")
		 * Handles DST automatically
		 */
		const formatOffset = (d: Date) => {
			const offsetMin = -d.getTimezoneOffset(); // JS returns negative offset
			const sign = offsetMin >= 0 ? "+" : "-";
			const abs = Math.abs(offsetMin);
			const offH = pad2(Math.floor(abs / 60));
			const offM = pad2(abs % 60);
			return `${sign}${offH}:${offM}`;
		};

		/**
		 * Helper: Formats Date to "YYYY-MM-DD HH:mm:ss" format
		 */
		const formatYmdHMS = (d: Date) =>
			`${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${d.getHours()}:${pad2(d.getMinutes())}:00`;

		// Build timestamp strings with timezone offset (e.g., "2025-12-10 14:30:00+02:00")
		const starts_at = `${formatYmdHMS(startDT)}${formatOffset(startDT)}`;
		const ends_at = `${formatYmdHMS(endDT)}${formatOffset(endDT)}`;

		try {
			const token = localStorage.getItem("token") || "";

			// Send POST request to create showing
			const res = await fetch(API_ENDPOINTS.showings, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: token ? `Bearer ${token}` : "",
				},
				body: JSON.stringify({
					movie_uid: selectedMovie.uid,
					hall_uid,
					starts_at,
					ends_at,
					adult_price: Math.round(fullPrice * 100), // Convert €12.50 to 1250 cents
					child_price: Math.round(discountedPrice * 100), // Convert €10.00 to 1000 cents
				}),
			});

			if (!res.ok) throw new Error(await res.text().catch(() => "Failed to create showing"));

			// Parse created showing and notify parent
			const created: ShowTime = await res.json();
			setTime(""); // Reset time input
			onCreated?.(created); // Trigger parent callback
			console.log("Showing created");
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className="container my-3">
			{/* Form for adding a new showing */}
			<form className="d-flex align-items-center gap-2" onSubmit={handleSubmit}>
				{/* Movie selection dropdown */}
				<select
					className="form-select w-auto"
					value={selectedMovie?.title || ""}
					onChange={(e) => setSelectedMovie(movies.find((m) => m.title === e.target.value) || null)}
					aria-label="Select movie"
				>
					{options.map((title) => (
						<option key={title} value={title}>
							{title}
						</option>
					))}
				</select>

				{/* Time picker for start time */}
				<input
					type="time"
					className="form-control w-auto"
					value={time}
					onChange={(e) => setTime(e.target.value)}
					aria-label="Select time"
				/>

				{/* Full/adult price input */}
				<input
					type="number"
					className="form-control w-auto"
					placeholder="Full Price (€)"
					value={fullPrice.toFixed(2)} // Always show 2 decimals
					onChange={(e) => setFullPrice(parseFloat(e.target.value) || 0)}
					step="0.1"
					min="0"
					style={{ maxWidth: 120 }}
				/>

				{/* Discounted/child price input */}
				<input
					type="number"
					className="form-control w-auto"
					placeholder="Discount Price (€)"
					value={discountedPrice.toFixed(2)} // Always show 2 decimals
					onChange={(e) => setDiscountedPrice(parseFloat(e.target.value) || 0)}
					step="0.1"
					min="0"
					style={{ maxWidth: 120 }}
				/>

				{/* Submit button */}
				<button type="submit" className="btn btn-primary">
					Add
				</button>
			</form>
		</div>
	);
};

export default AddShowing;
