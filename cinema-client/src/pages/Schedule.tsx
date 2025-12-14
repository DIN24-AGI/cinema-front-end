import { useEffect, useState } from "react";
// import CinemaSelector from "../components/CinemaSelector";
import type { City, Cinema } from "../types/cinemaTypes";
import { API_ENDPOINTS } from "../util/baseURL";
import { useTranslation } from "react-i18next";
import type { Showtime } from "../types/showtime";
import CinemaSelectorDropdown from "../components/CinemaSelectorDropdown";
import styles from "./Schedule.module.css";

import { useNavigate } from "react-router";

function Schedule() {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const [cities, setCities] = useState<City[]>([]);
	const [cinemas, setCinemas] = useState<Cinema[]>([]);
	const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null);

	const [date, setDate] = useState<string>(() => new Date().toISOString().split("T")[0]);
	const [showtimes, setShowtimes] = useState<Showtime[]>([]);
	const [filteredShowtimes, setFilteredShowtimes] = useState<Showtime[]>([]);
	const [selectedMovie, setSelectedMovie] = useState<string>("");

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	// Load cities and cinemas
	useEffect(() => {
		const fetchEverything = async () => {
			try {
				setLoading(true);

				const [citiesRes, cinemasRes] = await Promise.all([fetch(API_ENDPOINTS.cities), fetch(API_ENDPOINTS.cinemas)]);

				if (!citiesRes.ok) throw new Error(t("contact.errorLoadCities"));

				const cityData: City[] = await citiesRes.json();
				const cinemaData: Cinema[] = await cinemasRes.json();

				setCities(cityData);

				const activeCinemas = cinemaData.filter((c) => c.active);
				setCinemas(activeCinemas);

				if (!selectedCinema && activeCinemas.length > 0) {
					setSelectedCinema(activeCinemas[0]);
				}
			} catch (err: any) {
				console.error(err);
				setError(err.message || t("util.genericError"));
			} finally {
				setLoading(false);
			}
		};

		fetchEverything();
	}, [t, selectedCinema]);

	const onSelectCinema = (cinema: Cinema) => {
		setSelectedCinema(cinema);
	};

	// Load showtimes when cinema/date changes
	useEffect(() => {
		const loadShowtimes = async () => {
			if (!selectedCinema) return;

			try {
				setLoading(true);

				const url = `${API_ENDPOINTS.showtimesInCinema}?cinema_uid=${selectedCinema.uid}&date=${date}`;
				const res = await fetch(url);

				if (!res.ok) throw new Error(t("movieDetails.errorShowtimes"));

				const data: Showtime[] = await res.json();
				setShowtimes(data);
			} catch (err) {
				console.error(`t("movieDetails.errorShowtimes) :`, err);
				setShowtimes([]);
			} finally {
				setLoading(false);
			}
		};

		loadShowtimes();
	}, [selectedCinema, date, t]);

	// Filter showtimes by selected movie
	useEffect(() => {
		if (!selectedMovie) {
			setFilteredShowtimes(showtimes);
		} else {
			setFilteredShowtimes(showtimes.filter((show) => show.movie_title === selectedMovie));
		}
	}, [showtimes, selectedMovie]);

	// Get unique movie titles for dropdown
	const availableMovies = Array.from(new Set(showtimes.map((show) => show.movie_title))).sort();

	return (
		<div className="container mt-4">
			{error && <div className="alert alert-danger">{error}</div>}
			{/* <h2 className="mb-4">{t("schedule.pageTitle")}</h2> */}
			{/* Cinema Selector */}
			{/* <div className="cinema">
        <h5>{t("schedule.cinemaSelect")}</h5>
        <CinemaSelector
          cinemas={cinemas}
          cities={cities}
          selectedCinema={selectedCinema!}
          onSelectCinema={setSelectedCinema}
        />
      </div> */}
			{/* filters block */}
			<div className="d-flex flex-row flex-wrap gap-3 mb-4">
				<CinemaSelectorDropdown
					cinemas={cinemas}
					cities={cities}
					widthClass="col-12 col-md-4"
					label={t("schedule.location")}
					selectedCinema={selectedCinema!}
					onSelectCinema={onSelectCinema}
				/>

				{/* Date Picker */}
				<div className="mb-4">
					<input
						type="date"
						className="form-control"
						value={date}
						onChange={(e) => setDate(e.target.value)}
						disabled={!selectedCinema}
					/>
				</div>

				{/* Movie Filter */}
				<div className="mb-4">
					<select
						className="form-select"
						value={selectedMovie}
						onChange={(e) => setSelectedMovie(e.target.value)}
						disabled={!selectedCinema || showtimes.length === 0}
					>
						<option value="">{t("schedule.allMovies", "All Movies")}</option>
						{availableMovies.map((movieTitle) => (
							<option key={movieTitle} value={movieTitle}>
								{movieTitle}
							</option>
						))}
					</select>
				</div>
			</div>
			{loading && <p>{t("util.loading")}</p>}
			{!selectedCinema && <p className="text-muted">{t("schedule.require")}</p>}
			{/* SHOWTIMES */}
			{selectedCinema && !loading && (
				<div className="row">
					{filteredShowtimes.map((show) => (
						<div
							key={show.uid}
							className={`d-flex flex-row flex-wrap align-items-center ${styles["movie-line"]} justify-content-between border p-3`}
						>
							<div style={{ flex: "0 0 25%", textAlign: "left" }}>
								<h5 className="card-title mb-0">{show.movie_title}</h5>
							</div>
							<div style={{ flex: "0 0 20%", textAlign: "left" }}>
								<h6 className="card-subtitle mb-0 text-muted">{show.hall_name}</h6>
							</div>
							<div style={{ flex: "0 0 25%", textAlign: "left" }}>
								<p className="mb-0">
									<strong>{t("schedule.starts")}</strong>{" "}
									{new Date(show.starts_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
									<br />
									<strong>{t("schedule.ends")}</strong>{" "}
									{new Date(show.ends_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
								</p>
							</div>
							<div className={styles.priceInfo}>
								<p className="mb-0">
									<strong>{t("schedule.adultPrice")}</strong> {(show.adult_price / 100).toFixed(2)}
									<br />
									<strong>{t("schedule.childPrice")}</strong>
									{(show.child_price / 100).toFixed(2)}
								</p>
							</div>
							<div className={styles.bookButton}>
								<button
									className="btn btn-outline-primary btn-sm w-100"
									onClick={() => navigate(`/showtime/${show.uid}`)}
								>
									{t("schedule.book")}
								</button>
							</div>
						</div>
					))}

					{filteredShowtimes.length === 0 && <p>{t("schedule.noShowings")}</p>}
				</div>
			)}
			;
		</div>
	);
}

export default Schedule;
