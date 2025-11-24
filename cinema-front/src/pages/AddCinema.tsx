// AddCinema: Dual-purpose form for creating new cinemas and editing existing ones
// - Detects mode based on route state (add vs edit)
// - Fetches cities for dropdown selection
// - Prevents city changes when editing (city_uid is immutable after creation)
// - Sends POST for new cinemas, PUT for updates
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import type { Cinema, City } from "../types/cinemaTypes";
import { API_ENDPOINTS } from "../util/baseURL";
import { useTranslation } from "react-i18next";

const AddCinema: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  // Check if cinema object passed via route state (indicates edit mode)
  const existingCinema = location.state?.cinema as Cinema | undefined;

  // Form field state - pre-populate if editing existing cinema
  const [name, setName] = useState(existingCinema?.name || "");
  const [address, setAddress] = useState(existingCinema?.address || "");
  const [phone, setPhone] = useState(existingCinema?.phone || "");
  const [cityUid, setCityUid] = useState(existingCinema?.city_uid || "");
  // New city name (used only when adding a new city inline)
  const [newCityName, setNewCityName] = useState("");
  // List of cities for dropdown options
  const [cities, setCities] = useState<City[]>([]);
  // UI state for error/loading indicators
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch cities on mount for dropdown population; requires auth token
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(API_ENDPOINTS.cities, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to load cities");
        const data = await res.json();
        setCities(data);
      } catch (err) {
        console.error(err);
        setError("Could not load cities. Please try again.");
      }
    };

    fetchCities();
  }, []);

  // Sentinel value for adding a new city inline
  const ADD_NEW_CITY_VALUE = "__ADD_NEW_CITY__";

  // Handle form submission: POST for new cinema, PUT for editing existing
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      let finalCityUid = cityUid;

      // If user opted to add a new city, create it first
      if (!existingCinema && cityUid === ADD_NEW_CITY_VALUE) {
        if (!newCityName.trim()) {
          setError("Please enter a city name.");
          setLoading(false);
          return;
        }

        const cityRes = await fetch(API_ENDPOINTS.cities, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: newCityName.trim() }),
        });

        if (!cityRes.ok) {
          const cityErr = await cityRes.json().catch(() => ({}));
          throw new Error(cityErr.msg || "Failed to create city");
        }

        const createdCity = await cityRes.json();
        finalCityUid = createdCity.uid;
        // Add the newly created city to local list (optional for immediate UI feedback)
        setCities((prev) => [...prev, createdCity]);
      }

      // Construct request body with cinema data using finalCityUid
      const body = { city_uid: finalCityUid, name, address, phone };

      // Determine endpoint and method based on mode (add vs edit)
      const res = await fetch(
        existingCinema
          ? `${API_ENDPOINTS.cinemas}/${existingCinema.uid}`
          : API_ENDPOINTS.cinemas,
        {
          method: existingCinema ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.msg || "Failed to save cinema");
      }

      const savedCinema = await res.json();
      console.log("Saved cinema:", savedCinema);

      // Navigate back to cinema list on success
      navigate("/admin/cinemas");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      {/* Dynamic heading based on mode (Add vs Edit) */}
      <h2 className="mb-4">
        {existingCinema ? t("cinemas.editCinema") : t("cinemas.addCinema")}
      </h2>

      {/* Error message display */}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* City dropdown - disabled when editing (city_uid is immutable) */}
        <div className="mb-3">
          <label className="form-label">{t("cinemas.city")}</label>
          <select
            className="form-select"
            value={cityUid}
            disabled={!!existingCinema}
            onChange={(e) => {
              const value = e.target.value;
              setCityUid(value);
              if (value !== ADD_NEW_CITY_VALUE) {
                setNewCityName("");
              }
            }}
            required
          >
            <option value="">{t("util.selectCity")}</option>
            {cities.map((city) => (
              <option key={city.uid} value={city.uid}>
                {city.name}
              </option>
            ))}
            {!existingCinema && (
              <option value={ADD_NEW_CITY_VALUE}>Add city</option>
            )}
          </select>
          {/* Inline new city input */}
          {!existingCinema && cityUid === ADD_NEW_CITY_VALUE && (
            <div className="mt-2">
              <label className="form-label">New city name</label>
              <input
                className="form-control"
                value={newCityName}
                onChange={(e) => setNewCityName(e.target.value)}
                placeholder="Enter city name"
              />
            </div>
          )}
          {/* Show helper text explaining city cannot be changed in edit mode */}
          {existingCinema && (
            <small className="text-muted">
              {t("cinemas.cityCannotBeChanged")}
            </small>
          )}
        </div>

        {/* Cinema name input */}
        <div className="mb-3">
          <label className="form-label">{t("cinemas.name")}</label>
          <input
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Cinema address input */}
        <div className="mb-3">
          <label className="form-label">{t("cinemas.address")}</label>
          <input
            className="form-control"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        {/* Cinema phone input */}
        <div className="mb-3">
          <label className="form-label">{t("cinemas.phone")}</label>
          <input
            className="form-control"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        {/* Submit button - shows loading state and dynamic label based on mode */}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading
            ? t("util.saving")
            : existingCinema
            ? t("cinemas.updateCinema")
            : t("cinemas.addCinema")}
        </button>

        {/* Cancel button - returns to cinema list */}
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate("/admin/cinemas")}
        >
          {t("util.cancel")}
        </button>
      </form>
    </div>
  );
};

export default AddCinema;
