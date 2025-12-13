import React, { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../util/baseURL";

interface Reservation {
	reservation_uid: string;
	seat_row: number;
	seat_number: number;
	showtime_start: string;
	showtime_end: string;
	adult_price: number;
	child_price: number;
	movie_title: string;
	hall_name: string;
	cinema_name: string;
	cinema_uid: string;
}

interface PaymentRecord {
	payment_uid: string;
	amount: number;
	currency: string;
	payment_status: string;
	payment_created_at: string;
	payment_updated_at: string;
	first_reservation_at: string;
	paid_at: string;
	expires_at: string | null;
	reservation_status: string;
	user_email: string;
	reservations: Reservation[];
}

export const Statistics: React.FC = () => {
	const [data, setData] = useState<PaymentRecord[]>([]);
	const [filteredData, setFilteredData] = useState<PaymentRecord[]>([]);
	const [startDate, setStartDate] = useState<string>("");
	const [endDate, setEndDate] = useState<string>("");
	const [cinemaFilter, setCinemaFilter] = useState<string>("");
	const [hallFilter, setHallFilter] = useState<string>("");
	const [movieFilter, setMovieFilter] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	const fetchStatistics = async () => {
		setLoading(true);
		try {
			const params = new URLSearchParams({
				...(startDate && { start_date: startDate }),
				...(endDate && { end_date: endDate }),
				status: "paid",
			});

			const token = localStorage.getItem("token");
			const response = await fetch(`${API_ENDPOINTS.statistics}?${params}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			const result = await response.json();
			setData(result);
		} catch (error) {
			console.error("Failed to fetch statistics:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const filtered = data.filter((payment) => {
			// Check if any reservation in this payment matches the filters
			return payment.reservations.some((reservation) => {
				return (
					(!cinemaFilter || reservation.cinema_name.toLowerCase().includes(cinemaFilter.toLowerCase())) &&
					(!hallFilter || reservation.hall_name.toLowerCase().includes(hallFilter.toLowerCase())) &&
					(!movieFilter || reservation.movie_title.toLowerCase().includes(movieFilter.toLowerCase()))
				);
			});
		});
		setFilteredData(filtered);
	}, [data, cinemaFilter, hallFilter, movieFilter]);

	return (
		<div className="container mt-4">
			<h2 className="mb-4">Payment Statistics</h2>

			<div className="card mb-4">
				<div className="card-body">
					<h5 className="card-title mb-3">Filters</h5>
					<div className="row g-3">
						<div className="col-md-6 col-lg-3">
							<label htmlFor="startDate" className="form-label">
								Start Date
							</label>
							<input
								type="date"
								id="startDate"
								className="form-control"
								value={startDate}
								onChange={(e) => setStartDate(e.target.value)}
							/>
						</div>
						<div className="col-md-6 col-lg-3">
							<label htmlFor="endDate" className="form-label">
								End Date
							</label>
							<input
								type="date"
								id="endDate"
								className="form-control"
								value={endDate}
								onChange={(e) => setEndDate(e.target.value)}
							/>
						</div>
						<div className="col-md-6 col-lg-2">
							<label htmlFor="cinemaFilter" className="form-label">
								Cinema
							</label>
							<input
								type="text"
								id="cinemaFilter"
								className="form-control"
								value={cinemaFilter}
								onChange={(e) => setCinemaFilter(e.target.value)}
								placeholder="Filter..."
							/>
						</div>
						<div className="col-md-6 col-lg-2">
							<label htmlFor="hallFilter" className="form-label">
								Hall
							</label>
							<input
								type="text"
								id="hallFilter"
								className="form-control"
								value={hallFilter}
								onChange={(e) => setHallFilter(e.target.value)}
								placeholder="Filter..."
							/>
						</div>
						<div className="col-md-6 col-lg-2">
							<label htmlFor="movieFilter" className="form-label">
								Movie
							</label>
							<input
								type="text"
								id="movieFilter"
								className="form-control"
								value={movieFilter}
								onChange={(e) => setMovieFilter(e.target.value)}
								placeholder="Filter..."
							/>
						</div>
					</div>
					<div className="row mt-3">
						<div className="col">
							<button className="btn btn-primary" onClick={fetchStatistics} disabled={loading}>
								{loading ? (
									<>
										<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
										Loading...
									</>
								) : (
									"Fetch Statistics"
								)}
							</button>
						</div>
					</div>
				</div>
			</div>

			<div className="card">
				<div className="card-body">
					{filteredData.length === 0 ? (
						<div className="alert alert-info" role="alert">
							No payment data found. Please select date range and click "Fetch Statistics".
						</div>
					) : (
						<>
							<h5 className="card-title mb-3">Results ({filteredData.length} payments)</h5>
							<div className="table-responsive">
								<table className="table table-striped table-hover">
									<thead className="table-dark">
										<tr>
											<th>Payment ID</th>
											<th>Email</th>
											<th>Amount</th>
											<th>Seats</th>
											<th>Movie(s)</th>
											<th>Cinema/Hall</th>
											<th>Showtime</th>
											<th>Paid At</th>
										</tr>
									</thead>
									<tbody>
										{filteredData.map((payment) => {
											const firstRes = payment.reservations[0];
											const seatCount = payment.reservations.length;
											const seatList = payment.reservations.map((r) => `${r.seat_row}-${r.seat_number}`).join(", ");
											const movies = [...new Set(payment.reservations.map((r) => r.movie_title))].join(", ");
											const cinemaHall = firstRes ? `${firstRes.cinema_name} / ${firstRes.hall_name}` : "";

											return (
												<tr key={payment.payment_uid}>
													<td>
														<small className="font-monospace">{payment.payment_uid.substring(0, 8)}...</small>
													</td>
													<td>{payment.user_email}</td>
													<td>
														<strong>
															{(payment.amount / 100).toFixed(2)} {payment.currency.toUpperCase()}
														</strong>
													</td>
													<td>
														<span className="badge bg-secondary" title={seatList}>
															{seatCount} seat{seatCount > 1 ? "s" : ""}
														</span>
													</td>
													<td>{movies}</td>
													<td>
														<small>{cinemaHall}</small>
													</td>
													<td>
														<small>{firstRes ? new Date(firstRes.showtime_start).toLocaleString() : ""}</small>
													</td>
													<td>
														<small>{new Date(payment.paid_at).toLocaleString()}</small>
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};
