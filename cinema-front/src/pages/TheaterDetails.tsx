// src/pages/ViewDetails.tsx
import React from "react";
import { useNavigate, useLocation } from "react-router";

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

const TheaterDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theater: Theater = location.state?.theater;

  if (!theater) {
    return <p>Theater data not found.</p>;
  }

  const handleEdit = () => {
    navigate("/admin/add-theater", { state: { theater } });
  };

  const handleBack = () => {
    navigate("/admin/theaters");
  };

  return (
    <div>
      <h2>Theater Details</h2>
      <p><strong>Name:</strong> {theater.name}</p>
      <p><strong>Address:</strong> {theater.address}</p>
      <p><strong>Phone:</strong> {theater.phone}</p>

      <h3>Auditoriums</h3>
      {theater.auditoriums.length > 0 ? (
        <ul>
          {theater.auditoriums.map((aud) => (
            <li key={aud.id}>
              {aud.name} - {aud.seats} seats
            </li>
          ))}
        </ul>
      ) : (
        <p>No auditoriums added.</p>
      )}

      <button onClick={handleBack}>Back</button>
      <button onClick={handleEdit} style={{ marginLeft: "10px" }}>
        Edit
      </button>
    </div>
  );
};

export default TheaterDetails;
