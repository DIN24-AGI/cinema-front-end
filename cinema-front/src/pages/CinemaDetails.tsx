import React, { useEffect, useState } from "react"; // React core + hooks for lifecycle and state
import { useNavigate, useParams, useLocation } from "react-router"; // Router utilities for navigation, URL params, and passed state
import type { Cinema, Hall } from "../types/cinemaTypes"; // TypeScript interfaces for strong typing
import { API_ENDPOINTS } from "../util/baseURL"; // Centralized API endpoints (includes cities, cinemas, halls)
import { useTranslation } from "react-i18next"; // i18n translation hook

const CinemaDetails: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation(); // Access navigation state
  const cinema = location.state?.cinema; // Cinema object passed from list page (optimizes display, used for deletion)

  const navigate = useNavigate();
  const { id: cinema_uid } = useParams<{ id: string }>(); // UID from route /admin/cinemas/:id
  const [cinemaData, setCinemaData] = useState<Cinema | null>(null); // Fetched cinema details (authoritative backend data)
  const [halls, setHalls] = useState<Hall[]>([]); // Associated halls for display
  const [loading, setLoading] = useState(true); // Global loading state for cinema fetch
  const [error, setError] = useState(""); // Error message surface
  const token = localStorage.getItem("token"); // Auth token for API requests

  // Fetch cinema details on mount / param change (ensures up-to-date data even if state was passed)
  useEffect(() => {
    const fetchCinema = async () => {
      if (!cinema_uid) return; // No UID -> nothing to fetch
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_ENDPOINTS.cinemas}/${cinema_uid}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch cinema");

        const data: Cinema = await res.json();
        setCinemaData(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchCinema();
  }, [cinema_uid]);

  // Fetch list of halls associated with this cinema
  const fetchHalls = async () => {
    if (!cinema_uid) return;
    try {
      const res = await fetch(API_ENDPOINTS.hallsByCinema(cinema_uid), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch halls");
      const data: Hall[] = await res.json();
      setHalls(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch halls whenever the cinema UID changes (initial load)
  useEffect(() => {
    if (cinema_uid) fetchHalls();
  }, [cinema_uid]);

  // Navigate to edit form, passing original cinema (from state) to preserve city immutability
  const handleEdit = () => {
    if (cinemaData) {
      navigate("/admin/add-cinema", { state: { cinema } });
    }
  };

  // Return to cinemas list
  const handleBack = () => {
    navigate("/admin/cinemas");
  };

  // Delete cinema, then if it was the last in its city delete the city as well
  const handleDelete = async () => {
    // Use cinemaData (fetched) instead of cinema (from state) for reliable data
    const currentCinema = cinemaData || cinema;
    if (!currentCinema || !cinema_uid) return;

    // Get city_uid - prefer from cinemaData, fallback to cinema from state
    const cityUid = cinemaData?.city_uid || cinema?.city_uid;
    if (!cityUid) {
      console.error("No city_uid found for cinema", { cinemaData, cinema });
      alert("Cannot delete cinema: missing city information");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this cinema? This cannot be undone."
    );
    if (!confirmed) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    try {
      // 1. Delete the cinema
      const deleteRes = await fetch(`${API_ENDPOINTS.cinemas}/${cinema_uid}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!deleteRes.ok) throw new Error("Failed to delete cinema");

      // 2. Wait a brief moment for backend to process the deletion
      await new Promise((resolve) => setTimeout(resolve, 100));

      // 3. Check remaining cinemas in the same city.
      //    Some backends may return 404 when no cinemas remain; treat that as empty.
      let shouldDeleteCity = false;
      try {
        console.log("Checking remaining cinemas for city:", cityUid);
        const listRes = await fetch(API_ENDPOINTS.cinemasByCity(cityUid), {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Remaining cinemas response status:", listRes.status);

        if (listRes.ok) {
          const remaining: Cinema[] = await listRes.json();
          console.log("Remaining cinemas:", remaining);
          console.log("Deleted cinema UID:", cinema_uid);
          // Filter out the just-deleted cinema in case it's still in the response
          const activeCinemas = remaining.filter((c) => c.uid !== cinema_uid);
          console.log("Active cinemas after filter:", activeCinemas);
          if (activeCinemas.length === 0) {
            shouldDeleteCity = true;
            console.log("No active cinemas found, will delete city");
          }
        } else if (listRes.status === 404) {
          // Assume no cinemas found -> safe to delete city
          shouldDeleteCity = true;
          console.log("404 response, will delete city");
        }
      } catch (e) {
        console.warn(
          "Failed to verify remaining cinemas; skipping city deletion check.",
          e
        );
      }

      console.log("Should delete city?", shouldDeleteCity);

      // 4. Delete city if it's now empty
      if (shouldDeleteCity) {
        console.log("Attempting to delete city:", cityUid);
        const cityDeleteRes = await fetch(
          `${API_ENDPOINTS.cities}/${cityUid}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("City deletion response status:", cityDeleteRes.status);
        if (!cityDeleteRes.ok) {
          const errorText = await cityDeleteRes.text();
          console.warn("City deletion failed:", errorText);
        } else {
          console.log(
            "City deleted successfully as it had no remaining cinemas."
          );
        }
      }

      alert("Cinema deleted successfully!");
      navigate("/admin/cinemas");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to delete cinema");
    }
  };

  // Conditional early returns for UX states
  if (loading) return <p>Loading cinema details...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!cinema) return <p>Cinema not found.</p>;

  return (
    <div className="container py-4">
      <div className="card shadow-sm">
        <div className="card-header">
          <h2 className="mb-0">Cinema Details</h2> {/* Static heading */}
        </div>

        <div className="card-body">
          <div className="row mb-2">
            <div className="col-sm-3 text-muted fw-semibold">
              {t("cinemas.name")}:
            </div>
            <div className="col-sm-9">{cinema.name}</div>
          </div>
          <div className="row mb-2">
            <div className="col-sm-3 text-muted fw-semibold">
              {t("cinemas.address")}:
            </div>
            <div className="col-sm-9">
              {cinema.address || "Add the address"}
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-sm-3 text-muted fw-semibold">
              {t("cinemas.phone")}:
            </div>
            <div className="col-sm-9">
              {cinema.phone || "Add the phone number"}
            </div>
          </div>
        </div>
        <div className="m-4">
          <h5 className="mb-3">{t("cinemas.halls")}</h5>
          {halls.length > 0 ? (
            <ul className="list-group mb-0">
              {halls.map((aud: Hall) => (
                <li
                  key={aud.uid}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span>{aud.name}</span>
                  <span className="badge text-bg-secondary">
                    {aud.rows * aud.cols} seats
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="alert alert-info mt-2 mb-0">
              {t("cinemas.noHallsAdded")}
            </div>
          )}
        </div>

        <div className="card-footer d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={handleBack}
          >
            {t("util.back")}
          </button>
          {/* Back to list */}
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleEdit}
          >
            {t("cinemas.editCinema")}
          </button>
          {/* Navigate to edit form */}
          <button
            type="button"
            className="btn btn-danger ms-auto"
            onClick={handleDelete}
          >
            {t("cinemas.deleteCinema")}
          </button>
          {/* Delete cinema (and city if last) */}
        </div>
      </div>
    </div>
  );
};

export default CinemaDetails;
