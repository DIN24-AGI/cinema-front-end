import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../util/baseURL";

function ShowtimePage() {
  const { showtime_uid } = useParams();
  const [showtime, setShowtime] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!showtime_uid) return;

    const load = async () => {
      const res = await fetch(`${API_ENDPOINTS.showtimes}/${showtime_uid}`);
      const data = await res.json();
      setShowtime(data);
    };
    load();
  }, [showtime_uid]);

  if (!showtime) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h2>{showtime.movie_title}</h2>
      <h4>Hall: {showtime.hall_name}</h4>

      <p>
        Starts: {new Date(showtime.starts_at.replace(" ", "T")).toLocaleString()} <br />
        Ends: {new Date(showtime.ends_at.replace(" ", "T")).toLocaleString()}
      </p>

      <button
        className="btn btn-primary"
        onClick={() => navigate(`/showtime/${showtime_uid}/seats`)}
      >
        Select Seats
      </button>
    </div>
  );
}

export default ShowtimePage;
