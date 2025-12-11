import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../util/baseURL";
import { useTranslation } from "react-i18next";

type Seat = {
	seat_uid: string;
	row: number;
	number: number;
	seat_status: "free" | "reserved" | "paid" | "blocked" | "sold" | "inactive";
	is_active?: boolean;
	active?: boolean;
};

type Showtime = {
	uid: string;
	movie_uid: string;
	hall_uid: string;
	starts_at: string;
	ends_at: string;
	adult_price: number;
	child_price: number;
	title: string;
	poster_url: string;
	hall_name: string;
};

function SeatsPage() {
	const { t } = useTranslation();
	const { showtime_uid } = useParams();
	const [seats, setSeats] = useState<Seat[]>([]);
	const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
	const [showtime, setShowtime] = useState<Showtime | null>(null);
	const [discountedSeats, setDiscountedSeats] = useState<Set<string>>(new Set());

	// Seats flagged inactive in the backend should not show up in the UI
	const isSeatActive = (seat: Seat) => {
		if (seat.is_active !== undefined) return seat.is_active;
		if (seat.active !== undefined) return seat.active;
		return seat.seat_status !== "inactive";
	};

	// ----------------------------------------------------
	// 1) Load initial seats and showtime details
	// ----------------------------------------------------
	useEffect(() => {
		if (!showtime_uid) return;
		console.log("showtime_uid:", showtime_uid);
		const loadData = async () => {
			// Fetch seats
			const seatsRes = await fetch(`${API_ENDPOINTS.seats}?showtime_uid=${showtime_uid}`);
			const seatsData = await seatsRes.json();
			console.log("fetched seats data:", seatsData);
			setSeats(Array.isArray(seatsData) ? seatsData : []);

			// Fetch showtime details
			const showtimeRes = await fetch(`${API_ENDPOINTS.showtimes}/${showtime_uid}`);
			const showtimeData = await showtimeRes.json();
			console.log("fetched showtime data:", showtimeData);
			setShowtime(showtimeData);
		};

		loadData();
	}, [showtime_uid]);

	// ----------------------------------------------------
	// 2) Live WebSocket seat updates
	// ----------------------------------------------------
	useEffect(() => {
		if (!showtime_uid) return;

		// Convert backend HTTP URL → ws:// or wss://
		const WS_URL = API_ENDPOINTS.base.replace("http", "ws") + `/ws/seats?showtime_uid=${showtime_uid}`;

		console.log("Connecting seats WS:", WS_URL);

		const ws = new WebSocket(WS_URL);

		ws.onopen = () => console.log("[WS] seats connected");
		ws.onclose = () => console.log("[WS] seats disconnected");
		ws.onerror = (e) => console.error("[WS] error:", e);

		ws.onmessage = (event) => {
			const msg = JSON.parse(event.data);

			if (msg.type !== "seat_update") return;

			const { seat_uid, status } = msg;

			console.log("[WS] Seat update:", msg);

			// Update seat status in UI
			setSeats((prev) => prev.map((s) => (s.seat_uid === seat_uid ? { ...s, seat_status: status } : s)));

			// If seat becomes reserved/paid, remove from local selection
			if (status !== "free") {
				setSelectedSeats((prev) => prev.filter((id) => id !== seat_uid));
			}
		};

		return () => ws.close();
	}, [showtime_uid]);

	// ----------------------------------------------------
	// Group seats by row
	// ----------------------------------------------------
	const visibleSeats = seats.filter(isSeatActive);

	const rows = visibleSeats.reduce((acc: any, seat) => {
		if (!acc[seat.row]) acc[seat.row] = [];
		acc[seat.row].push(seat);
		return acc;
	}, {});

	// ----------------------------------------------------
	// Handle seat selection (only free seats)
	// Helper to get seat details
	const getSeatDetails = (seat_uid: string) => {
		return seats.find((s) => s.seat_uid === seat_uid);
	};

	// Toggle discount for a seat
	const toggleDiscount = (seat_uid: string) => {
		setDiscountedSeats((prev) => {
			const updated = new Set(prev);
			if (updated.has(seat_uid)) {
				updated.delete(seat_uid);
			} else {
				updated.add(seat_uid);
			}
			return updated;
		});
	};

	// Get price for a seat
	const getSeatPrice = (seat_uid: string) => {
		if (!showtime) return 0;
		return discountedSeats.has(seat_uid) ? showtime.child_price : showtime.adult_price;
	};

	// Calculate total price
	const calculateTotal = () => {
		return selectedSeats.reduce((sum, seat_uid) => sum + getSeatPrice(seat_uid), 0);
	};

	const toggleSeat = (seat_uid: string) => {
		const seat = seats.find((s) => s.seat_uid === seat_uid);
		if (!seat || !isSeatActive(seat) || seat.seat_status !== "free") return;

		setSelectedSeats((prev) => {
			const updated = prev.includes(seat_uid) ? prev.filter((s) => s !== seat_uid) : [...prev, seat_uid];
			// Remove discount when deselecting seat
			if (!updated.includes(seat_uid)) {
				setDiscountedSeats((prev) => {
					const updatedDiscounts = new Set(prev);
					updatedDiscounts.delete(seat_uid);
					return updatedDiscounts;
				});
			}
			return updated;
		});
	};

	// ----------------------------------------------------
	// Go to payment
	// ----------------------------------------------------
	const goToPayment = async () => {
		if (selectedSeats.length === 0 || !showtime) return;

		const res = await fetch(API_ENDPOINTS.paymentCreateSession, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				showtime_uid,
				seat_uids: selectedSeats,
				amount: calculateTotal(),
				currency: "eur",
			}),
		});

		const data = await res.json();

		if (data.url) {
			window.location.href = data.url;
		} else {
			alert("Payment session error");
		}
	};

	// ----------------------------------------------------
	// RENDER UI
	// ----------------------------------------------------
	return (
		<div className="container mt-4 mb-5" style={{ paddingBottom: selectedSeats.length > 0 ? "500px" : "20px" }}>
			<h2 className="text-center mb-5">{t("seats.select")}</h2>

			<div className="seat-layout">
				{Object.keys(rows).map((row) => (
					<div key={row} className="seat-row">
						<div className="row-label">Row {row}</div>

						<div className="seat-row-items">
							{seats
								.filter((s) => s.row === parseInt(row))
								.map((seat: Seat) => {
									if (!isSeatActive(seat) || seat.seat_status === "blocked") {
										return <div key={seat.seat_uid} className="seat-placeholder"></div>;
									}

									const isSelected = selectedSeats.includes(seat.seat_uid);

									return (
										<button
											key={seat.seat_uid}
											disabled={seat.seat_status !== "free"}
											onClick={() => toggleSeat(seat.seat_uid)}
											className={`seat-btn seat-${seat.seat_status} ${isSelected ? "seat-selected" : ""}`}
										>
											{seat.number}
										</button>
									);
								})}
						</div>
					</div>
				))}
			</div>

			{selectedSeats.length > 0 && (
				<div className="selected-bar">
					<div className="selected-seats-list">
						<h4>Selected Seats:</h4>
						<div className="seats-details">
							{selectedSeats.map((seat_uid) => {
								const seat = getSeatDetails(seat_uid);
								if (!seat) return null;
								const isDiscounted = discountedSeats.has(seat_uid);
								const price = getSeatPrice(seat_uid);

								return (
									<div key={seat_uid} className="seat-detail-row">
										<div className="seat-info">
											<span>
												Row {seat.row}, Seat {seat.number}
											</span>
										</div>
										<div className="seat-pricing">
											<label className="price-label">
												<input
													type="radio"
													name={`ticket-type-${seat_uid}`}
													checked={!isDiscounted}
													onChange={() => isDiscounted && toggleDiscount(seat_uid)}
												/>
												Adult: €{(showtime?.adult_price || 0) / 100}
											</label>
											<label className="price-label">
												<input
													type="radio"
													name={`ticket-type-${seat_uid}`}
													checked={isDiscounted}
													onChange={() => !isDiscounted && toggleDiscount(seat_uid)}
												/>
												Child: €{(showtime?.child_price || 0) / 100}
											</label>
											<span className="seat-price">€{price / 100}</span>
										</div>
									</div>
								);
							})}
						</div>
						<div className="total-price">
							<strong>Total: €{calculateTotal() / 100}</strong>
						</div>
					</div>
					<button className="btn btn-primary" onClick={goToPayment}>
						{t("seats.payment")}
					</button>
				</div>
			)}
		</div>
	);
}

export default SeatsPage;
