import React, { useState, useEffect } from "react";
import type { Cinema, Hall, MovieItem } from "../types/cinemaTypes";
import { API_ENDPOINTS } from "../util/baseURL";
import HallSchedule from "../components/HallSchedule";
import type { Showing } from "../types/cinemaTypes";
import { useTranslation } from "react-i18next";

/**
 * Scheduler Component
 *
 * Admin page for managing movie showings across cinema halls.
 * Allows scheduling movies by:
 * - Selecting a date (with prev/next day navigation)
 * - Choosing a cinema from dropdown
 * - Viewing all halls for that cinema
 * - Adding/deleting showings for each hall
 *
 * Data flow:
 * 1. Fetches all cinemas on mount
 * 2. When cinema selected → fetches halls for that cinema
 * 3. Fetches active movies (used in hall scheduling)
 * 4. Fetches showings for selected date
 * 5. Each hall displays its showings and allows adding new ones
 */
const Scheduler: React.FC = () => {
	const { t } = useTranslation();

	// Date state - controls which day's schedule is displayed
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());

	// Cinema/Hall state
	const [cinemas, setCinemas] = useState<Cinema[]>([]); // All available cinemas
	const [selectedCinema, setSelectedCinema] = useState<string>(""); // Currently selected cinema UID
	const [halls, setHalls] = useState<Hall[]>([]); // Halls for selected cinema

	// Movies state - list of active movies that can be scheduled
	const [movies, setMovies] = useState<MovieItem[]>([]);

	// Showings state - all showings for the selected date
	const [showings, setShowings] = useState<Showing[]>([]);

	// Loading states for each data fetch operation
	const [loadingCinemas, setLoadingCinemas] = useState(false);
	const [loadingHalls, setLoadingHalls] = useState(false);
	const [loadingMovies, setLoadingMovies] = useState(false);
	const [loadingShowings, setLoadingShowings] = useState(false);

	// Error states for each data fetch operation
	const [cinemaError, setCinemaError] = useState("");
	const [hallsError, setHallsError] = useState("");
	const [moviesError, setMoviesError] = useState("");
	const [showingsError, setShowingsError] = useState("");

	/**
	 * Formats a Date object to YYYY-MM-DD string format
	 * Used for API calls and date input field
	 */
	const formatDate = (date: Date): string => {
		return date.toISOString().split("T")[0];
	};

	/**
	 * Navigate to previous day
	 */
	const handlePreviousDay = () => {
		const newDate = new Date(selectedDate);
		newDate.setDate(newDate.getDate() - 1);
		setSelectedDate(newDate);
	};

	/**
	 * Navigate to next day
	 */
	const handleNextDay = () => {
		const newDate = new Date(selectedDate);
		newDate.setDate(newDate.getDate() + 1);
		setSelectedDate(newDate);
	};

	/**
	 * Handle manual date input change
	 */
	const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedDate(new Date(e.target.value));
	};

	/**
	 * Effect: Fetch all cinemas on component mount
	 * Auto-selects first cinema if available
	 */
	useEffect(() => {
		const fetchCinemas = async () => {
			try {
				setLoadingCinemas(true);
				setCinemaError("");
				const token = localStorage.getItem("token");
				const res = await fetch(API_ENDPOINTS.cinemas, {
					headers: { Authorization: token ? `Bearer ${token}` : "" },
				});
				if (!res.ok) throw new Error(t("cinemas.fetchError"));
				const data: Cinema[] = await res.json();
				setCinemas(data);
				// Auto-select first cinema if none selected
				if (!selectedCinema && data.length > 0) {
					setSelectedCinema(data[0].uid);
				}
			} catch (e: any) {
				setCinemaError(e?.message || t("cinemas.genericError"));
			} finally {
				setLoadingCinemas(false);
			}
		};
		fetchCinemas();
	}, [t]);

	/**
	 * Effect: Fetch halls when a cinema is selected
	 * Clears halls if no cinema selected
	 */
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
				if (!res.ok) throw new Error(t("halls.errorLoadHalls"));
				const data: Hall[] = await res.json();
				setHalls(data);
			} catch (e: any) {
				setHallsError(e?.message || t("halls.errorLoadHalls"));
			} finally {
				setLoadingHalls(false);
			}
		};
		fetchHalls();
	}, [selectedCinema, t]);

	/**
	 * Effect: Fetch active movies on component mount
	 * Only active movies can be scheduled
	 */
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
				if (!res.ok) throw new Error(t("movies.fetchError"));
				const data: MovieItem[] = await res.json();
				setMovies(data.filter((m) => m.active)); // Filter to only active movies
			} catch (e: any) {
				setMoviesError(e?.message || t("movies.fetchError"));
			} finally {
				setLoadingMovies(false);
			}
		};
		fetchMovies();
	}, [t]);

	/**
	 * Effect: Fetch showings when selected date changes
	 * Re-fetches data whenever user navigates to different date
	 */
	useEffect(() => {
		fetchShowings();
	}, [selectedDate]);

	/**
	 * Fetches all showings for the selected date
	 * Called on date change and after creating/deleting showings
	 */
	const fetchShowings = async () => {
		try {
			setLoadingShowings(true);
			setShowingsError("");
			const token = localStorage.getItem("token");
			const dateStr = formatDate(selectedDate);

			const res = await fetch(`${API_ENDPOINTS.showings}?date=${dateStr}`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: token ? `Bearer ${token}` : "",
				},
			});

			if (!res.ok) throw new Error(t("scheduler.fetchShowingsError"));
			const data: Showing[] = await res.json();
			console.log(data);
			setShowings(data);
		} catch (e: any) {
			setShowingsError(e?.message || t("scheduler.fetchShowingsError"));
		} finally {
			setLoadingShowings(false);
		}
	};

	/**
	 * Filters showings by hall UID
	 * Used to display only relevant showings for each hall
	 */
	const getShowingsForHall = (hallUid: string): Showing[] => {
		const showingsForHall = showings.filter((showing) => showing.hall_uid === hallUid);
		console.log("Hall: ", showingsForHall);
		return showingsForHall;
	};

	return (
		<div className="container mt-4">
			{/* Date Navigation Section */}
			<div className="row justify-content-center">
				<div className="col-md-6">
					<div className="input-group">
						{/* Previous day button */}
						<button className="btn btn-outline-primary" type="button" onClick={handlePreviousDay}>
							<i className="bi bi-chevron-left"></i> {t("scheduler.previous")}
						</button>
						{/* Date input field */}
						<input
							type="date"
							className="form-control text-center"
							value={formatDate(selectedDate)}
							onChange={handleDateChange}
						/>
						{/* Next day button */}
						<button className="btn btn-outline-primary" type="button" onClick={handleNextDay}>
							{t("scheduler.next")} <i className="bi bi-chevron-right"></i>
						</button>
					</div>
				</div>
			</div>

			{/* Cinema Selection Section */}
			<div className="row g-3 mt-3">
				<div className="col-md-6 col-lg-4">
					<label htmlFor="cinemaSelect" className="form-label">
						{t("scheduler.cinema")}
					</label>
					{/* Cinema dropdown */}
					<select
						id="cinemaSelect"
						className="form-select"
						value={selectedCinema}
						onChange={(e) => setSelectedCinema(e.target.value)}
						disabled={loadingCinemas}
					>
						<option value="">{t("scheduler.selectCinema")}</option>
						{cinemas.map((c) => (
							<option key={c.uid} value={c.uid}>
								{c.name}
							</option>
						))}
					</select>
					{/* Loading/error feedback for cinemas */}
					{loadingCinemas && <div className="form-text">{t("util.loading")}</div>}
					{cinemaError && <div className="text-danger small">{cinemaError}</div>}
				</div>
			</div>

			{/* Loading/Error States for Movies and Showings */}
			{loadingMovies && <div className="alert alert-info mt-3">{t("scheduler.loadingMovies")}</div>}
			{moviesError && <div className="alert alert-danger mt-3">{moviesError}</div>}
			{loadingShowings && <div className="alert alert-info mt-3">{t("scheduler.loadingShowings")}</div>}
			{showingsError && <div className="alert alert-danger mt-3">{showingsError}</div>}

			{/* Hall Schedules Section */}
			<div className="row mt-4">
				<div className="col">
					{/* Loading state for halls */}
					{loadingHalls && <div className="text-muted">{t("halls.loading")}</div>}
					{/* Error state for halls */}
					{hallsError && <div className="alert alert-danger">{hallsError}</div>}

					{/* Empty state: cinema selected but no halls found */}
					{!loadingHalls && !hallsError && selectedCinema && halls.length === 0 && (
						<div className="alert alert-info">{t("scheduler.noHalls")}</div>
					)}

					{/* Render hall schedules when data is loaded */}
					{!loadingHalls && !hallsError && halls.length > 0 && (
						<div className="row row-cols-1 g-4">
							{halls.map((hall) => (
								<div key={hall.uid} className="col">
									<div className="card">
										<div className="card-body">
											{/*
                                                HallSchedule component for each hall
                                                - Shows hall info and current showings
                                                - Allows adding new showings
                                                - Handles showing deletion
                                                - Callbacks refetch showings from database
                                            */}
											<HallSchedule
												hall={hall}
												movies={movies}
												date={formatDate(selectedDate)}
												schedule={getShowingsForHall(hall.uid)}
												onCreated={() => {
													fetchShowings(); // Refetch after creating showing
												}}
												onDeleted={() => {
													fetchShowings(); // Refetch after deleting showing
												}}
											/>
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
