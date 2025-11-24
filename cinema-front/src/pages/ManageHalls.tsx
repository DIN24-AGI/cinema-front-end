// src/pages/ManageHalls/ManageHalls.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { City, Cinema, Hall } from "../types/cinemaTypes";
import { API_ENDPOINTS } from "../util/baseURL";
import { useTranslation } from "react-i18next";

const ManageHalls: React.FC = () => {
	const { t } = useTranslation();
	const [cities, setCities] = useState<City[]>([]);
	const [cinemas, setCinemas] = useState<Cinema[]>([]);
	const [halls, setHalls] = useState<Hall[]>([]);
	const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(""); //unused
	const navigate = useNavigate();

	const token = () => localStorage.getItem("token");

	  // Fetch cities + cinemas once
  useEffect(() => {
    const fetchEverything = async () => {
      try {
        setLoading(true);
        const tok = token();

        const [citiesRes, cinemasRes] = await Promise.all([
          fetch(API_ENDPOINTS.cities, { headers: { Authorization: `Bearer ${tok}` } }),
          fetch(API_ENDPOINTS.cinemas, { headers: { Authorization: `Bearer ${tok}` } }),
        ]);

        if (!citiesRes.ok) throw new Error("Failed to load cities");
        if (!cinemasRes.ok) throw new Error(t("cinemas.errorLoadCities"));

        const cityData: City[] = await citiesRes.json();
        const cinemaData: Cinema[] = await cinemasRes.json();
        setCities(cityData);
        setCinemas(cinemaData);
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
  setHalls([]);
  try {
    setLoading(true);
    const res = await fetch(API_ENDPOINTS.hallsByCinema(cinema.uid), {
      headers: { Authorization: `Bearer ${token()}` },
    });
    if (!res.ok) throw new Error(t("halls.errorLoadHalls"));
    const data: Hall[] = await res.json();
    setHalls(data);
  } catch (error) {
    setError(getErrorMessage(error) || t("halls.genericError"));
  } finally {
    setLoading(false);
  }
};


const handleToggleActive = async (hall: Hall) => {
  const newStatus = !hall.active;
  try {
    const res = await fetch(`${API_ENDPOINTS.halls}/${hall.uid}/activate`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token()}`,
      },
      body: JSON.stringify({ active: newStatus }),
    });
		const data = await res.json();
		console.log(data);

    if (!res.ok) throw new Error(t("halls.toggleFailed"));

    setHalls(prev =>
      prev.map(h => (h.uid === hall.uid ? { ...h, active: newStatus } : h))
    );
  } catch (error) {
    console.error(error);
    alert(t("halls.toggleFailed"));
  }
};
const handleDelete = async (hall: Hall) => {
            if (!confirm(t("halls.deleteConfirm"))) return;
            try {
              const res = await fetch(API_ENDPOINTS.hallDetails(hall.uid), {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token()}`,
                  "Content-Type": "application/json",
                },
              });
              if (!res.ok) throw new Error(t("halls.deleteFailed"));
              setHalls((prev) => prev.filter((x) => x.uid !== hall.uid));
            } catch (err) {
              console.error(err);
              alert(t("halls.deleteFailed"));
            }
          }

	return (
		<div style={{ paddingBottom: 40 }}>
			<h2>{t("halls.manageTitle")}</h2>

			<section style={{ marginTop: 16 }}>
				<h3>{t("halls.chooseCinema")}</h3>
				
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
								<div style={{ fontSize: 11, color: "#666" }}>{cn.address}</div>
							</div>

							))
						) : !loading ? (
							// Show "no cinemas" message only if a city is selected and not loading
							<div style={{ color: "#666" }}>No cinemas in  yet</div>
						) : (
							// Loading indicator while fetching
							<div style={{ opacity: 0.6 }}>{t("halls.loading")}</div>
						)
					)/* No message if no city is selected */}
				</div>
			</section>



			{/* Halls area kept mounted */}
			<section style={{ marginTop: 24 }}>
				<div style={{ display: "flex", justifyContent: "space-between", minHeight: 32 }}>
					<h3 style={{ margin: 0, minHeight: 24 }}>
						{selectedCinema ? t("halls.titleForCinema", { cinema: selectedCinema.name }) : "\u00A0"}
					</h3>
					{selectedCinema && (
						<button
							onClick={() => navigate("/admin/halls/add", { state: { cinemaUid: selectedCinema.uid } })}
							className="btn btn-sm btn-outline-primary"
						>
							{t("halls.addHall")}
						</button>
					)}
				</div>

				<div
					style={{
						marginTop: 12,
						minHeight: 140,
						display: "grid",
						gap: 12,
					}}
				>
{selectedCinema &&
  halls.map((hall) => (
    <div
      key={hall.uid}
      style={{
        border: "1px solid #e2e2e2",
        borderRadius: 6,
        padding: "10px 12px",
        background: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <strong>{hall.name}</strong>
        <div style={{ fontSize: 12, color: "#666" }}>
          {hall.rows && hall.cols ? t("halls.seats", { count: hall.rows * hall.cols }) : ""}

          {" • "}
          <span className={`badge ${hall.active ? "bg-success" : "bg-secondary"}`}>
                {hall.active ? t("util.active") : t("util.inactive")}
              </span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        {/* Toggle button */}
        <button
          className={`btn btn-sm ${hall.active ? "btn-outline-danger" : "btn-outline-success"}`}
          onClick={()=>handleToggleActive(hall)}
        >
          {hall.active ? t("Deactivate") : t("Activate")}
        </button>

        {/* View / Delete buttons */}
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => navigate(`/admin/hall/${hall.uid}`, { state: { hall }})}
        >
          {t("halls.view")}
        </button>
				<button 
					className="btn btn-sm btn-outline-primary"
					onClick={()=> navigate(`/admin/halls/add`, { state: { hall }})}>
						{t("util.edit")}
					</button>
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={()=>handleDelete(hall)}
        >
          {t("halls.delete")}
        </button>
      </div>
    </div>
  ))
}


					{selectedCinema && halls.length === 0 && !loading && (
						<div style={{ color: "rgba(102, 102, 102, 1)" }}>{t("halls.noHalls")}</div>
					)}

					{selectedCinema && loading && halls.length === 0 && <div style={{ opacity: 0.6 }}>{t("halls.loading")}</div>}
				</div>
			</section>
      {error && <div className="alert alert-danger">{error}</div>}

		</div>
	);}


export default ManageHalls;
