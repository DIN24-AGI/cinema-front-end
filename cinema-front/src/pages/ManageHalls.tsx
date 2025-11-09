// src/pages/ManageHalls/ManageHalls.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { City, Cinema, Hall } from "../types/cinemaTypes";
import { API_ENDPOINTS } from "../util/baseURL";

const ManageHalls: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = () => localStorage.getItem("token");

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_ENDPOINTS.cities, {
          headers: { Authorization: `Bearer ${token()}` },
        });
        if (!res.ok) throw new Error("Failed to load cities");
        const data: City[] = await res.json();
        setCities(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Error");
      } finally {
        setLoading(false);
      }
    };
    fetchCities();
  }, []);

  const onSelectCity = async (city: City) => {
    setSelectedCity(city);
    setSelectedCinema(null);
    setHalls([]);
    try {
      setLoading(true);
      const res = await fetch(API_ENDPOINTS.cinemasByCity(city.uid), {
        headers: { Authorization: `Bearer ${token()}` },
      });
      if (!res.ok) throw new Error("Failed to load cinemas");
      const data: Cinema[] = await res.json();
      setCinemas(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const onSelectCinema = async (cinema: Cinema) => {
    setSelectedCinema(cinema);
    try {
      setLoading(true);
      const res = await fetch(API_ENDPOINTS.hallsByCinema(cinema.uid), {
        headers: { Authorization: `Bearer ${token()}` },
      });
      if (!res.ok) throw new Error("Failed to load halls");
      const data: Hall[] = await res.json();
      setHalls(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Manage Halls</h2>
      {loading && <p>Loading…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <section>
        <h3>Choose city</h3>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {cities.map((c) => (
            <div
              key={c.uid}
              onClick={() => onSelectCity(c)}
              style={{
                padding: 12,
                border: selectedCity?.uid === c.uid ? "2px solid #007bff" : "1px solid #ddd",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              {c.name}
            </div>
          ))}
        </div>
      </section>

      {selectedCity && (
        <section style={{ marginTop: 20 }}>
          <h3>Choose cinema in {selectedCity.name}</h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {cinemas.map((cn) => (
              <div
                key={cn.uid}
                onClick={() => onSelectCinema(cn)}
                style={{
                  padding: 12,
                  border: selectedCinema?.uid === cn.uid ? "2px solid #007bff" : "1px solid #ddd",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                <strong>{cn.name}</strong>
                <div style={{ fontSize: 12 }}>{cn.address}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {selectedCinema && (
        <section style={{ marginTop: 20 }}>
          <h3>Halls for {selectedCinema.name}</h3>
          <button onClick={() => navigate("/admin/halls/add", { state: { cinemaUid: selectedCinema.uid } })}>
            + Add Hall
          </button>

          <div style={{ marginTop: 12 }}>
            {halls.length === 0 ? (
              <p>No halls yet</p>
            ) : (
              halls.map((h) => (
                <div key={h.uid} style={{ padding: 10, border: "1px solid #eee", marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <strong>{h.name}</strong> — {h.seats} seats
                      <div style={{ fontSize: 12, color: "#666" }}>{h.active ? "Active" : "Inactive"}</div>
                    </div>
                    <div>
                      <button onClick={() => navigate(`/admin/halls/${h.uid}`)}>View</button>
                      <button style={{ marginLeft: 8 }} onClick={async () => {
                        // optimistic remove example (call DELETE endpoint then refresh)
                        if (!confirm("Delete this hall?")) return;
                        try {
                          const res = await fetch(API_ENDPOINTS.hallDetails(h.uid), {
                            method: "DELETE",
                            headers: { Authorization: `Bearer ${token()}`, "Content-Type": "application/json" },
                          });
                          if (!res.ok) throw new Error("Failed to delete hall");
                          setHalls(prev => prev.filter(x => x.uid !== h.uid));
                        } catch (err) {
                          console.error(err);
                          alert("Delete failed");
                        }
                      }}>Delete</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default ManageHalls;
