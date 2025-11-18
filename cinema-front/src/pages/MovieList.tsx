// MovieList: Public-facing page displaying active movies from the database
// - Fetches only active movies (no authentication required)
// - Provides search functionality to filter by title
// - Read-only view without admin controls
import { useEffect, useState, useMemo } from "react";
import MovieCard from "../components/MovieCard";
import { useTranslation } from "react-i18next";
import { API_ENDPOINTS } from "../util/baseURL";
import type { MovieItem } from "../types/cinemaTypes";

const MovieList = () => {
  const { t } = useTranslation();
  // Raw list of active movies from backend
  const [movies, setMovies] = useState<MovieItem[]>([]);
  // UI state for loading/error indicators
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  // Client-side search filter
  const [search, setSearch] = useState("");

  // Fetch active movies on initial mount (no auth token required for public view)
  useEffect(() => {
    const fetchMovies = async () => {
      const token = localStorage.getItem("token");
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
        // Filter to show only active movies
        setMovies(data.filter((m) => m.active));
      } catch (e: any) {
        setError(
          e.message === "fetchFailed"
            ? t("movies.fetchError")
            : "Unexpected error"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [t]);

  // Derived list applying search (case-insensitive substring match on title)
  const filteredMovies = useMemo(() => {
    const q = search.trim().toLowerCase();
    return movies.filter((m) => q === "" || m.title.toLowerCase().includes(q));
  }, [movies, search]);

  return (
    <div className="container py-4">
      <h1 className="mb-4">{t("movieList.title")}</h1>

      {/* Search input */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          style={{ maxWidth: 400 }}
          placeholder={t("movies.searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && <div className="alert alert-info">Loading movies…</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Empty state when no movies match search */}
      {!loading && !error && filteredMovies.length === 0 && (
        <div className="alert alert-warning">No movies found.</div>
      )}

      <div className="d-flex flex-column gap-3">
        {/* Render filtered list without action buttons (read-only view) */}
        {filteredMovies.map((m) => (
          <MovieCard
            key={m.uid}
            uid={m.uid}
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

export default MovieList;
