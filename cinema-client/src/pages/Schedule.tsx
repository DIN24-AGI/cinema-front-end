import { useEffect, useState } from "react";
import CinemaSelector from "../components/CinemaSelector";
import type { City, Cinema } from "../types/cinemaTypes";
import { API_ENDPOINTS } from "../util/baseURL";
import { useTranslation } from "react-i18next";
import type { Showtime } from "../types/showtime";

import { useNavigate } from "react-router";

function Schedule() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [cities, setCities] = useState<City[]>([]);
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null);

  const [date, setDate] = useState<string>(() => new Date().toISOString().split("T")[0]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  // Load cities and cinemas
  useEffect(() => {
    const fetchEverything = async () => {
      try {
        setLoading(true);

        const [citiesRes, cinemasRes] = await Promise.all([
          fetch(API_ENDPOINTS.cities),
          fetch(API_ENDPOINTS.cinemas),
        ]);

        if (!citiesRes.ok) throw new Error(t("contact.errorLoadCities"));

        const cityData: City[] = await citiesRes.json();
        const cinemaData: Cinema[] = await cinemasRes.json();

        setCities(cityData);

        const activeCinemas = cinemaData.filter(c => c.active);
        setCinemas(activeCinemas);

        if (!selectedCinema && activeCinemas.length > 0) {
          setSelectedCinema(activeCinemas[0]);
        }

      } catch (err: any) {
        console.error(err);
        setError(err.message || t("util.genericError"));
      } finally {
        setLoading(false);
      }
    };

    fetchEverything();
  }, [t, selectedCinema]);


  // Load showtimes when cinema/date changes
  useEffect(() => {
    const loadShowtimes = async () => {
      if (!selectedCinema) return;

      try {
        setLoading(true);

        const url = `${API_ENDPOINTS.showtimesInCinema}?cinema_uid=${selectedCinema.uid}&date=${date}`;
        const res = await fetch(url);

        if (!res.ok) throw new Error(t("movieDetails.errorShowtimes"));

        const data: Showtime[] = await res.json();
        setShowtimes(data);

      } catch (err) {
        console.error(`t("movieDetails.errorShowtimes) :`, err);
        setShowtimes([]);
      } finally {
        setLoading(false);
      }
    };

    loadShowtimes();
  }, [selectedCinema, date, t]);


  return (
    <div className="container mt-4">
      {error && <div className="alert alert-danger">{error}</div>}
      <h2 className="mb-4">{t("schedule.pageTitle")}</h2>

      {/* Cinema Selector */}
      <div className="cinema">
        <h5>{t("schedule.cinemaSelect")}</h5>
        <CinemaSelector
          cinemas={cinemas}
          cities={cities}
          selectedCinema={selectedCinema!}
          onSelectCinema={setSelectedCinema}
        />
      </div>

      {/* Date Picker */}
      <div className="mb-4">
        <label className="form-label">{t("schedule.dateSelect")}</label>
        <input
          type="date"
          className="form-control"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          disabled={!selectedCinema}
        />
      </div>

      {loading && <p>{t("util.loading")}</p>}

      {!selectedCinema && (
        <p className="text-muted">{t("schedule.require")}</p>
      )}

      {/* SHOWTIMES */}
      {selectedCinema && !loading && (
        <div className="row">
          {showtimes.map((show) => (
            <div key={show.uid} className="col-md-6 col-lg-4 mb-3">
              <div className="card shadow-sm h-100">
                <div className="card-body">

                  <h5 className="card-title">{show.movie_title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{show.hall_name}</h6>

                  <p className="mt-3 mb-0">
                    <strong>{t("schedule.starts")}</strong>{" "}
                    {new Date(show.starts_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}<br />
                    <strong>{t("schedule.ends")}</strong>{" "}
                    {new Date(show.ends_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>

                  <button
                    className="btn btn-primary btn-sm mt-3 w-100"
                    onClick={() => navigate(`/showtime/${show.uid}`)}
                  >
                    {t("schedule.book")}
                  </button>

                </div>
              </div>
            </div>
          ))}

          {showtimes.length === 0 && (
            <p>{t("schedule.noShowings")}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Schedule;
