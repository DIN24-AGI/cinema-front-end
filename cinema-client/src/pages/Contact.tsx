import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { City, Cinema, Hall } from "../types/cinemaTypes";
import { API_ENDPOINTS } from "../util/baseURL";
import { useTranslation } from "react-i18next";
 
 const Contact = () => {
  const { t } = useTranslation();
	const [cities, setCities] = useState<City[]>([]);
	const [cinemas, setCinemas] = useState<Cinema[]>([]);
	const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(""); //unused
	const navigate = useNavigate();


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

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}


const onSelectCinema = async (cinema: Cinema) => {
  setSelectedCinema(cinema);
};

console.log("Fetching cities from:", API_ENDPOINTS.cities);
console.log("Fetching cinemas from:", API_ENDPOINTS.cinemas);
console.log(selectedCinema)
console.log(cities)



	return (
		<div style={{ paddingBottom: 40 }}>
			<h2>{t("contact.title")}</h2>

			<section style={{ marginTop: 16 }}>
				<h3>{t("contact.chooseCinema")}</h3>
				
			</section>

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
				>
					{ (
						cinemas.length > 0 ? (
							// Show cinema cards
							cinemas.map((cn) => (
							<div
								key={cn.uid}
								onClick={() => onSelectCinema(cn)}
								style={{
									padding: 12,
									width: 180,
									borderRadius: 8,
									border: selectedCinema?.uid === cn.uid ? "2px solid #0d6efd" : "1px solid #ddd",
									background: "#fff",
									cursor: "pointer",
									boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
									transition: "border-color .15s",
								}}
							>

								{/* CITY NAME */}
								<div style={{ fontSize: 12, color: "#999", marginBottom: 4 }}>
									{cities.find(c => c.uid === cn.city_uid)?.name || ""}
								</div>

								<strong style={{ fontSize: 14 }}>{cn.name}</strong>
								
							</div>

							))
						) : !loading ? (
							// Show "no cinemas" message only if a city is selected and not loading
							<div style={{ color: "#666" }}>No cinemast</div>
						) : (
							// Loading indicator while fetching
							<div style={{ opacity: 0.6 }}>{t("halls.loading")}</div>
						)
					)/* No message if no city is selected */}
				</div>


			</section>

      <section>
        {selectedCinema && (
          <div 
            style={{
              marginTop: 20,
              padding: 16, 
              border: "1px solid #ddd",
              borderRadius: 8,
              background: "#f9f9f9",
              maxWidth: 400,    
            }}>
              <h4>{selectedCinema.name}</h4>
              <p><strong>Address: </strong> {selectedCinema.address || "-"}</p>
              <p><strong>Phone: </strong> {selectedCinema.phone || "-"}</p>
              <p><strong>City: </strong>{cities.find(c => c.uid === selectedCinema.city_uid)?.name || ""}</p>

            </div>
        )}
      </section>

			
      {error && <div className="alert alert-danger">{error}</div>}

		</div>
	);}




export default Contact