import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"; 
import type { City, Cinema } from "../types/cinemaTypes"
import { API_ENDPOINTS } from "../util/baseURL";

import TodayMoviesSection from "../components/TodayMoviesSection";
import ComingSoonSection from "../components/ComingSoonSection";
import CinemaSelectorDropdown from "../components/CinemaSelectorDropdown";
import type { Showtime } from "../types/showtime";

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
interface Movie {
  id: string;            
  title: string;
  poster: string;
  showtimes: { id: string; time: string }[];
}

// const moviesToday = [
//   {
//     id: 1,
//     title: "Zootropolis 2",
//     poster: "https://upload.wikimedia.org/wikipedia/en/6/6a/Zootopia_2_%282025_film%29.jpg",
//     showtimes: [
//       { id: "st1", time: "14:30" },
//       { id: "st2", time: "17:00" },
//       { id: "st3", time: "20:15" },
//     ],
//   },
//   {
//     id: 2,
//     title: "Wicked",
//     poster: "https://www.suomalainen.com/cdn/shop/files/9781035421060_1-wicked.jpg?v=1743786998",
//     showtimes: [
//       { id: "st4", time: "13:45" },
//       { id: "st5", time: "16:30" },
//     ],
//   },
//   {id: 3,
//     title: "Sisu 2",
//     poster: "https://upload.wikimedia.org/wikipedia/en/c/c0/Sisu_Road_to_Revenge.jpg",
//     showtimes: [
//       { id: "st6", time: "19:45" },
//       { id: "st7", time: "21:30" },
//     ]
//   },
//   {
//     id: 4,
//     title: "Free Solo",
//     poster: "https://cdn.cinematerial.com/p/297x/t4joxqjv/free-solo-movie-poster-md.jpg?v=1539514421",
//      showtimes: [
//       { id: "st8", time: "20:45" },
//       { id: "st9", time: "21:30" },
//     ]

//   }
// ];

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

    const [cities, setCities] = useState<City[]>([]);
    const [cinemas, setCinemas] = useState<Cinema[]>([]);
    const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [moviesToday, setMoviesToday] = useState<Showtime[]>([])
  

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
        const res = await fetch(`${API_ENDPOINTS.showtimes}?cinema_uid=${selectedCinema.uid}&date=${today}`
);

        if (!res.ok) throw new Error("Failed to fetch showtimes");

        const data: ShowtimeWithMovie[] = await res.json();

        const grouped: Movie[] = groupShowtimesByMovie(data);
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
const groupShowtimesByMovie = (showtimes: ShowtimeWithMovie[]): Movie[] => {
  const map = new Map<string, Movie>();

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