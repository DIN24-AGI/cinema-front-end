import  { useEffect, useState } from "react";
import type { City, Cinema } from "../types/cinemaTypes";
import { API_ENDPOINTS } from "../util/baseURL";
import { useTranslation } from "react-i18next";
 
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

        if (!citiesRes.ok) throw new Error("Failed to load cities");
        if (!cinemasRes.ok) throw new Error(t("cinemas.errorLoadCities"));

        const cityData: City[] = await citiesRes.json();
        const cinemaData: Cinema[] = await cinemasRes.json();
        setCities(cityData);
        const activeCinemas = cinemaData.filter(cn => cn.active);
        setCinemas(activeCinemas);
        } catch (err: any) {
        console.error(err);
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
    <div style={{ paddingBottom: 40 }}>
      <h2>{t("contact.title")}</h2>

      <section style={{ marginTop: 16 }}>
        <h3>{t("contact.chooseCinema")}</h3>
      </section>

      {loading && <p>{t("contact.loading")}</p>}


			{/* Cinema selection area kept mounted to prevent jump */}
			<section>	

				<div
					style={{
						display: "flex",
						gap: 12,
						flexWrap: "wrap",
						minHeight: 90,
						alignItems: cinemas.length === 0 ? "center" : "flex-start",
					}}
				>{cinemas.map((cn) => {
            const cityName = cities.find((c) => c.uid === cn.city_uid)?.name || "";
            const isSelected = selectedCinema?.uid === cn.uid;

            return (
              <div
                key={cn.uid}
                onClick={() => onSelectCinema(cn)}
                style={{
                  padding: 12,
                  width: 180,
                  borderRadius: 8,
                  border: isSelected ? "2px solid #0d6efd" : "1px solid #ddd",
                  background: "#fff",
                  cursor: "pointer",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  transition: "border-color .15s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget.style.borderColor = "#0d6efd"))
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget.style.borderColor = isSelected ? "#0d6efd" : "#ddd"))
                }
              >
                <div style={{ fontSize: 12, color: "#999", marginBottom: 4 }}>
                  {cityName}
                </div>
                <strong style={{ fontSize: 14 }}>{cn.name}</strong>
              </div>
            );
          })}
        </div>
      </section>

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
              <strong>Address: </strong> {selectedCinema.address || "-"}
            </p>
            <p>
              <strong>Phone: </strong> {selectedCinema.phone || "-"}
            </p>
            <p>
              <strong>City: </strong>
              {cities.find((c) => c.uid === selectedCinema.city_uid)?.name || ""}
            </p>
          </div>
        </section>
      )}


			
      {error && <div className="alert alert-danger">{error}</div>}

		</div>
	);}




export default Contact