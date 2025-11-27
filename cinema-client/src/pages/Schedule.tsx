import { useEffect, useState } from "react";
import CinemaSelector from "../components/CinemaSelector"
import type { City, Cinema } from "../types/cinemaTypes";
import { API_ENDPOINTS } from "../util/baseURL";
import { useTranslation } from "react-i18next";


type Showtime = {
  showtimeUid: string;
  startsAt: string;
  endsAt: string;
  hall: {
    uid: string;
    name: string;
  };
  movie: {
    uid: string;
    title: string;
    duration_minutes: number;
  };
};

//delete later
const SAMPLE_SHOWTIMES: Showtime[] = [
  {
    showtimeUid: "sh1",
    startsAt: "2025-01-10T10:00:00",
    endsAt:   "2025-01-10T12:10:00",
    hall: { uid: "h1", name: "Hall A" },
    movie: { uid: "m1", title: "The Matrix", duration_minutes: 128 }
  },
  {
    showtimeUid: "sh2",
    startsAt: "2025-01-10T13:00:00",
    endsAt:   "2025-01-10T15:30:00",
    hall: { uid: "h2", name: "Hall B" },
    movie: { uid: "m2", title: "Inception", duration_minutes: 128 }
  },
  {
    showtimeUid: "sh3",
    startsAt: "2025-01-10T16:45:00",
    endsAt:   "2025-01-10T18:50:00",
    hall: { uid: "h1", name: "Hall A" },
    movie: { uid: "m3", title: "Interstellar", duration_minutes: 128 }
  },
];

function Schedule() {
  const { t } = useTranslation();
 	const [cities, setCities] = useState<City[]>([]);
	const [cinemas, setCinemas] = useState<Cinema[]>([]);
	const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null);  const [date, setDate] = useState<string>(() => new Date().toISOString().split("T")[0]);
  // const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  // Load cinemas at start
useEffect(() => {
    const fetchEverything = async () => {
      try {
        setLoading(true);
        const [citiesRes, cinemasRes] = await Promise.all([
          fetch(API_ENDPOINTS.cities,),
          fetch(API_ENDPOINTS.cinemas,),
        ]);

        if (!citiesRes.ok) throw new Error("Failed to load cities");
        if (!cinemasRes.ok) throw new Error(t("cinemas.errorLoadCities"));

        const cityData: City[] = await citiesRes.json();
        const cinemaData: Cinema[] = await cinemasRes.json();
        setCities(cityData);
        const activeCinemas = cinemaData.filter(cn => cn.active);
        setCinemas(activeCinemas);
        } catch (err: any) {
        console.error(err);
        console.log(error)
        setError(err.message || t("cinemas.genericError"));
      } finally {
        setLoading(false);
      }
    };

    fetchEverything();
  }, [t]);

  // Load showtimes when cinema or date change
  // useEffect(() => {
  //   if (!selectedCinema) return;

  //   setLoading(true);

  //   fetch(`/api/schedule?cinemaUid=${selectedCinema}&date=${date}`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       const sorted = data.sort(
  //         (a: Showtime, b: Showtime) =>
  //           new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
  //       );
  //       setShowtimes(sorted);
  //     })
  //     .catch((err) => console.error("Failed to load schedule:", err))
  //     .finally(() => setLoading(false));
  // }, [selectedCinema, date]);

  
const onSelectCinema = async (cinema: Cinema) => {
  setSelectedCinema(cinema);
};

  const sortedShowtimes = [...SAMPLE_SHOWTIMES].sort(
    (a, b) =>
      new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
  );

  return (
    <div className="container mt-4">
          <h2 className="mb-4">Schedule</h2>

          {/* --- Cinema Selector --- */}
          <div className="cinema">
            <h5>Select Cinema</h5>
            <CinemaSelector
              cinemas={cinemas}
              cities={cities}
              selectedCinema={selectedCinema}
              onSelectCinema={onSelectCinema}
            />
          </div>

          {/* --- Date Picker --- */}
          <div className="mb-4">
            <label className="form-label">Select Date</label>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={!selectedCinema}
            />
          </div>

      {/* Loading indicator */}
      {loading && (
        <div className="text-center my-4">
          <div className="spinner-border" role="status" />
        </div>
      )}
{/* Showtimes for the dynamic data */}
      {/* Showtimes
      {!loading && showtimes.length > 0 && (
        <div className="row">
          {showtimes.map((show) => (
            <div key={show.showtimeUid} className="col-md-6 col-lg-4 mb-3">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">{show.movie.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{show.hall.name}</h6>

                  <p className="mt-3 mb-0">
                    <strong>Starts:</strong>{" "}
                    {new Date(show.startsAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    <br />
                    <strong>Ends:</strong>{" "}
                    {new Date(show.endsAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                  {/* Optional: book ticket button */}
                  {/* <button className="btn btn-primary btn-sm mt-3 w-100">
                    Book Ticket
                  </button>
                </div>
              </div>
            </div>
          ))} */}


        {/* </div>
      )}

      {/* No showtimes */}
      {/* {!loading && selectedCinema && showtimes.length === 0 && (
        <p className="mt-3">No showtimes available for this date.</p>
      )} */} 

      {/* Showtimes */}
      {!selectedCinema ? (
        <p className="text-muted">Please select a cinema to view the schedule.</p>
      ) : (
        <div className="row">
          {sortedShowtimes.map((show) => (
            <div key={show.showtimeUid} className="col-md-6 col-lg-4 mb-3">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">{show.movie.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    {show.hall.name}
                  </h6>

                  <p className="mt-3 mb-0">
                    <strong>Starts:</strong>{" "}
                    {new Date(show.startsAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    <br />
                    <strong>Ends:</strong>{" "}
                    {new Date(show.endsAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                  <button className="btn btn-primary btn-sm mt-3 w-100">
                    Book Ticket
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
 

export default Schedule