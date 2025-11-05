// src/pages/ManageTheaters/ManageTheaters.tsx
import React, { useState, useEffect } from "react";
import TheaterCard from "../components/TheaterCard/TheaterCard";
import { API_ENDPOINTS } from "../util/baseURL";
import { useNavigate } from "react-router";
import Navbar from "../components/NavBar/NavBar";

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
  active: boolean;
  auditoriums: Auditorium[];
}

const ManageTheaters: React.FC = () => {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Just for now
    const fetchTheaters = async () => {
      // TODO: replace with backend fetch
      const data: Theater[] = [
        {
          id: "1",
          name: "Cinema Nova Oulu",
          address: "Kauppurienkatu 45, 90100 Oulu, Finland",
          phone: "+358 8 5542 3890",
          active: true,
          auditoriums: [
            { id: "1", name: "Auditorium 1", seats: 145, active: true },
            { id: "2", name: "Auditorium 2", seats: 87, active: true },
            { id: "3", name: "Auditorium 3", seats: 163, active: true },
          ],
        },
        {
          id: "2",
          name: "Kino Baltic Turku",
          address: "Linnankatu 28, 20100 Turku, Finland",
          phone: "+358 2 2641 7520",
          active: true,
          auditoriums: [
            { id: "1", name: "Auditorium 1", seats: 192, active: true },
            { id: "2", name: "Auditorium 2", seats: 76, active: true },
            { id: "3", name: "Auditorium 3", seats: 134, active: true },
            { id: "4", name: "Auditorium 4", seats: 58, active: true },
          ],
        },
      ];
      setTheaters(data);
    };

    fetchTheaters();
  }, []);

  const handleToggleActive = (id: string) => {
    setTheaters((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, active: !t.active } : t
      )
    );
    // TODO: call backend /theaters/:id/activate
  };

  const handleAddTheater = () => {
    // TODO: navigate to AddTheater form page
    navigate("/admin/add-theater");
  };

  const handleManageAuditoriums = (id: string) => {
    navigate(`/admin/theaters/${id}/auditoriums`);
  };

  return (
    <div>
      <Navbar />
      <h2>Manage Theaters</h2>
      <button onClick={handleAddTheater}>
        + Add New Theater
      </button>
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
          onManageAuditoriums={handleManageAuditoriums}
        />
      ))}
    </div>
  );
};

export default ManageTheaters;
