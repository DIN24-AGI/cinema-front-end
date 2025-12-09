import { useEffect, useState } from "react";
import MovieBanner from "../components/MovieBanner";
import type { Movie, City, Cinema } from "../types/cinemaTypes";
import { API_ENDPOINTS } from "../util/baseURL";
import { useNavigate } from "react-router";
import CinemaSelectorDropdown from "../components/CinemaSelectorDropdown";
import { useTranslation } from "react-i18next";


const Movies = () => {
  const { t } = useTranslation();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate()

  // Filters
  const [searchTitle, setSearchTitle] = useState("");
  const [cities, setCities] = useState<City[]>([]); 
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null)
  const [selectedDate, setSelectedDate] = useState(""); 
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);

  useEffect(() => {
          const fetchCinemasAndCities = async () => {
            try {
              setLoading(true);
              const [citiesRes, cinemasRes] = await Promise.all([
                fetch(API_ENDPOINTS.cities,),
                fetch(API_ENDPOINTS.cinemas,),
              ]);
      
              if (!citiesRes.ok) throw new Error(t("contact.errorLoadCities"));
              if (!cinemasRes.ok) throw new Error(t("contact.errorLoadCinemas"));
      
              const cityData: City[] = await citiesRes.json();
              const cinemaData: Cinema[] = await cinemasRes.json();
  
              setCities(cityData);
              setCinemas(cinemaData.filter(c => c.active));

  
              if (!selectedCinema && cinemaData.length > 0) {
              setSelectedCinema(cinemaData[0]);
          }
              } catch (err: any) {
              console.error(err);
              console.log(error)
              setError(err.message || t("util.genericError"));
            } finally {
              setLoading(false);
            }
          };
      
          fetchCinemasAndCities();
        }, [error, selectedCinema, t]);

  // Fetch movies from backend with filters
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();
        if (selectedCinema) params.append("cinema_uid", selectedCinema.uid);
        // if (searchTitle) params.append("title", searchTitle);
        if (selectedDate) params.append("date", selectedDate);

        const res = await fetch(`${API_ENDPOINTS.movies}?${params.toString()}`);

        if (!res.ok) throw new Error(t("movies.error"));

        const data: Movie[] = await res.json();
        setMovies(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || t("movies.error"));
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [ selectedCinema, selectedDate, t] );

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
    navigate(`/movies/${movie.uid}`, { state: { movieUid: movie.uid }})
  };

  if (loading) return <p>{t("movies.loading")}</p>;
  if (error) return <p className="text-danger">{error}</p>;

  const onSelectCinema = (cinema: Cinema) => {
    setSelectedCinema(cinema);
  };
  return (
    <div>

      {/* ---------- FILTER BAR ---------- */}
      <div className="card p-3 mb-4 shadow-sm">

        <div className="row g-3">

          {/* Filter by location*/}
        
          <CinemaSelectorDropdown 
            cinemas={cinemas}
            cities={cities}
            widthClass="col-12 col-md-4"
            label={t("schedule.location")}
            selectedCinema={selectedCinema!}
            onSelectCinema={onSelectCinema}/>

          {/* Filter by movie title */}
          <div className="col-12 col-md-4">
            <label className="form-label fw-semibold">{t("schedule.title")}</label>
            <input
              type="text"
              className="form-control"
              placeholder={t("schedule.search")}
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
            />
          </div>

      

          {/* Filter by date*/}
          <div className="col-12 col-md-4">
            <label className="form-label fw-semibold">{t("schedule.date")}</label>
            <input
              type="date"
              className="form-control"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

        </div>
      </div>
      {/* -------------------------------- */}

      {/* ------- MOVIE RESULTS ------- */}
      <div className="row g-3">
        {filteredMovies.length === 0 && (
          <p className="text-center text-muted">No movies found.</p>
        )}

        {filteredMovies.map((movie) => (
          <div key={movie.uid} className="col-12 col-md-6 col-lg-4">
            <MovieBanner movie={movie} onDetails={openMovieDetails}/>
          
          </div>
        ))}
      </div>
    </div>
  );
};

export default Movies;
