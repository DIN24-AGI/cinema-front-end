interface MovieProps {
	movieTitle: string;
	date: string;
	screeningTime: string;
	cinemaHallNumber: number;
	length: string;
	ticketPrice: number;
	cinemaTheater: string;
}

const Movie = ({
	movieTitle,
	date,
	screeningTime,
	cinemaHallNumber,
	length,
	ticketPrice,
	cinemaTheater,
}: MovieProps) => {
	return (
		<div className="card">
			<div className="card-body">
				<h5 className="card-title">{movieTitle}</h5>
				<div className="d-flex flex-wrap gap-3 align-items-center text-muted">
					<span>
						<i className="bi bi-calendar me-1"></i>
						{date}
					</span>
					<span>
						<i className="bi bi-clock me-1"></i>
						{screeningTime}
					</span>
					<span>
						<i className="bi bi-door-open me-1"></i>
						Hall {cinemaHallNumber}
					</span>
					<span>
						<i className="bi bi-hourglass-split me-1"></i>
						{length}
					</span>
					<span className="badge bg-primary">${ticketPrice.toFixed(2)}</span>
					<span className="ms-auto fw-semibold">{cinemaTheater}</span>
				</div>
			</div>
		</div>
	);
};

export default Movie;
