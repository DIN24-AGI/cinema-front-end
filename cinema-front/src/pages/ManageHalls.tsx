// src/pages/ManageHalls/ManageHalls.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { City, Cinema, Hall } from "../types/cinemaTypes";
import { API_ENDPOINTS } from "../util/baseURL";
import { useTranslation } from "react-i18next";

const ManageHalls: React.FC = () => {
	const { t } = useTranslation();
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
				if (!res.ok) throw new Error(t("halls.errorLoadCities"));
				const data: City[] = await res.json();
				setCities(data);
			} catch (err: any) {
				console.error(err);
				setError(err.message || t("halls.genericError"));
			} finally {
				setLoading(false);
			}
		};
		fetchCities();
	}, [t]);

	const onSelectCity = async (city: City) => {
		setSelectedCity(city);
		setSelectedCinema(null);
		setHalls([]);
		try {
			setLoading(true);
			const res = await fetch(API_ENDPOINTS.cinemasByCity(city.uid), {
				headers: { Authorization: `Bearer ${token()}` },
			});
			if (!res.ok) throw new Error(t("halls.errorLoadCinemas"));
			const data: Cinema[] = await res.json();
			setCinemas(data);
		} catch (err: any) {
			console.error(err);
			setError(err.message || t("halls.genericError"));
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
			if (!res.ok) throw new Error(t("halls.errorLoadHalls"));
			const data: Hall[] = await res.json();
			setHalls(data);
		} catch (err: any) {
			console.error(err);
			setError(err.message || t("halls.genericError"));
		} finally {
			setLoading(false);
		}
	};

	return (
		<div style={{ paddingBottom: 40 }}>
			<h2>{t("halls.manageTitle")}</h2>

			<section style={{ marginTop: 16 }}>
				<h3>{t("halls.chooseCity")}</h3>
				<div style={{ display: "flex", gap: 12, flexWrap: "wrap", minHeight: 70 }}>
					{cities.map((c) => (
						<button
							key={c.uid}
							onClick={() => onSelectCity(c)}
							style={{
								padding: "8px 14px",
								borderRadius: 8,
								border: selectedCity?.uid === c.uid ? "2px solid #0d6efd" : "1px solid #ccc",
								background: "#fff",
								cursor: "pointer",
								transition: "border-color .15s",
							}}
						>
							{c.name}
						</button>
					))}
					{loading && cities.length === 0 && <div style={{ opacity: 0.6 }}>{t("halls.loading")}</div>}
				</div>
			</section>

			{/* Cinema selection area kept mounted to prevent jump */}
			<section style={{ marginTop: 24 }}>
				<h3 style={{ minHeight: 24 }}>
					{selectedCity ? t("halls.chooseCinema", { city: selectedCity.name }) : "\u00A0"}
				</h3>
				<div
					style={{
						display: "flex",
						gap: 12,
						flexWrap: "wrap",
						minHeight: 90,
						alignItems: cinemas.length === 0 ? "center" : "flex-start",
					}}
				>
					{selectedCity &&
						cinemas.map((cn) => (
							<div
								key={cn.uid}
								onClick={() => onSelectCinema(cn)}
								style={{
									padding: 12,
									width: 180,
									borderRadius: 8,
									border: selectedCinema?.uid === cn.uid ? "2px solid #0d6efd" : "1px solid #ddd",
									background: "#fff",
									cursor: "pointer",
									boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
									transition: "border-color .15s",
								}}
							>
								<strong style={{ fontSize: 14 }}>{cn.name}</strong>
								<div style={{ fontSize: 11, color: "#666" }}>{cn.address}</div>
							</div>
						))}

					{selectedCity && cinemas.length === 0 && !loading && (
						<div style={{ color: "#666" }}>{t("halls.noCinemas")}</div>
					)}

					{selectedCity && loading && cinemas.length === 0 && <div style={{ opacity: 0.6 }}>{t("halls.loading")}</div>}
				</div>
			</section>

			{/* Halls area kept mounted */}
			<section style={{ marginTop: 24 }}>
				<div style={{ display: "flex", justifyContent: "space-between", minHeight: 32 }}>
					<h3 style={{ margin: 0, minHeight: 24 }}>
						{selectedCinema ? t("halls.titleForCinema", { cinema: selectedCinema.name }) : "\u00A0"}
					</h3>
					{selectedCinema && (
						<button
							onClick={() => navigate("/admin/halls/add", { state: { cinemaUid: selectedCinema.uid } })}
							className="btn btn-sm btn-outline-primary"
						>
							{t("halls.addHall")}
						</button>
					)}
				</div>

				<div
					style={{
						marginTop: 12,
						minHeight: 140,
						display: "grid",
						gap: 12,
					}}
				>
					{selectedCinema &&
						halls.map((h) => (
							<div
								key={h.uid}
								style={{
									border: "1px solid #e2e2e2",
									borderRadius: 6,
									padding: "10px 12px",
									background: "#fff",
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
								}}
							>
								<div>
									<strong>{h.name}</strong>
									<div style={{ fontSize: 12, color: "#666" }}>
										{(h as any).seats ? t("halls.seats", { count: (h as any).seats }) : ""}
										{" • "}
										{(h as any).active ? t("halls.active") : t("halls.inactive")}
									</div>
								</div>
								<div style={{ display: "flex", gap: 8 }}>
									<button
										className="btn btn-sm btn-outline-secondary"
										onClick={() => navigate(`/admin/halls/${h.uid}`)}
									>
										{t("halls.view")}
									</button>
									<button
										className="btn btn-sm btn-outline-danger"
										onClick={async () => {
											if (!confirm(t("halls.deleteConfirm"))) return;
											try {
												const res = await fetch(API_ENDPOINTS.hallDetails(h.uid), {
													method: "DELETE",
													headers: {
														Authorization: `Bearer ${token()}`,
														"Content-Type": "application/json",
													},
												});
												if (!res.ok) throw new Error(t("halls.deleteFailed"));
												setHalls((prev) => prev.filter((x) => x.uid !== h.uid));
											} catch (err) {
												console.error(err);
												alert(t("halls.deleteFailed"));
											}
										}}
									>
										{t("halls.delete")}
									</button>
								</div>
							</div>
						))}

					{selectedCinema && halls.length === 0 && !loading && (
						<div style={{ color: "#666" }}>{t("halls.noHalls")}</div>
					)}

					{selectedCinema && loading && halls.length === 0 && <div style={{ opacity: 0.6 }}>{t("halls.loading")}</div>}
				</div>
			</section>
		</div>
	);
};

export default ManageHalls;
