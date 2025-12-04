import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"; 
import type { City, Cinema } from "../types/cinemaTypes"
import { API_ENDPOINTS } from "../util/baseURL";

import TodayMoviesSection from "../components/TodayMoviesSection";
import ComingSoonSection from "../components/ComingSoonSection";
import CinemaSelectorDropdown from "../components/CinemaSelectorDropdown";

interface ShowtimeWithMovie {
  uid: string;
  movie_uid: string;
  hall_uid: string;
  starts_at: string;
  ends_at: string;
  adult_price?: number;
  child_price?: number;
  movie_title: string;
  poster_url: string;
  hall_name: string;
  cinema_name: string;
}
interface MovieWithShowtimes {
  id: string;            
  title: string;
  poster: string;
  showtimes: { id: string; time: string }[];
}



const comingSoon = [
  {
    id: 10,
    title: "Echoes of Tomorrow",
    banner: "https://picsum.photos/1000/350?random=10",
  },
  {
    id: 11,
    title: "Dragon's Gate",
    banner: "https://picsum.photos/1000/350?random=11",
  }
];

const Home = () => {
    const { t } = useTranslation();
    // const navigate = useNavigate();

    const [cities, setCities] = useState<City[]>([]);
    const [cinemas, setCinemas] = useState<Cinema[]>([]);
    const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [moviesToday, setMoviesToday] = useState<MovieWithShowtimes[]>([])
  

    useEffect(() => {
        const fetchCinemasAndCities = async () => {
          try {
            setLoading(true);
            const [citiesRes, cinemasRes] = await Promise.all([
              fetch(API_ENDPOINTS.cities,),
              fetch(API_ENDPOINTS.cinemas,),
            ]);
    
            if (!citiesRes.ok) throw new Error("Failed to load cities");
            if (!cinemasRes.ok) throw new Error(t("cinemas.errorLoadCities"));
    
            const cityData: City[] = await citiesRes.json();
            const cinemaData: Cinema[] = await cinemasRes.json();

            setCities(cityData);

            const activeCinemas = cinemaData.filter(cn => cn.active);
            setCinemas(activeCinemas);

            if (!selectedCinema && activeCinemas.length > 0) {
          setSelectedCinema(activeCinemas[0]);
        }
            } catch (err: any) {
            console.error(err);
            console.log(error)
            setError(err.message || t("cinemas.genericError"));
          } finally {
            setLoading(false);
          }
        };
    
        fetchCinemasAndCities();
      }, [t, selectedCinema]);


      useEffect(() => {
    const fetchMoviesToday = async () => {
      if (!selectedCinema) return;

      setLoading(true);
      setError("");

      const today = new Date().toISOString().split("T")[0];
      try {
        const res = await fetch(`${API_ENDPOINTS.showtimesInCinema}?cinema_uid=${selectedCinema.uid}&date=${today}`
);

        if (!res.ok) throw new Error("Failed to fetch showtimes");

        const data: ShowtimeWithMovie[] = await res.json();

        const grouped: MovieWithShowtimes[] = groupShowtimesByMovie(data);
        setMoviesToday(grouped);

      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load movies");
      } finally {
        setLoading(false);
      }
    };

    fetchMoviesToday();
  }, [selectedCinema]);

  const onSelectCinema = (cinema: Cinema) => {
    setSelectedCinema(cinema);
  };

   
  return (
    <div className ="container mt-4">
      {loading && <p>{t("contact.loading")}</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {cinemas.length > 0 && selectedCinema && (
        <CinemaSelectorDropdown
          cinemas={cinemas}
          cities={cities}
          label={"Select your cinema"}
          widthClass="mb-4"
          selectedCinema={selectedCinema}
          onSelectCinema={onSelectCinema}
        />
      )}

    {/* Movies Today */}
    {selectedCinema && (
  <TodayMoviesSection movies={moviesToday} location={selectedCinema.name} />
)}


      {/* Coming Soon */}
      <ComingSoonSection movies={comingSoon} />

    </div>
  )
}
// Helper to transform showtimes into Movie[] for display
const groupShowtimesByMovie = (showtimes: ShowtimeWithMovie[]): MovieWithShowtimes[] => {
  const map = new Map<string, MovieWithShowtimes>();

  showtimes.forEach(st => {
    if (!map.has(st.movie_uid)) {
      map.set(st.movie_uid, {
        id: st.movie_uid,
        title: st.movie_title,
        poster: st.poster_url,
        showtimes: [{ id: st.uid, time: new Date(st.starts_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }],
      });
    } else {
      map.get(st.movie_uid)!.showtimes.push({
        id: st.uid,
        time: new Date(st.starts_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
    }
  });

  return Array.from(map.values());
};
export default Home