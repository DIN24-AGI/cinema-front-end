import  { useEffect, useState } from "react";
import type { City, Cinema } from "../types/cinemaTypes";
import { API_ENDPOINTS } from "../util/baseURL";
import { useTranslation } from "react-i18next";
import CinemaSelector from '../components/CinemaSelector'
 
 const Contact = () => {
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
  
          if (!citiesRes.ok) throw new Error("contact.errorLoadCities");
          if (!cinemasRes.ok) throw new Error(t("contact.errorLoadCinemas"));
  
          const cityData: City[] = await citiesRes.json();
          const cinemaData: Cinema[] = await cinemasRes.json();
          setCities(cityData);
          const activeCinemas = cinemaData.filter(cn => cn.active);
          setCinemas(activeCinemas);
          } catch (err: any) {
          console.error(err);
          console.log(error)
          setError(err.message || t("contact.genericError"));
        } finally {
          setLoading(false);
        }
      };
  
      fetchEverything();
    }, [t, error]);

    
    const onSelectCinema = async (cinema: Cinema) => {
  setSelectedCinema(cinema);
};

	return (
    <div style={{ paddingBottom: 40 }}>
      <h2>{t("contact.title")}</h2>

      <section style={{ marginTop: 16 }}>
        <h3>{t("contact.chooseCinema")}</h3>
      </section>

      {loading && <p>{t("util.loading")}</p>}


			{/* Cinema selection area kept mounted to prevent jump */}
    <CinemaSelector
      cinemas={cinemas}
      cities={cities}
      selectedCinema={selectedCinema}
      onSelectCinema={onSelectCinema}
    />


      {/* Selected cinema details */}
      {selectedCinema && (
        <section>
          <div
            style={{
              marginTop: 20,
              padding: 16,
              border: "1px solid #ddd",
              borderRadius: 8,
              background: "#f9f9f9",
              maxWidth: 400,
            }}
          >
            <h4>{selectedCinema.name}</h4>
            <p>
              <strong>{t("contact.address")}</strong> {selectedCinema.address || "-"}
            </p>
            <p>
              <strong>{t("contact.phone")}</strong> {selectedCinema.phone || "-"}
            </p>
            <p>
              <strong>{t("contact.city")}</strong>
              {cities.find((c) => c.uid === selectedCinema.city_uid)?.name || ""}
            </p>
          </div>
        </section>
      )}


			
      {error && <div className="alert alert-danger">{error}</div>}

		</div>
	);}




export default Contact