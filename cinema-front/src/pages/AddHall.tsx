// src/pages/ManageHalls/AddHall.tsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import type { Hall } from "../types/cinemaTypes";
import { API_ENDPOINTS } from "../util/baseURL";

const AddHall: React.FC = () => {
  const nav = useNavigate();
  const loc = useLocation();
  const cinemaUid = (loc.state as any)?.cinemaUid as string | undefined;

  const [name, setName] = useState("");
  const [seats, setSeats] = useState<number>(50);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cinemaUid) {
      setError("No cinema selected");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.addHall, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ cinema_uid: cinemaUid, name, seats }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.msg || "Failed to create hall");
      }
      const created: Hall = await res.json();
      console.log(created)
      nav("/admin/halls"); // or navigate back to manage halls and refresh
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Add Hall</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Seats</label>
          <input type="number" value={seats} onChange={(e) => setSeats(Number(e.target.value))} min={1} required />
        </div>

        <button type="submit" disabled={loading}>{loading ? "Saving..." : "Create Hall"}</button>
        <button type="button" onClick={() => nav(-1)} style={{ marginLeft: 8 }}>Cancel</button>
      </form>
    </div>
  );
};

export default AddHall;
