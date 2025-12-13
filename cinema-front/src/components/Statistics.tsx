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

	// Extract unique values for dropdowns
	const cinemaOptions = React.useMemo(() => {
		const cinemas = new Set<string>();
		data.forEach((payment) => {
			payment.reservations.forEach((res) => {
				cinemas.add(res.cinema_name);
			});
		});
		return Array.from(cinemas).sort();
	}, [data]);

	const hallOptions = React.useMemo(() => {
		const halls = new Set<string>();
		data.forEach((payment) => {
			payment.reservations.forEach((res) => {
				if (!cinemaFilter || res.cinema_name === cinemaFilter) {
					halls.add(res.hall_name);
				}
			});
		});
		return Array.from(halls).sort();
	}, [data, cinemaFilter]);

	const movieOptions = React.useMemo(() => {
		const movies = new Set<string>();
		data.forEach((payment) => {
			payment.reservations.forEach((res) => {
				movies.add(res.movie_title);
			});
		});
		return Array.from(movies).sort();
	}, [data]);

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
					(!cinemaFilter || reservation.cinema_name === cinemaFilter) &&
					(!hallFilter || reservation.hall_name === hallFilter) &&
					(!movieFilter || reservation.movie_title === movieFilter)
				);
			});
		});
		setFilteredData(filtered);
	}, [data, cinemaFilter, hallFilter, movieFilter]);

	const downloadCSV = () => {
		// Create CSV header
		const headers = [
			"Payment ID",
			"Email",
			"Amount (EUR)",
			"Currency",
			"Seats",
			"Movie(s)",
			"Cinema",
			"Hall(s)",
			"Showtime",
			"Paid At",
		];

		// Create CSV rows
		const rows = filteredData.map((payment) => {
			const firstRes = payment.reservations[0];
			const seatCount = payment.reservations.length;
			const seatList = payment.reservations.map((r) => `${r.seat_row}-${r.seat_number}`).join("; ");
			const movies = [...new Set(payment.reservations.map((r) => r.movie_title))].join("; ");
			const cinemas = [...new Set(payment.reservations.map((r) => r.cinema_name))].join("; ");
			const halls = [...new Set(payment.reservations.map((r) => r.hall_name))].join("; ");
			const showtime = firstRes ? new Date(firstRes.showtime_start).toLocaleString() : "";
			const paidAt = new Date(payment.paid_at).toLocaleString();

			return [
				payment.payment_uid,
				payment.user_email,
				(payment.amount / 100).toFixed(2),
				payment.currency.toUpperCase(),
				`${seatCount} (${seatList})`,
				movies,
				cinemas,
				halls,
				showtime,
				paidAt,
			];
		});

		// Combine headers and rows
		const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n");

		// Create blob and download
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		const url = URL.createObjectURL(blob);

		link.setAttribute("href", url);
		link.setAttribute("download", `payment-statistics-${new Date().toISOString().split("T")[0]}.csv`);
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

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
							<select
								id="cinemaFilter"
								className="form-select"
								value={cinemaFilter}
								onChange={(e) => {
									setCinemaFilter(e.target.value);
									setHallFilter(""); // Reset hall filter when cinema changes
								}}
							>
								<option value="">All Cinemas</option>
								{cinemaOptions.map((cinema) => (
									<option key={cinema} value={cinema}>
										{cinema}
									</option>
								))}
							</select>
						</div>
						<div className="col-md-6 col-lg-2">
							<label htmlFor="hallFilter" className="form-label">
								Hall
							</label>
							<select
								id="hallFilter"
								className="form-select"
								value={hallFilter}
								onChange={(e) => setHallFilter(e.target.value)}
							>
								<option value="">All Halls</option>
								{hallOptions.map((hall) => (
									<option key={hall} value={hall}>
										{hall}
									</option>
								))}
							</select>
						</div>
						<div className="col-md-6 col-lg-2">
							<label htmlFor="movieFilter" className="form-label">
								Movie
							</label>
							<select
								id="movieFilter"
								className="form-select"
								value={movieFilter}
								onChange={(e) => setMovieFilter(e.target.value)}
							>
								<option value="">All Movies</option>
								{movieOptions.map((movie) => (
									<option key={movie} value={movie}>
										{movie}
									</option>
								))}
							</select>
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
							<div className="d-flex justify-content-between align-items-center mb-3">
								<h5 className="card-title mb-0">Results ({filteredData.length} payments)</h5>
								<div className="d-flex align-items-center gap-3">
									<h5 className="mb-0">
										Total:{" "}
										<span className="badge bg-success fs-6">
											{(filteredData.reduce((sum, payment) => sum + payment.amount, 0) / 100).toFixed(2)} EUR
										</span>
									</h5>
									<button className="btn btn-success btn-sm" onClick={downloadCSV}>
										<i className="bi bi-download"></i> Download CSV
									</button>
								</div>
							</div>
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
