import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import type { Movie } from "../types/cinemaTypes";
import { API_ENDPOINTS } from "../util/baseURL";

const MovieDetails: React.FC = () => {
  const { uid } = useParams<{ uid: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_ENDPOINTS.movies}/${uid}`);

        if (!res.ok) {
          throw new Error("Failed to load movie");
        }

        const data: Movie = await res.json();
        console.log("Fetched movie:", data);
        setMovie(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Error loading movie");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [uid]);

  if (loading) return <div className="text-center mt-4">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!movie) return null;

  const handleBack = () => {
    navigate("/movies")
  }

  return (
    <div className="container mt-4">
        {/* Back button */}
      <button className="btn btn-secondary mb-4" onClick={handleBack}> Back to Movies
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
        <h4>Upcoming Showings (Next 7 Days)</h4>

        {/* Placeholder for showings */}
        <div className="alert alert-info mt-3">
          Showings will be displayed here soon.
        </div>

        {/* Example structure — replace with real showings when backend is ready */}
        {false && (
          <div className="mt-3">
            <div className="card p-3 mb-2 d-flex flex-row justify-content-between">
              <div>
                <strong>Monday 19:00</strong>
                <p className="m-0">Hall 2</p>
              </div>
              <button className="btn btn-primary">Book Ticket</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
