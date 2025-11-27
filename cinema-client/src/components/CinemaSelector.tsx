import type { Cinema, City } from "../types/cinemaTypes";

interface CinemaSelectorProps {
  cinemas: Cinema[];
  cities: City[];
  selectedCinema: Cinema | null;
  onSelectCinema: (cinema: Cinema) => void;
}

const CinemaSelector: React.FC<CinemaSelectorProps> = ({
  cinemas,
  cities,
  selectedCinema,
  onSelectCinema
}) => {



  return (
    <section>
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          minHeight: 90,
          alignItems: cinemas.length === 0 ? "center" : "flex-start",
        }}
      >
        {cinemas.map((cn) => {
          const cityName =
            cities.find((c) => c.uid === cn.city_uid)?.name || "";
          const isSelected = selectedCinema?.uid === cn.uid;

          return (
            <div
              key={cn.uid}
              onClick={() => onSelectCinema(cn)}
              style={{
                padding: 12,
                width: 180,
                borderRadius: 8,
                border: isSelected ? "2px solid #0d6efd" : "1px solid #ddd",
                background: "#fff",
                cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                transition: "border-color .15s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget.style.borderColor = "#0d6efd"))
              }
              onMouseLeave={(e) =>
                ((e.currentTarget.style.borderColor = isSelected ? "#0d6efd" : "#ddd"))
              }
            >
              <div style={{ fontSize: 12, color: "#999", marginBottom: 4 }}>
                {cityName}
              </div>
              <strong style={{ fontSize: 14 }}>{cn.name}</strong>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CinemaSelector;
