// src/pages/ManageTheaters/ManageTheaters.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import TheaterCard from "../components/CinemaCard/CinemaCard";
import theatersData from "../data/dummy_theaters.json"; 

interface Auditorium {
  id: string;
  name: string;
  seats: number;
  active: boolean;
}

interface Theater {
  id: string;
  name: string;
  address: string;
  phone: string;
  auditoriums: Auditorium[];
  active: boolean;

}

const ManageTheaters: React.FC = () => {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setTheaters(theatersData as Theater[]);
  }, []);

  const handleToggleActive = (id: string) => {
    setTheaters((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, active: !t.active } : t
      )
    );
    // later call backend /theaters/:id/activate
  };

  const handleAddTheater = () => {
    navigate("/admin/add-theater");
  };

  const handleViewDetails = (id: string) => {
    navigate(`/admin/theaters/${id}`);
  };



  return (
    <div>
      <h2>Manage Theaters</h2>
      <button onClick={handleAddTheater}>+ Add New Theater</button>
      <div style={{ marginTop: "20px" }}>
        {theaters.map((theater) => (
          <TheaterCard
            key={theater.id}
            id={theater.id}
            name={theater.name}
            address={theater.address}
            phone={theater.phone}
            auditoriumsCount={theater.auditoriums.length}
            active={theater.active}
            onToggleActive={handleToggleActive}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>
    </div>
  );
};

export default ManageTheaters;
