import { useEffect, useState } from "react";
import MovieBanner from "../components/MovieBanner";
import type { Movie } from "../types/cinemaTypes";
import { API_ENDPOINTS } from "../util/baseURL";
import { useNavigate } from "react-router";

const Movies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate()

  // Filters
  const [searchTitle, setSearchTitle] = useState("");
  // const [location, setLocation] = useState(""); // placeholder
  // const [date, setDate] = useState(""); // placeholder

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_ENDPOINTS.movies);

        if (!res.ok) throw new Error("Failed to load movies");

        const data: Movie[] = await res.json();
        const activeMovies = data.filter((m) => m.active);

        setMovies(activeMovies);
        setFilteredMovies(activeMovies);
      } catch (err: any) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);


  useEffect(() => {
    let result = [...movies];

    if (searchTitle.trim() !== "") {
      result = result.filter((m) =>
        m.title.toLowerCase().includes(searchTitle.toLowerCase())
      );
    }

    setFilteredMovies(result);
  }, [searchTitle, movies]);

  const openMovieDetails = (movie: Movie) => {
    console.log("Clicked movie:", movie);
    navigate(`/movies/${movie.uid}`, { state: { movieUid: movie.uid }})
  };

  if (loading) return <p>Loading movies...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div>

      {/* ---------- FILTER BAR ---------- */}
      <div className="card p-3 mb-4 shadow-sm">

        <div className="row g-3">

          {/* Filter by location (placeholder) */}
          <div className="col-12 col-md-4">
            <label className="form-label fw-semibold">Location</label>
            <select className="form-select" disabled>
              <option>Coming soon...</option>
            </select>
          </div>

          {/* Filter by movie title */}
          <div className="col-12 col-md-4">
            <label className="form-label fw-semibold">Movie Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search by title..."
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
            />
          </div>

      

          {/* Filter by date (placeholder) */}
          <div className="col-12 col-md-4">
            <label className="form-label fw-semibold">Date</label>
            <input
              type="date"
              className="form-control"
              disabled
            />
          </div>

        </div>
      </div>
      {/* -------------------------------- */}

      {/* ------- MOVIE RESULTS ------- */}
      <div className="row g-3">
        {filteredMovies.map((movie) => (
          <div className="col-12 col-md-6 col-lg-4" key={movie.uid}>
            <MovieBanner movie={movie} onDetails={openMovieDetails} />
          </div>
        ))}

        {filteredMovies.length === 0 && (
          <p className="text-center text-muted">No movies found.</p>
        )}
      </div>
    </div>
  );
};

export default Movies;
