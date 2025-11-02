import { useState } from "react";
import Movie from "../components/Movie";
import dummyData from "../data/dummy_data.json";
import ApiStatus from "../components/ApiStatus";
import { API_ENDPOINTS } from "../util/baseURL";

const MovieList = () => {
	const [selectedLocation, setSelectedLocation] = useState<string>("all");
	const [selectedDate, setSelectedDate] = useState<string>("all");
	const [selectedMovie, setSelectedMovie] = useState<string>("all");

	const locations = ["all", ...Array.from(new Set(dummyData.map((movie) => movie.cinemaTheater)))];
	const dates = ["all", ...Array.from(new Set(dummyData.map((movie) => movie.date)))].sort();
	const movieTitles = ["all", ...Array.from(new Set(dummyData.map((movie) => movie.movieTitle)))].sort();

	const filteredMovies = dummyData.filter((movie) => {
		const locationMatch = selectedLocation === "all" || movie.cinemaTheater === selectedLocation;
		const dateMatch = selectedDate === "all" || movie.date === selectedDate;
		const movieMatch = selectedMovie === "all" || movie.movieTitle === selectedMovie;
		return locationMatch && dateMatch && movieMatch;
	});

	return (
		<div className="container py-4">
			<div className="row g-3 mb-4">
				<div className="col-md-6">
					<ApiStatus endpoint={API_ENDPOINTS.test} title="Backend Test" />
				</div>
				<div className="col-md-6">
					<ApiStatus endpoint={API_ENDPOINTS.dbHealth} title="Database Health" />
				</div>
			</div>
			<h1 className="mb-4">Movie Screenings</h1>

			<div className="row g-3 mb-4">
				<div className="col-md-4">
					<label htmlFor="location" className="form-label">
						Location:
					</label>
					<select
						id="location"
						className="form-select"
						value={selectedLocation}
						onChange={(e) => setSelectedLocation(e.target.value)}
					>
						{locations.map((loc) => (
							<option key={loc} value={loc}>
								{loc === "all" ? "All Locations" : loc}
							</option>
						))}
					</select>
				</div>

				<div className="col-md-4">
					<label htmlFor="date" className="form-label">
						Date:
					</label>
					<select
						id="date"
						className="form-select"
						value={selectedDate}
						onChange={(e) => setSelectedDate(e.target.value)}
					>
						{dates.map((date) => (
							<option key={date} value={date}>
								{date === "all" ? "All Dates" : date}
							</option>
						))}
					</select>
				</div>

				<div className="col-md-4">
					<label htmlFor="movie" className="form-label">
						Movie:
					</label>
					<select
						id="movie"
						className="form-select"
						value={selectedMovie}
						onChange={(e) => setSelectedMovie(e.target.value)}
					>
						{movieTitles.map((title) => (
							<option key={title} value={title}>
								{title === "all" ? "All Movies" : title}
							</option>
						))}
					</select>
				</div>
			</div>

			<div className="d-flex flex-column gap-2">
				{filteredMovies.map((movie, index) => (
					<Movie
						key={index}
						movieTitle={movie.movieTitle}
						date={movie.date}
						screeningTime={movie.screeningTime}
						cinemaHallNumber={movie.cinemaHallNumber}
						length={movie.length}
						ticketPrice={movie.ticketPrice}
						cinemaTheater={movie.cinemaTheater}
					/>
				))}
			</div>
		</div>
	);
};

export default MovieList;
