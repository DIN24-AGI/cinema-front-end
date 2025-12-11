import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import type { Cinema, Hall } from "../types/cinemaTypes";
import { API_ENDPOINTS } from "../util/baseURL";
import { useTranslation } from "react-i18next";
import ManageHall from "../components/ManageHall";

const CinemaDetails: React.FC = () => {
	const { t } = useTranslation();
	const location = useLocation();
	const cinema = location.state?.cinema;

	const navigate = useNavigate();
	const { id: cinema_uid } = useParams<{ id: string }>();
	const [cinemaData, setCinemaData] = useState<Cinema | null>(null);
	const [halls, setHalls] = useState<Hall[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const token = localStorage.getItem("token");

	// Fetch cinema details on mount / param change
	useEffect(() => {
		const fetchCinema = async () => {
			if (!cinema_uid) return;
			if (!token) {
				setError("No token found. Please log in.");
				setLoading(false);
				return;
			}

			try {
				const res = await fetch(`${API_ENDPOINTS.cinemas}/${cinema_uid}`, {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				});

				if (!res.ok) throw new Error("Failed to fetch cinema");

				const data: Cinema = await res.json();
				setCinemaData(data);
			} catch (err: any) {
				console.error(err);
				setError(err.message || "Something went wrong");
			} finally {
				setLoading(false);
			}
		};

		fetchCinema();
	}, [cinema_uid]);

	// Fetch list of halls associated with this cinema
	const fetchHalls = async () => {
		if (!cinema_uid) return;
		try {
			const res = await fetch(API_ENDPOINTS.hallsByCinema(cinema_uid), {
				headers: { Authorization: `Bearer ${token}` },
			});
			if (!res.ok) throw new Error("Failed to fetch halls");
			const data: Hall[] = await res.json();
			setHalls(data);
		} catch (err) {
			console.error(err);
		}
	};

	// Fetch halls whenever the cinema UID changes
	useEffect(() => {
		if (cinema_uid) fetchHalls();
	}, [cinema_uid]);

	/**
	 * Callback when a hall is deleted - refresh the halls list
	 */
	const handleHallDeleted = () => {
		fetchHalls();
	};

	// Navigate to edit form
	const handleEdit = () => {
		const displayCinema = cinemaData || cinema;
		if (displayCinema) {
			navigate("/admin/add-cinema", { state: { cinema: displayCinema } });
		}
	};

	// Return to cinemas list
	const handleBack = () => {
		navigate("/admin/cinemas");
	};

	// Delete cinema
	const handleDelete = async () => {
		// Always prefer server-fetched data; fallback to location state
		let currentCinema: Cinema | null = cinema || null;
		console.log(currentCinema);
		if (!cinema_uid) return;

		// If city_uid is missing (e.g., shallow state passed via navigation), refetch full cinema details
		if (!currentCinema || !currentCinema.city_uid) {
			try {
				const token = localStorage.getItem("token");
				if (!token) {
					alert("No token found. Please log in.");
					return;
				}
				const res = await fetch(`${API_ENDPOINTS.cinemas}/${cinema_uid}`, {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				});
				if (res.ok) {
					currentCinema = await res.json();
					setCinemaData(currentCinema);
				} else {
					console.error("Failed to refetch cinema before delete", res.status);
				}
			} catch (e) {
				console.error("Error refetching cinema before delete", e);
			}
		}

		const cityUid = currentCinema?.city_uid;
		console.log("city_uid for deletion:", cityUid);
		if (!cityUid) {
			console.error("No city_uid found for cinema", { cinemaData, cinema, currentCinema });
			alert("Cannot delete cinema: missing city information");
			return;
		}

		const confirmed = window.confirm("Are you sure you want to delete this cinema? This cannot be undone.");
		if (!confirmed) return;

		const token = localStorage.getItem("token");
		if (!token) {
			alert("No token found. Please log in.");
			return;
		}

		try {
			// 1. Delete the cinema
			const deleteRes = await fetch(`${API_ENDPOINTS.cinemas}/${cinema_uid}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			if (!deleteRes.ok) throw new Error("Failed to delete cinema");

			// 2. Wait for backend processing
			await new Promise((resolve) => setTimeout(resolve, 100));

			// 3. Check remaining cinemas in the same city
			let shouldDeleteCity = false;
			try {
				console.log("Checking remaining cinemas for city:", cinema.city_name, cityUid);
				const listRes = await fetch(API_ENDPOINTS.cinemasByCity(cityUid), {
					headers: { Authorization: `Bearer ${token}` },
				});

				console.log("Remaining cinemas response status:", listRes.status);

				if (listRes.ok) {
					const remaining: Cinema[] = await listRes.json();
					console.log("Remaining cinemas:", remaining);
					console.log("Deleted cinema UID:", cinema_uid);
					const activeCinemas = remaining.filter((c) => c.uid !== cinema_uid);
					console.log("Active cinemas after filter:", activeCinemas);
					if (activeCinemas.length === 0) {
						shouldDeleteCity = true;
						console.log("No active cinemas found, will delete city");
					}
				} else if (listRes.status === 404) {
					shouldDeleteCity = true;
					console.log("404 response, will delete city");
				}
			} catch (e) {
				console.warn("Failed to verify remaining cinemas; skipping city deletion check.", e);
			}

			console.log("Should delete city?", shouldDeleteCity);

			// 4. Delete city if it's now empty
			if (shouldDeleteCity) {
				console.log("Attempting to delete city:", cityUid);
				const cityDeleteRes = await fetch(`${API_ENDPOINTS.cities}/${cityUid}`, {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				});
				console.log("City deletion response status:", cityDeleteRes.status);
				if (!cityDeleteRes.ok) {
					const errorText = await cityDeleteRes.text();
					console.warn("City deletion failed:", errorText);
				} else {
					console.log("City deleted successfully as it had no remaining cinemas.");
				}
			}

			alert("Cinema deleted successfully!");
			navigate("/admin/cinemas");
		} catch (err: any) {
			console.error(err);
			alert(err.message || "Failed to delete cinema");
		}
	};

	// Conditional early returns for UX states
	if (loading) return <p>Loading cinema details...</p>;
	if (error) return <p style={{ color: "red" }}>{error}</p>;

	// Use cinemaData if available, fallback to cinema from state
	const displayCinema = cinemaData || cinema;

	// Check if we have cinema data after loading
	if (!displayCinema) return <p>Cinema not found.</p>;

	return (
		<div className="container py-4">
			<div className="card shadow-sm">
				<div className="card-header">
					<h2 className="mb-0">{displayCinema.name}</h2>
				</div>

				<div className="card-body">
					<div className="row mb-2">
						<div className="col-sm-3 text-muted fw-semibold">{t("cinemas.address")}:</div>
						<div className="col-sm-9">{displayCinema.address || "Add the address"}</div>
					</div>

					<div className="row mb-3">
						<div className="col-sm-3 text-muted fw-semibold">{t("cinemas.phone")}:</div>
						<div className="col-sm-9">{displayCinema.phone || "Add the phone number"}</div>
					</div>
				</div>

				{/* Halls Section - Render ManageHall components */}
				<div className="m-4">
					<div className="d-flex justify-content-between align-items-center mb-3">
						<h3 className="mb-0">{t("cinemas.halls")}</h3>
						<button
							onClick={() => navigate("/admin/halls/add", { state: { cinemaUid: displayCinema.uid } })}
							className="btn btn-sm btn-outline-primary"
						>
							{t("halls.addHall")}
						</button>
					</div>
					{halls.length > 0 ? (
						<div className="row row-cols-1 g-3">
							{halls.map((hall: Hall) => (
								<div key={hall.uid} className="col">
									<ManageHall hall={hall} cinema={displayCinema} onDeleted={handleHallDeleted} />
								</div>
							))}
						</div>
					) : (
						<div className="alert alert-info mt-2 mb-0">{t("cinemas.noHallsAdded")}</div>
					)}
				</div>

				<div className="card-footer d-flex gap-2">
					<button type="button" className="btn btn-outline-secondary" onClick={handleBack}>
						{t("util.back")}
					</button>
					<button type="button" className="btn btn-primary" onClick={handleEdit}>
						{t("cinemas.editCinema")}
					</button>
					<button type="button" className="btn btn-danger ms-auto" onClick={handleDelete}>
						{t("cinemas.deleteCinema")}
					</button>
				</div>
			</div>
		</div>
	);
};

export default CinemaDetails;
