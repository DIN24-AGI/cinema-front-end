import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import type { Cinema } from "../types/cinemaTypes";
import { API_ENDPOINTS } from "../util/baseURL";

const AddCinema: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const existingCinema = location.state?.cinema as Cinema | undefined;

  const [name, setName] = useState(existingCinema?.name || "");
  const [address, setAddress] = useState(existingCinema?.address || "");
  const [phone, setPhone] = useState(existingCinema?.phone || "");
  const [cityUid, setCityUid] = useState(existingCinema?.cityUid || "")
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      const body = { city_uid: cityUid, name, address, phone };

      const res = await fetch(existingCinema ? `${API_ENDPOINTS.cinemas}/${existingCinema.uid}` : API_ENDPOINTS.cinemas, {
        method: existingCinema ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.msg || "Failed to save cinema");
      }

      const savedCinema = await res.json();
      console.log("Saved cinema:", savedCinema);

      navigate("/admin/cinemas");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>{existingCinema ? "Edit Cinema" : "Add New Cinema"}</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <select value={cityUid} onChange={e => setCityUid(e.target.value)} required>
            <option value="">Select a city</option>
            <option value="6a86f3e6-117c-47f2-9004-18938dae1214">Helsinki</option>
          </select>
        </div>
        <div>
          <label>Name:</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div>
          <label>Address:</label>
          <input value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>

        <div>
          <label>Phone:</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : existingCinema ? "Update Cinema" : "Add Cinema"}
        </button>
        <button type="button" onClick={() => navigate("/admin/cinemas")} style={{ marginLeft: "10px" }}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddCinema;
