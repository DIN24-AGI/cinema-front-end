import { useState, useEffect } from "react"
import CinemaSelector from "../components/CinemaSelector"
import { useTranslation } from "react-i18next"; 
import type { City, Cinema } from "../types/cinemaTypes"
import { API_ENDPOINTS } from "../util/baseURL";

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
    <>
      {loading && <p>{t("contact.loading")}</p>}
    <CinemaSelector
        cinemas={cinemas}
        cities={cities}
        selectedCinema={selectedCinema}
        onSelectCinema={onSelectCinema}
      />

    </>
  )
}

export default Home