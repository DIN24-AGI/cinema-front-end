import React from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import styles from "./TodayMoviesSection.module.css";

// Showtimes for each movie
interface ShowtimeShort {
	id: string;
	time: string;
}

// Movie with grouped showtimes
interface MovieWithShowtimes {
	id: string;
	title: string;
	poster: string;
	showtimes: ShowtimeShort[];
}

interface TodayMovieProps {
	movies: MovieWithShowtimes[];
	location: string;
}

const TodayMovieSection: React.FC<TodayMovieProps> = ({ movies, location }) => {
	const navigate = useNavigate();
	const { t } = useTranslation();

	const openMovieDetails = (movie: MovieWithShowtimes) => {
		navigate(`/movies/${movie.id}`, { state: { movieUid: movie.id } });
	};

	const navigateToShowtimePage = (showtime: ShowtimeShort) => {
		navigate(`/showtime/${showtime.id}/`, { state: { showtime_uid: showtime.id } });
	};

	return (
		<section className="mb-5">
			<h2 className="mb-4 fw-bold">{t("movies.today", { location: location })}</h2>
			<div className="row g-4">
				{movies.map((movie) => (
					<div key={movie.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
						<div
							className={`card h-100 shadow-sm ${styles["movie-card"]}`}
							onClick={() => openMovieDetails(movie)}
							style={{ cursor: "pointer" }}
						>
							<div style={{ width: "100%", height: 300, overflow: "hidden" }}>
								<img
									src={movie.poster}
									alt={movie.title}
									style={{ width: "100%", height: "100%", objectFit: "cover" }}
								/>
							</div>

							<div className="card-body d-flex flex-column">
								<h5 className="card-title">{movie.title}</h5>

								{/* Showtimes */}
								<div className="mb-3">
									{movie.showtimes.map((st) => (
										<button
											key={st.id}
											className="badge bg-primary me-1 mb-1 btn btn-sm"
											onClick={(e) => {
												e.stopPropagation();
												navigateToShowtimePage(st);
											}}
										>
											Book {st.time}
										</button>
									))}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</section>
	);
};

export default TodayMovieSection;
