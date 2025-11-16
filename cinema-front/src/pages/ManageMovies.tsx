// ManageMovies: Admin page for listing and managing movies
// - Fetches movies from backend
// - Provides client-side search and active-only filter
// - Supports edit, delete, and activate/deactivate actions per movie
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import MovieCard from "../components/Movie.tsx";
import { useTranslation } from "react-i18next";
import { API_ENDPOINTS } from "../util/baseURL";
import type { MovieItem } from "../types/cinemaTypes.ts";

const ManageMovies = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // Raw list returned by the backend
  const [movies, setMovies] = useState<MovieItem[]>([]);
  // UI state for loading/error indicators
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  // Client-side filter state
  const [search, setSearch] = useState("");
  const [activeOnly, setActiveOnly] = useState(false);

  // Fetch movies on initial mount; requires valid auth token in localStorage
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
        console.log(movies);
      }
    };
    fetchMovies();
  }, []);

  // Navigate to edit page for a given movie uid
  const handleEdit = (uid: string) => {
    navigate(`/admin/movies/edit/${uid}`);
  };

  // Delete a movie by uid after user confirmation
  const handleDelete = async (uid: string) => {
    if (!window.confirm(t("movies.deleteConfirm"))) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("noToken");

      const res = await fetch(`${API_ENDPOINTS.movies}/${uid}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("deleteFailed");

      // Remove from local state
      setMovies((prev) => prev.filter((m) => m.uid !== uid));
    } catch (e: any) {
      alert(
        e.message === "deleteFailed"
          ? t("movies.deleteError")
          : e.message === "noToken"
          ? t("cinemas.noToken")
          : t("cinemas.genericError")
      );
    }
  };

  // Toggle the active state of a movie (PATCH) and sync local state
  const handleToggle = async (uid: string, nextActive: boolean) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("noToken");

      const res = await fetch(`${API_ENDPOINTS.movies}/${uid}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ active: nextActive }),
      });

      if (!res.ok) throw new Error("toggleFailed");

      setMovies((prev) =>
        prev.map((m) => (m.uid === uid ? { ...m, active: nextActive } : m))
      );
    } catch (e: any) {
      alert(
        e.message === "noToken" ? t("cinemas.noToken") : t("movies.toggleError")
      );
    }
  };

  // Derived list applying search (case-insensitive substring) and active-only filter
  const filteredMovies = useMemo(() => {
    const q = search.trim().toLowerCase();
    return movies.filter((m) => {
      const matchesSearch = q === "" || m.title.toLowerCase().includes(q);
      const matchesActive = !activeOnly || m.active;
      return matchesSearch && matchesActive;
    });
  }, [movies, search, activeOnly]);

  return (
    <div className="container py-4">
      {/* Header controls: search input, status radio filter, and Add Movie */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <input
            type="text"
            className="form-control"
            style={{ minWidth: 220 }}
            placeholder={t("movies.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="statusFilter"
              id="filterAll"
              checked={!activeOnly}
              onChange={() => setActiveOnly(false)}
            />
            <label className="form-check-label" htmlFor="filterAll">
              {t("movies.filterAll")}
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="statusFilter"
              id="filterActive"
              checked={activeOnly}
              onChange={() => setActiveOnly(true)}
            />
            <label className="form-check-label" htmlFor="filterActive">
              {t("movies.filterActiveOnly")}
            </label>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/admin/movies/add")}
          >
            {t("movies.addMovie")}
          </button>
        </div>
      </div>

      {loading && <div className="alert alert-info">Loading movies…</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Empty state shown when no movies match current filters */}
      {!loading && !error && filteredMovies.length === 0 && (
        <div className="alert alert-warning">No movies found.</div>
      )}

      <div className="d-flex flex-column gap-3">
        {/* Render filtered list; pass handlers for edit/delete/toggle */}
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
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggle={handleToggle}
          />
        ))}
      </div>
    </div>
  );
};

export default ManageMovies;
