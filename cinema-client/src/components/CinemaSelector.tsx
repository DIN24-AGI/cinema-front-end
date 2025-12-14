import type { CinemaSelectorProps } from "../types/cinemaTypes";

const CinemaSelector: React.FC<CinemaSelectorProps> = ({ cinemas, cities, selectedCinema, onSelectCinema }) => {
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
					const cityName = cities.find((c) => c.uid === cn.city_uid)?.name || "";
					const isSelected = selectedCinema?.uid === cn.uid;

					return (
						<div
							key={cn.uid}
							onClick={() => onSelectCinema(cn)}
							style={{
								padding: 12,
								width: 180,
								borderRadius: 8,
								border: isSelected ? "2px solid #5ca5ac" : "1px solid #0c3c56",
								background: "#0c3c56",
								cursor: "pointer",
								boxShadow: "0 4px 8px rgba(92, 165, 172, 0.3)",
								transition: "border-color .15s, box-shadow .15s",
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.borderColor = "#5ca5ac";
								e.currentTarget.style.boxShadow = "0 4px 12px rgba(92, 165, 172, 0.5)";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.borderColor = isSelected ? "#5ca5ac" : "#0c3c56";
								e.currentTarget.style.boxShadow = "0 4px 8px rgba(92, 165, 172, 0.3)";
							}}
						>
							<div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 4 }}>{cityName}</div>
							<strong style={{ fontSize: 14, color: "#e5e7eb" }}>{cn.name}</strong>
						</div>
					);
				})}
			</div>
		</section>
	);
};

export default CinemaSelector;
