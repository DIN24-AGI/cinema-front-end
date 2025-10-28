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
		<div style={{ display: "flex", gap: "1rem", alignItems: "center", padding: "0.5rem" }}>
			<span>
				<strong>{movieTitle}</strong>
			</span>
			<span>|</span>
			<span>{date}</span>
			<span>{screeningTime}</span>
			<span>|</span>
			<span>Hall {cinemaHallNumber}</span>
			<span>|</span>
			<span>{length}</span>
			<span>|</span>
			<span>${ticketPrice.toFixed(2)}</span>
			<span>|</span>
			<span>{cinemaTheater}</span>
		</div>
	);
};

export default Movie;
