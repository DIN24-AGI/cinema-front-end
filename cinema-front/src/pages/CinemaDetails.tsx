import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import type { Cinema } from "../types/cinemaTypes";
import { API_ENDPOINTS } from "../util/baseURL";



const CinemaDetails: React.FC = () => {
  const location = useLocation();
  const cinema = location.state?.cinema;
  console.log(cinema)

  const navigate = useNavigate();
  const { id: cinema_uid } = useParams<{ id: string }>();
  const [ cinemaData, setCinemaData] = useState<Cinema | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCinema = async () => {
      if (!cinema_uid) return;
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_ENDPOINTS.cinemas}/${cinema_uid}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch cinema");

        const data: Cinema = await res.json();
        console.log(data)
        setCinemaData(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchCinema();
  }, [cinema_uid]);

  const handleEdit = () => {
    if (cinemaData) {
      navigate("/admin/add-cinema", { state: { cinema } });
    }
  };

  const handleBack = () => {
    navigate("/admin/cinemas");
  };

  if (loading) return <p>Loading cinema details...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!cinema) return <p>Cinema not found.</p>;

  return (
    <div>
      <h2>Cinema Details</h2>
      <p><strong>Name:</strong> {cinema.name}</p>
      <p><strong>Address:</strong> {cinema.address || "Add the address"}</p>
      <p><strong>Phone:</strong> {cinema.phone || "Add the phone number"}</p>

      <h3>Halls</h3>
      {cinema.halls && cinema.halls.length > 0 ? (
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