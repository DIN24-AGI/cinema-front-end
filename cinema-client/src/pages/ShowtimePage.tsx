import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../util/baseURL";
import { useTranslation } from "react-i18next";

function ShowtimePage() {
	const { t } = useTranslation();
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

	if (!showtime) return <p>{t("util.loading")}</p>;

	return (
		<div className="container mt-4" style={{ maxWidth: "400px", textAlign: "left" }}>
			<h2 style={{ color: "#5ca5ac" }}>{showtime.title}</h2>
			<h4 style={{ color: "#e5e7eb" }}>
				{t("schedule.hall")} {showtime.hall_name}
			</h4>

			<p>
				{t("schedule.starts")} {new Date(showtime.starts_at.replace(" ", "T")).toLocaleString()} <br />
				{t("schedule.ends")} {new Date(showtime.ends_at.replace(" ", "T")).toLocaleString()}
			</p>
			<p>
				{t("schedule.adultPrice")} {(showtime.adult_price / 100).toFixed(2)} <br />
				{t("schedule.childPrice")} {(showtime.child_price / 100).toFixed(2)}
			</p>

			<button className="btn btn-primary" onClick={() => navigate(`/showtime/${showtime_uid}/seats`)}>
				{t("seats.select")}
			</button>
		</div>
	);
}

export default ShowtimePage;
