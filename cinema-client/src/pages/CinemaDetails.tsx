import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../util/baseURL";

function CinemaDetails() {
  const { cinemaUid } = useParams();
  const [cinema, setCinema] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${API_ENDPOINTS.cinemas}/${cinemaUid}`);
      const data = await res.json();
      setCinema(data);
    };
    load();
  }, [cinemaUid]);

  if (!cinema) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h2>{cinema.name}</h2>
      <p>Address: {cinema.address}</p>
      <p>Phone: {cinema.phone}</p>
    </div>
  );
}

export default CinemaDetails;
