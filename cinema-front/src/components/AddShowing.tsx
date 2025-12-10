import React, { useState, useEffect } from "react";
import type { Movie } from "../types/cinemaTypes";
import { API_ENDPOINTS } from "../util/baseURL";

type ShowTime = {
	uid: string;
	movie_uid: string;
	hall_uid: string;
	starts_at: string;
	ends_at: string;
};

type AddMovieProps = {
	movies: Movie[];
	date: string;
	hall_uid: string;
	fullPrice?: number;
	discountedPrice?: number;
	onCreated?: (show: ShowTime) => void;
};

const AddShowing: React.FC<AddMovieProps> = ({
	movies,
	date,
	hall_uid,
	fullPrice: initialFullPrice = 12,
	discountedPrice: initialDiscountedPrice = 10,
	onCreated,
}) => {
	const [time, setTime] = useState("");
	const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
	const [options, setOptions] = useState<string[]>([]); // movie titles
	const [fullPrice, setFullPrice] = useState<number>(initialFullPrice);
	const [discountedPrice, setDiscountedPrice] = useState<number>(initialDiscountedPrice);

	// Map options to movie titles on mount / movies change
	useEffect(() => {
		const titles = movies.map((m) => m.title);
		setOptions(titles);
		// Preselect first movie if none selected
		if (!selectedMovie && movies.length > 0) {
			setSelectedMovie(movies[0]);
		}
	}, [movies]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedMovie || !time || !selectedMovie.uid || !hall_uid) return;

		const pad2 = (n: number) => String(n).padStart(2, "0");

		// Parse time input (HH:mm)
		const [hhRaw, mmRaw] = time.split(":").map(Number);
		const hh = Number.isFinite(hhRaw) ? hhRaw : 0;
		const mm = Number.isFinite(mmRaw) ? mmRaw : 0;

		// Build Date objects in local timezone (user’s system TZ; for you it’s Helsinki)
		const [year, month, day] = date.split("-").map(Number);
		const startDT = new Date(year, (month || 1) - 1, day || 1, hh, mm, 0, 0);

		const durationMin = Number(selectedMovie.duration_minutes ?? 0);
		const endDT = new Date(startDT.getTime() + (isNaN(durationMin) ? 0 : durationMin) * 60_000);

		// Compute local offset for each Date (handles DST automatically)
		const formatOffset = (d: Date) => {
			const offsetMin = -d.getTimezoneOffset(); // e.g. +120 for UTC+2
			const sign = offsetMin >= 0 ? "+" : "-";
			const abs = Math.abs(offsetMin);
			const offH = pad2(Math.floor(abs / 60));
			const offM = pad2(abs % 60);
			return `${sign}${offH}:${offM}`;
		};

		const formatYmdHMS = (d: Date) =>
			`${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${d.getHours()}:${pad2(d.getMinutes())}:00`;

		// Send with explicit timezone offset so Postgres stores exact intended time
		const starts_at = `${formatYmdHMS(startDT)}${formatOffset(startDT)}`; // e.g. "2025-12-28 09:00:00+02:00"
		const ends_at = `${formatYmdHMS(endDT)}${formatOffset(endDT)}`;

		try {
			const token = localStorage.getItem("token") || "";
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
					adult_price: Math.round(fullPrice * 100),
					child_price: Math.round(discountedPrice * 100),
				}),
			});
			if (!res.ok) throw new Error(await res.text().catch(() => "Failed to create showing"));

			const created: ShowTime = await res.json();
			setTime("");
			onCreated?.(created);
			console.log("Showing created");
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className="container my-3">
			<form className="d-flex align-items-center gap-2" onSubmit={handleSubmit}>
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

				<input
					type="time"
					className="form-control w-auto"
					value={time}
					onChange={(e) => setTime(e.target.value)}
					aria-label="Select time"
				/>

				<input
					type="number"
					className="form-control w-auto"
					placeholder="Full Price (€)"
					value={fullPrice.toFixed(2)}
					onChange={(e) => setFullPrice(parseFloat(e.target.value) || 0)}
					step="0.1"
					min="0"
					style={{ maxWidth: 120 }}
				/>

				<input
					type="number"
					className="form-control w-auto"
					placeholder="Discount Price (€)"
					value={discountedPrice.toFixed(2)}
					onChange={(e) => setDiscountedPrice(parseFloat(e.target.value) || 0)}
					step="0.1"
					min="0"
					style={{ maxWidth: 120 }}
				/>

				<button type="submit" className="btn btn-primary">
					Add
				</button>
			</form>
		</div>
	);
};

export default AddShowing;
