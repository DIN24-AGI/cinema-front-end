// src/pages/ManageCinemas/ManageCinemas.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import CinemaCard from "../components/CinemaCard/CinemaCard";
import { API_ENDPOINTS } from "../util/baseURL";
import type { Cinema } from "../types/cinemaTypes";

const ManageCinemas: React.FC = () => {
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchCinemas = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const res = await fetch(API_ENDPOINTS.cinemas, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch cinemas");

      const data: Cinema[] = await res.json();
      setCinemas(data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchCinemas();
}, []); 

  const handleToggleActive = async (cinemaId: string, currentState: boolean) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error ("No token found. Please log in.")
      const res = await fetch(`${API_ENDPOINTS.cinemas}/${cinemaId}/activate`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
         },
        body: JSON.stringify({ active: !currentState }),
      });

      if (!res.ok) throw new Error("Failed to toggle cinema active state");
      const updatedCinema = await res.json();

      setCinemas((prev) =>
        prev.map((c) => (c.uid === cinemaId ? updatedCinema : c))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCinema = () => {
    navigate("/admin/add-cinema");
  };

  const handleViewDetails = (cinema: Cinema) => {
    navigate(`/admin/cinemas/${cinema.uid}`, {state: { cinema }});
  };

  return (
    <div>
      <h2>Manage Cinemas</h2>
      <button onClick={handleAddCinema}>+ Add New Cinema</button>
      <div style={{ marginTop: "20px" }}>
        {cinemas.map((cinema) => (
          <CinemaCard
            key={cinema.uid}
            id={cinema.uid}
            name={cinema.name}
            address={cinema.address}
            phone={cinema.phone}
            hallsCount={cinema.halls?.length || 0}
            active={cinema.active}
            onToggleActive={() => handleToggleActive(cinema.uid, cinema.active)}
            onViewDetails={() => handleViewDetails(cinema)}
          />
        ))}
      </div>
    </div>
  );
};

export default ManageCinemas;
