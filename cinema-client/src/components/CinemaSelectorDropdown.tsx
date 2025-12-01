import { useEffect } from "react";
import type { Cinema, City } from "../types/cinemaTypes";

interface CinemaSelectorProps {
  cinemas: Cinema[];
  cities: City[];
  selectedCinema: Cinema;
  onSelectCinema: (cinema: Cinema) => void;
}

const CinemaSelectorDropdown: React.FC<CinemaSelectorProps> = ({
  cinemas,
  cities,
  selectedCinema,
  onSelectCinema
}) => {
  useEffect(() => {
    if (cinemas.length > 0 && !selectedCinema) {
      onSelectCinema(cinemas[0]);
    }
  }, [cinemas, selectedCinema, onSelectCinema]);
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cinema = cinemas.find((c) => c.uid === e.target.value);
    if (cinema) onSelectCinema(cinema);
  };

  return (
    <section className="mb-4">
      <label htmlFor="cinema-select" className="form-label">
        Choose Cinema
      </label>
      <select
        id="cinema-select"
        className="form-select"
        value={selectedCinema?.uid}
        onChange={handleChange}
      >
        <option value="" disabled>
          Select a cinema
        </option>
        {cinemas.map((c) => {
          const cityName = cities.find((ct) => ct.uid === c.city_uid)?.name;
          return (
            <option key={c.uid} value={c.uid}>
              {c.name} ({cityName})
            </option>
          );
        })}
      </select>
    </section>
  );
}

export default CinemaSelectorDropdown