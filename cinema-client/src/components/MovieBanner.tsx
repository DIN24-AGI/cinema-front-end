import React from "react";
import type { Movie } from "../types/cinemaTypes";
import { useTranslation } from "react-i18next";
import styles from "./MovieBanner.module.css";

interface MovieBannerProps {
	movie: Movie;
	onDetails?: (movie: Movie) => void;
}

const MovieBanner: React.FC<MovieBannerProps> = ({ movie, onDetails }) => {
	const { t } = useTranslation();
	return (
		<div className={`card mb-3 p-0 ${styles.movieBanner}`} data-testid="movie-card">
			<div className="d-flex g-0 h-100 p-0">
				{/* Poster */}
				<div style={{ width: "50%", flex: "0 0 50%" }}>
					<img src={movie.poster_url || "/placeholder.png"} alt={movie.title} className={styles.movieImage} />
				</div>

				{/* Content */}
				<div className="card-body d-flex flex-column justify-content-between" style={{ flex: "0 0 50%" }}>
					<div>
						<h5 className="card-title mb-2">{movie.title}</h5>
						<p className="card-text text-muted mb-3">{movie.release_year}</p>
					</div>
					<button className="btn btn-outline-primary btn-sm" onClick={() => onDetails?.(movie)}>
						{t("movies.details")}
					</button>
				</div>
			</div>
		</div>
	);
};

export default MovieBanner;
