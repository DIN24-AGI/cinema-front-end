// src/pages/ManageHalls/HallDetails.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { Hall } from "../types/cinemaTypes";
import { API_ENDPOINTS } from "../util/baseURL";

const HallDetails: React.FC = () => {
  const { hallUid } = useParams<{ hallUid: string }>();
  const nav = useNavigate();
  const [hall, setHall] = useState<Hall | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [seats, setSeats] = useState<number>(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!hallUid) return;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(API_ENDPOINTS.hallDetails(hallUid), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load hall");
        const data = await res.json();
        setHall(data);
        setName(data.name);
        setSeats(data.seats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [hallUid]);

  const handleSave = async () => {
    if (!hallUid) return;
    try {
      const res = await fetch(API_ENDPOINTS.hallDetails(hallUid), {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, seats }),
      });
      if (!res.ok) throw new Error("Save failed");
      const updated = await res.json();
      setHall(updated);
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!hall) return <p>Hall not found</p>;

  return (
    <div>
      <h2>Hall Details</h2>
      {!editing ? (
        <>
          <p><strong>Name:</strong> {hall.name}</p>
          <p><strong>Seats:</strong> {hall.seats}</p>
          <p><strong>Status:</strong> {hall.active ? "Active" : "Inactive"}</p>

          <button onClick={() => setEditing(true)}>Edit</button>
          <button onClick={() => nav(-1)} style={{ marginLeft: 8 }}>Back</button>
        </>
      ) : (
        <>
          <div>
            <label>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label>Seats</label>
            <input type="number" value={seats} onChange={(e) => setSeats(Number(e.target.value))} />
          </div>
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setEditing(false)} style={{ marginLeft: 8 }}>Cancel</button>
        </>
      )}
    </div>
  );
};

export default HallDetails;
