import { useState, useEffect } from "react"
import CinemaSelector from "../components/CinemaSelector"
import { useTranslation } from "react-i18next"; 
import type { City, Cinema } from "../types/cinemaTypes"
import { API_ENDPOINTS } from "../util/baseURL";

import TodayMoviesSection from "../components/TodayMoviesSection";
import ComingSoonSection from "../components/ComingSoonSection";

const moviesToday = [
  {
    id: 1,
    title: "Zootropolis 2",
    poster: "https://upload.wikimedia.org/wikipedia/en/6/6a/Zootopia_2_%282025_film%29.jpg",
    showtimes: [
      { id: "st1", time: "14:30" },
      { id: "st2", time: "17:00" },
      { id: "st3", time: "20:15" },
    ],
  },
  {
    id: 2,
    title: "Wicked",
    poster: "https://www.suomalainen.com/cdn/shop/files/9781035421060_1-wicked.jpg?v=1743786998",
    showtimes: [
      { id: "st4", time: "13:45" },
      { id: "st5", time: "16:30" },
    ],
  },
  {id: 3,
    title: "Sisu 2",
    poster: "https://upload.wikimedia.org/wikipedia/en/c/c0/Sisu_Road_to_Revenge.jpg",
    showtimes: [
      { id: "st6", time: "19:45" },
      { id: "st7", time: "21:30" },
    ]
  },
  {
    id: 4,
    title: "Free Solo",
    poster: "https://cdn.cinematerial.com/p/297x/t4joxqjv/free-solo-movie-poster-md.jpg?v=1539514421",
     showtimes: [
      { id: "st8", time: "20:45" },
      { id: "st9", time: "21:30" },
    ]

  }
];

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
  

    useEffect(() => {
        const fetchEverything = async () => {
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
            } catch (err: any) {
            console.error(err);
            console.log(error)
            setError(err.message || t("cinemas.genericError"));
          } finally {
            setLoading(false);
          }
        };
    
        fetchEverything();
      }, [t]);

      const onSelectCinema = async (cinema: Cinema) => {
        setSelectedCinema(cinema);
      };
      

  return (
    <div className ="container mt-4">
      {loading && <p>{t("contact.loading")}</p>}
    <CinemaSelector
        cinemas={cinemas}
        cities={cities}
        selectedCinema={selectedCinema}
        onSelectCinema={onSelectCinema}
      />

    {/* Movies Today */}
      <TodayMoviesSection movies={moviesToday} />

      {/* Coming Soon */}
      <ComingSoonSection movies={comingSoon} />

    </div>
  )
}

export default Home