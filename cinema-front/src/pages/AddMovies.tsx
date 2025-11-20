import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard.tsx";
import { useTranslation } from "react-i18next";
import { API_ENDPOINTS } from "../util/baseURL";
import type { MovieItem } from "../types/cinemaTypes.ts";

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
        // Use i18n translation keys instead of hard-coded strings
        setError(
          e.message === "fetchFailed"
            ? t("movies.fetchError")
            : t("cinemas.genericError")
        );
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  return (
    <div className="container py-4">
      {loading && (
        <div className="alert alert-info">{t("cinemas.loading")}</div>
      )}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && movies.length === 0 && (
        <div className="alert alert-warning">{t("cinemas.noCinemas")}</div>
      )}

      <div className="d-flex flex-column gap-3">
        {movies.map((m, idx) => (
          <MovieCard
            uid={m.uid}
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
