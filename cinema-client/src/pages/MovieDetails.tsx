import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import type { Movie } from "../types/cinemaTypes";
import { API_ENDPOINTS } from "../util/baseURL";
import { useTranslation } from "react-i18next";


interface MovieShowtime {
  uid: string;
  starts_at: string;
  ends_at: string;
  hall_name: string;
  cinema_name: string;
}

const MovieDetails: React.FC = () => {
  const { t } = useTranslation();
  const { uid } = useParams<{ uid: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showtimes, setShowtimes] = useState<MovieShowtime[]>([]);
  const [loadingShowtimes, setLoadingShowtimes] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_ENDPOINTS.movies}/${uid}`);

        if (!res.ok) {
          throw new Error(t("movies.error"));
        }

        const data: Movie = await res.json();
        console.log("Fetched movie:", data);
        setMovie(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || t("movies.error"));
      } finally {
        setLoading(false);
      }
    };
      const fetchShowtimes = async () => {
      try {
        setLoadingShowtimes(true);
        const res = await fetch(`${API_ENDPOINTS.movies}/${uid}/showtimes`);
        if (!res.ok) throw new Error(t("movieDetails.errorShowtimes"));
        const data: MovieShowtime[] = await res.json();
        setShowtimes(data);
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoadingShowtimes(false);
      }
  };

    fetchMovie();
    fetchShowtimes();
  }, [uid, t]);

  if (loading) return <div className="text-center mt-4">{t("util.loading")}</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!movie) return null;

  const handleBack = () => {
    navigate(-1);
  }

  return (
    <div className="container mt-4">
        {/* Back button */}
      <button className="btn btn-secondary mb-4" onClick={handleBack}>{t("util.back")}
      </button>
      <div className="row g-4">
        {/* Poster */}
        <div className="col-md-4 text-center">
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="img-fluid rounded shadow"
          />
        </div>

        {/* Movie Info */}
        <div className="col-md-8">
          <h2>{movie.title}</h2>
          <p className="text-muted">
            {movie.release_year} • {movie.duration_minutes} min
          </p>

          {movie.description && (
            <p style={{ whiteSpace: "pre-line" }}>{movie.description}</p>
          )}
        </div>
      </div>

      {/* Showings */}
      <div className="mt-5">
        <h4>{t("movieDetails.upcoming")}</h4>

        {loadingShowtimes && <div className="mt-3">{t("movieDetails.loading")}</div>}

        {!loadingShowtimes && showtimes.length === 0 && (
          <div className="alert alert-info mt-3">
            {t("movieDetails.noShowings")}
          </div>
        )}

        {showtimes.map((st) => {
          const date = new Date(st.starts_at);
          const readable = date.toLocaleString("en-GB", {
            weekday: "short",
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "short"
          });

          return (
            <div key={st.uid} className="card p-3 mb-2 d-flex flex-row justify-content-between">
              <div>
                <strong>{readable}</strong>
                <p className="m-0">
                  {st.cinema_name} — {st.hall_name}
                </p>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/showtime/${st.uid}`)}
              >
                Book Ticket
              </button>
            </div>
    );
  })}
</div>


       
       
    
    </div>
  );
};

export default MovieDetails;
