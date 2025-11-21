// ManageCinemas: Admin page for viewing and managing all cinemas
// - Fetches cinemas and cities from backend API
// - Merges cinema data with city names for display
// - Supports activate/deactivate toggle and navigation to cinema details
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import CinemaCard from "../components/CinemaCard/CinemaCard";
import { API_ENDPOINTS } from "../util/baseURL";
import type { Cinema, City } from "../types/cinemaTypes";
import { useTranslation } from "react-i18next";

const ManageCinemas: React.FC = () => {
  const { t } = useTranslation();
  // List of cinemas with merged city_name property
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  // List of cities for lookups
  // const [cities, setCities] = useState<City[]>([]);
  // UI state for loading/error indicators
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch cinemas and cities on initial mount; requires valid auth token
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        setLoading(true);
        setError("");

        // Fetch cities and cinemas in parallel for efficiency
        const [citiesRes, cinemasRes] = await Promise.all([
          fetch(`${API_ENDPOINTS.cities}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${API_ENDPOINTS.cinemas}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (!citiesRes.ok || !cinemasRes.ok) throw new Error("fetchFailed");

        const citiesData: City[] = await citiesRes.json();
        const cinemasData: Cinema[] = await cinemasRes.json();

        // Merge cinema data with city names by matching city_uid
        // Fallback to "Unknown City" if city not found
        const merged = cinemasData.map((cinema) => {
          const city = citiesData.find((c) => c.uid === cinema.city_uid);
          return {
            ...cinema,
            city_name: city ? city.name : t("util.unknownCity"),
          };
        });

        //setCities(citiesData);
        setCinemas(merged);
      } catch (e: any) {
        setError(
          e.message === "fetchFailed"
            ? t("cinemas.fetchError")
            : t("cinemas.genericError")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t]);

  // Toggle the active state of a cinema (PATCH) and sync local state
  // Flips the current state and updates both backend and UI optimistically
  const handleToggleActive = async (
    cinemaId: string,
    currentState: boolean
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("noToken");
      // Send PATCH request with inverted active state
      const res = await fetch(`${API_ENDPOINTS.cinemas}/${cinemaId}/activate`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ active: !currentState }),
      });
      if (!res.ok) throw new Error("toggleFailed");
      // Update local state with the response from the backend
      const updatedCinema = await res.json();
      setCinemas((prev) =>
        prev.map((c) => (c.uid === cinemaId ? updatedCinema : c))
      );
    } catch (e: any) {
      console.error(e);
      alert(
        e.message === "toggleFailed"
          ? t("cinemas.toggleError")
          : e.message === "noToken"
          ? t("cinemas.noToken")
          : t("cinemas.genericError")
      );
    }
  };

  // Navigate to the add cinema form page
  const handleAddCinema = () => navigate("/admin/add-cinema");

  // Navigate to cinema details page, passing cinema object via route state
  const handleViewDetails = (cinema: Cinema) =>
    navigate(`/admin/cinemas/${cinema.uid}`, { state: { cinema } });

  return (
    <div className="container mt-4">
      <h2 className="mb-4">{t("cinemas.title")}</h2>

      {/* Button to navigate to add cinema form */}
      <button className="btn btn-primary mb-3" onClick={handleAddCinema}>
        + {t("cinemas.addCinema")}
      </button>

      {/* Loading state indicator */}
      {loading && (
        <div className="alert alert-info">{t("cinemas.loading")}</div>
      )}

      {/* Error state indicator */}
      {error && (
        <div className="alert alert-danger">{t("cinemas.genericError")}</div>
      )}

      <div className="row">
        {/* Empty state when no cinemas exist */}
        {!loading && !error && cinemas.length === 0 && (
          <div className="col-12">
            <div className="alert alert-warning">{t("cinemas.noCinemas")}</div>
          </div>
        )}

        {/* Render cinema cards in responsive grid (1 col mobile, 2 col tablet, 3 col desktop) */}
        {cinemas.map((cinema) => (
          <div className="col-md-6 col-lg-4 mb-4" key={cinema.uid}>
            <CinemaCard
              id={cinema.uid}
              name={cinema.name}
              city={cinema.city_name ?? t("util.unknownCity")}
              address={cinema.address}
              phone={cinema.phone ?? ""}
              active={cinema.active}
              onToggleActive={() =>
                handleToggleActive(cinema.uid, cinema.active)
              }
              onViewDetails={() => handleViewDetails(cinema)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageCinemas;
