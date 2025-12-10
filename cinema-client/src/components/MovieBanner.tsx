import React from "react";
import type { Movie } from "../types/cinemaTypes";
import { useTranslation } from "react-i18next";
interface MovieBannerProps {
  movie: Movie;
  onDetails?: (movie: Movie) => void;
}

const MovieBanner: React.FC<MovieBannerProps> = ({ movie, onDetails }) => {
  const { t } = useTranslation();
  return (
    <div className="card mb-3 shadow-sm" style={{ maxWidth: "600px" }}>
      <div className="row g-0 align-items-center">
        
        {/* Poster */}
        <div className="col-4 col-md-3">
          <img
            src={movie.poster_url || "/placeholder.png"}
            alt={movie.title}
            className="img-fluid rounded-start"
            style={{ objectFit: "cover", height: "100%" }}
          />
        </div>

        {/* Content */}
        <div className="col-8 col-md-9">
          <div className="card-body">
            <h5 className="card-title mb-1">{movie.title}</h5>

            <p className="card-text text-muted mb-2">
              {movie.release_year}
            </p>

            <button
              className="btn btn-primary btn-sm"
              onClick={() => onDetails?.(movie)}
            >
              {t("movies.details")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieBanner;
