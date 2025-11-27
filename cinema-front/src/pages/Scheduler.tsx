import React, { useState, useEffect } from "react";
import type { Cinema, Hall, MovieItem } from "../types/cinemaTypes";
import { API_ENDPOINTS } from "../util/baseURL";
import HallSchedule from "../components/HallSchedule";

const Scheduler: React.FC = () => {
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [cinemas, setCinemas] = useState<Cinema[]>([]);
	const [selectedCinema, setSelectedCinema] = useState<string>("");
	const [halls, setHalls] = useState<Hall[]>([]);
	const [movies, setMovies] = useState<MovieItem[]>([]);
	const [loadingCinemas, setLoadingCinemas] = useState(false);
	const [loadingHalls, setLoadingHalls] = useState(false);
	const [loadingMovies, setLoadingMovies] = useState(false);
	const [cinemaError, setCinemaError] = useState("");
	const [hallsError, setHallsError] = useState("");
	const [moviesError, setMoviesError] = useState("");

	const formatDate = (date: Date): string => {
		return date.toISOString().split("T")[0];
	};

	const handlePreviousDay = () => {
		const newDate = new Date(selectedDate);
		newDate.setDate(newDate.getDate() - 1);
		setSelectedDate(newDate);
	};

	const handleNextDay = () => {
		const newDate = new Date(selectedDate);
		newDate.setDate(newDate.getDate() + 1);
		setSelectedDate(newDate);
	};

	const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedDate(new Date(e.target.value));
	};

	// Fetch all cinemas on mount
	useEffect(() => {
		const fetchCinemas = async () => {
			try {
				setLoadingCinemas(true);
				setCinemaError("");
				const token = localStorage.getItem("token");
				const res = await fetch(API_ENDPOINTS.cinemas, {
					headers: { Authorization: token ? `Bearer ${token}` : "" },
				});
				if (!res.ok) throw new Error("Failed to load cinemas");
				const data: Cinema[] = await res.json();
				setCinemas(data);
				if (!selectedCinema && data.length > 0) {
					setSelectedCinema(data[0].uid);
				}
			} catch (e: any) {
				setCinemaError(e?.message || "Error");
			} finally {
				setLoadingCinemas(false);
			}
		};
		fetchCinemas();
	}, []);

	// Fetch halls when cinema is selected
	useEffect(() => {
		if (!selectedCinema) {
			setHalls([]);
			return;
		}

		const fetchHalls = async () => {
			try {
				setLoadingHalls(true);
				setHallsError("");
				const token = localStorage.getItem("token");
				const res = await fetch(API_ENDPOINTS.hallsByCinema(selectedCinema), {
					headers: { Authorization: token ? `Bearer ${token}` : "" },
				});
				if (!res.ok) throw new Error("Failed to load halls");
				const data: Hall[] = await res.json();
				setHalls(data);
			} catch (e: any) {
				setHallsError(e?.message || "Error loading halls");
			} finally {
				setLoadingHalls(false);
			}
		};
		fetchHalls();
	}, [selectedCinema]);

	// Fetch active movies (same pattern as MovieList.tsx)
	useEffect(() => {
		const fetchMovies = async () => {
			try {
				setLoadingMovies(true);
				setMoviesError("");
				const token = localStorage.getItem("token");
				const res = await fetch(API_ENDPOINTS.movies, {
					headers: {
						"Content-Type": "application/json",
						Authorization: token ? `Bearer ${token}` : "",
					},
				});
				if (!res.ok) throw new Error("fetchFailed");
				const data: MovieItem[] = await res.json();
				setMovies(data.filter((m) => m.active)); // only active movies
			} catch (e: any) {
				setMoviesError(e?.message === "fetchFailed" ? "Failed to fetch movies" : "Unexpected error");
			} finally {
				setLoadingMovies(false);
			}
		};
		fetchMovies();
	}, []);

	return (
		<div className="container mt-4">
			{/* Date picker */}
			<div className="row justify-content-center">
				<div className="col-md-6">
					<div className="input-group">
						<button className="btn btn-outline-primary" type="button" onClick={handlePreviousDay}>
							<i className="bi bi-chevron-left"></i> Previous
						</button>
						<input
							type="date"
							className="form-control text-center"
							value={formatDate(selectedDate)}
							onChange={handleDateChange}
						/>
						<button className="btn btn-outline-primary" type="button" onClick={handleNextDay}>
							Next <i className="bi bi-chevron-right"></i>
						</button>
					</div>
				</div>
			</div>

			{/* Cinema dropdown */}
			<div className="row g-3 mt-3">
				<div className="col-md-6 col-lg-4">
					<label htmlFor="cinemaSelect" className="form-label">
						Cinema
					</label>
					<select
						id="cinemaSelect"
						className="form-select"
						value={selectedCinema}
						onChange={(e) => setSelectedCinema(e.target.value)}
						disabled={loadingCinemas}
					>
						<option value="">Select cinema</option>
						{cinemas.map((c) => (
							<option key={c.uid} value={c.uid}>
								{c.name}
							</option>
						))}
					</select>
					{loadingCinemas && <div className="form-text">Loading cinemas…</div>}
					{cinemaError && <div className="text-danger small">{cinemaError}</div>}
				</div>
			</div>

			{/* Optional movies loading/error badges */}
			{loadingMovies && <div className="alert alert-info mt-3">Loading movies…</div>}
			{moviesError && <div className="alert alert-danger mt-3">{moviesError}</div>}

			{/* Hall schedules */}
			<div className="row mt-4">
				<div className="col">
					{loadingHalls && <div className="text-muted">Loading halls…</div>}
					{hallsError && <div className="alert alert-danger">{hallsError}</div>}

					{!loadingHalls && !hallsError && selectedCinema && halls.length === 0 && (
						<div className="alert alert-info">No halls found for this cinema.</div>
					)}

					{!loadingHalls && !hallsError && halls.length > 0 && (
						<div className="row row-cols-1 g-4">
							{halls.map((hall) => (
								<div key={hall.uid} className="col">
									<div className="card">
										<div className="card-body">
											{/* Pass movies list so HallSchedule can resolve titles by movie_uid */}
											<HallSchedule hall={hall} movies={movies} schedule={[]} />
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Scheduler;
