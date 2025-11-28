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
	onCreated?: (show: ShowTime) => void; // NEW: notify parent on success
};

const AddMovie: React.FC<AddMovieProps> = ({ movies, date, hall_uid, onCreated }) => {
	const [time, setTime] = useState("");
	const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
	const [options, setOptions] = useState<string[]>([]); // movie titles

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

		// Create starts_at in Finnish timezone (Europe/Helsinki)
		// Use the date prop (YYYY-MM-DD) and selected time
		const starts_at = `${date} ${hh}:${pad2(mm)}:00`;

		// Calculate ends_at by adding duration
		const durationMin = Number(selectedMovie.duration_minutes ?? 0);

		// Create a Date object in local timezone (Finnish time)
		const [year, month, day] = date.split("-").map(Number);
		const startDT = new Date(year, month - 1, day, hh, mm, 0);
		const endDT = new Date(startDT.getTime() + (isNaN(durationMin) ? 0 : durationMin) * 60_000);

		const formatYmd = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

		const ends_at = `${formatYmd(endDT)} ${endDT.getHours()}:${pad2(endDT.getMinutes())}:00`;

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

				<button type="submit" className="btn btn-primary">
					Add
				</button>
			</form>
		</div>
	);
};

export default AddMovie;
