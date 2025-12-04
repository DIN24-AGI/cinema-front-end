import React from "react";
import { useNavigate } from "react-router";

interface Showtime {
  id: string;
  time: string; 
}

interface Movie {
  id: string;
  title: string;
  poster: string;
  showtimes: Showtime[];
}

interface TodayMovieProps {
  movies: Movie[];
  location: string
}

const TodayMovieSection: React.FC<TodayMovieProps> = ({ movies, location }) => {
  const navigate = useNavigate();

  const openMovieDetails = (movie: Movie) => {
    console.log("Clicked movie:", movie);
    navigate(`/movies/${movie.id}`, { state: { movieUid: movie.id }})
  };

  const navigateToShowtimePage = (showtime) => {
    navigate(`/showtime/${showtime.id}/`, {state: {showtime_uid: showtime.id}})
  }

  return (
    <section className="mb-5">
      <h2 className="mb-4 fw-bold">Playing Today in {location}</h2>
      <div className="row g-4">
        {movies.map((movie) => (
          <div key={movie.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div className="card h-100 shadow-sm">
              <div
                style={{
                  width: "100%",
                  height: 300,
                  overflow: "hidden",
                }}
              >
                <img
                  src={movie.poster}
                  alt={movie.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{movie.title}</h5>

                {/* Showtimes */}
                <div className="mb-3">
                  {movie.showtimes.map((st) => (
                    <span
                      key={st.id}
                      className="badge bg-primary me-1 mb-1"
                    >
                      {st.time}
                    </span>
                  ))}
                </div>

                {/* Buttons */}
                <div className="mt-auto d-flex gap-2">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => openMovieDetails(movie)}
                    >
                       Details
                    </button>

                {/* Showtimes */}
                <div className="mb-3">
                  {movie.showtimes.map((st) => (
                    <button
                      key={st.id}
                      className="badge bg-primary me-1 mb-1 btn btn-sm"
                      onClick={() => navigateToShowtimePage(st)}
                    >
                      Book {st.time}
                    </button>
                  ))}
                </div>
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
