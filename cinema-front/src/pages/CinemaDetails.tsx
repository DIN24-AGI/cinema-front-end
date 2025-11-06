// src/pages/ViewDetails.tsx
import React from "react";
import { useNavigate, useParams } from "react-router";
import type { Cinema } from "../types/cinemaTypes";
import theatersData from "../data/dummy_theaters.json";

const CinemaDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 

  // Find cinema from mock data
  const cinema: Cinema | undefined = theatersData.find((c) => c.id === id);

  if (!cinema) {
    return <p>Cinema not found.</p>;
  }

  const handleEdit = () => {
    navigate(`/admin/add-cinema`, { state: { cinema } });
  };

  const handleBack = () => {
    navigate("/admin/cinemas");
  };

  return (
    <div>
      <h2>Cinema Details</h2>
      <p><strong>Name:</strong> {cinema.name}</p>
      <p><strong>Address:</strong> {cinema.address}</p>
      <p><strong>Phone:</strong> {cinema.phone}</p>

      <h3>Auditoriums</h3>
      {cinema.halls.length > 0 ? (
        <ul>
          {cinema.halls.map((aud) => (
            <li key={aud.id}>
              {aud.name} - {aud.seats} seats
            </li>
          ))}
        </ul>
      ) : (
        <p>No halls added.</p>
      )}

      <button onClick={handleBack}>Back</button>
      <button onClick={handleEdit} style={{ marginLeft: "10px" }}>
        Edit
      </button>
    </div>
  );
};

export default CinemaDetails;
