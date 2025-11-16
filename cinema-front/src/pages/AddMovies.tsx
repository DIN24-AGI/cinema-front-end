import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard.tsx";
import { useTranslation } from "react-i18next";
import { API_ENDPOINTS } from "../util/baseURL";

type MovieItem = {
  title: string;
  duration_minutes: number;
  description: string;
  poster_url: string;
  release_year: number;
  shows_allowed: number;
  shows_left: number;
  active: boolean;
};

const AddMovies = () => {
  const { t } = useTranslation();
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchMovies = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setMovies([]);
        return;
      }
      try {
        setLoading(true);
        setError("");
        const res = await fetch(API_ENDPOINTS.movies, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("fetchFailed");
        const data: MovieItem[] = await res.json();
        setMovies(data);
      } catch (e: any) {
        setError(
          e.message === "fetchFailed"
            ? "Failed to load movies"
            : "Unexpected error"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  return (
    <div className="container py-4">
      {loading && <div className="alert alert-info">Loading movies…</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && movies.length === 0 && (
        <div className="alert alert-warning">No movies found.</div>
      )}

      <div className="d-flex flex-column gap-3">
        {movies.map((m, idx) => (
          <MovieCard
            key={idx}
            title={m.title}
            duration_minutes={m.duration_minutes}
            description={m.description}
            poster_url={m.poster_url}
            release_year={m.release_year}
            shows_allowed={m.shows_allowed}
            shows_left={m.shows_left}
            active={m.active}
          />
        ))}
      </div>
    </div>
  );
};

export default AddMovies;
