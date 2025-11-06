// src/pages/ManageCinemas/ManageCinemas.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import CinemaCard from "../components/CinemaCard/CinemaCard";
import theatersData from "../data/dummy_theaters.json"; 
import type { Cinema } from "../types/cinemaTypes"


const ManageCinemas: React.FC = () => {
  const [cinema, setCinema] = useState<Cinema[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setCinema(theatersData as Cinema[]);
  }, []);

  const handleToggleActive = (id: string) => {
    setCinema((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, active: !t.active } : t
      )
    );
    // later call to backend /cinema/:id/activate
  };

  const handleAddCinema = () => {
    navigate("/admin/add-cinema");
  };

  const handleViewDetails = (id: string) => {
    navigate(`/admin/cinemas/${id}`);
  };



  return (
    <div>
      <h2>Manage Cinemas</h2>
      <button onClick={handleAddCinema}>+ Add New Cinema</button>
      <div style={{ marginTop: "20px" }}>
        {cinema.map((theater) => (
          <CinemaCard
            key={theater.id}
            id={theater.id}
            name={theater.name}
            address={theater.address}
            phone={theater.phone}
            hallsCount={theater.halls?.length || 0}
            active={theater.active}
            onToggleActive={handleToggleActive}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>
    </div>
  );
};

export default ManageCinemas;
