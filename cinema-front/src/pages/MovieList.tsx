import Movie from "../components/Movie";
import dummyData from "../data/dummy_data.json";
import { useState } from "react";

const MovieList = () => {
	const [selectedLocation, setSelectedLocation] = useState<string>("all");
	const [selectedDate, setSelectedDate] = useState<string>("all");
	const [selectedMovie, setSelectedMovie] = useState<string>("all");

	// Get unique values for dropdowns
	const locations = ["all", ...Array.from(new Set(dummyData.map((movie) => movie.cinemaTheater)))];
	const dates = ["all", ...Array.from(new Set(dummyData.map((movie) => movie.date)))].sort();
	const movieTitles = ["all", ...Array.from(new Set(dummyData.map((movie) => movie.movieTitle)))].sort();

	// Filter movies based on selected values
	const filteredMovies = dummyData.filter((movie) => {
		const locationMatch = selectedLocation === "all" || movie.cinemaTheater === selectedLocation;
		const dateMatch = selectedDate === "all" || movie.date === selectedDate;
		const movieMatch = selectedMovie === "all" || movie.movieTitle === selectedMovie;
		return locationMatch && dateMatch && movieMatch;
	});

	return (
		<div style={{ padding: "1rem", paddingTop: "0" }}>
			<h1 style={{ marginTop: "1rem" }}>Movie Screenings</h1>

			<div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", marginTop: "1rem" }}>
				<div>
					<label htmlFor="location" style={{ marginRight: "0.5rem" }}>
						Location:
					</label>
					<select
						id="location"
						value={selectedLocation}
						onChange={(e) => setSelectedLocation(e.target.value)}
						style={{ padding: "0.25rem" }}
					>
						{locations.map((location) => (
							<option key={location} value={location}>
								{location === "all" ? "All Locations" : location}
							</option>
						))}
					</select>
				</div>

				<div>
					<label htmlFor="date" style={{ marginRight: "0.5rem" }}>
						Date:
					</label>
					<select
						id="date"
						value={selectedDate}
						onChange={(e) => setSelectedDate(e.target.value)}
						style={{ padding: "0.25rem" }}
					>
						{dates.map((date) => (
							<option key={date} value={date}>
								{date === "all" ? "All Dates" : date}
							</option>
						))}
					</select>
				</div>

				<div>
					<label htmlFor="movie" style={{ marginRight: "0.5rem" }}>
						Movie:
					</label>
					<select
						id="movie"
						value={selectedMovie}
						onChange={(e) => setSelectedMovie(e.target.value)}
						style={{ padding: "0.25rem" }}
					>
						{movieTitles.map((title) => (
							<option key={title} value={title}>
								{title === "all" ? "All Movies" : title}
							</option>
						))}
					</select>
				</div>
			</div>

			<div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
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
