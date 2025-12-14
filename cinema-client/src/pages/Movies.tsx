import { useEffect, useState } from "react";
import MovieBanner from "../components/MovieBanner";
import type { Movie } from "../types/cinemaTypes";
import { API_ENDPOINTS } from "../util/baseURL";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

const Movies = () => {
	const { t } = useTranslation();
	const [movies, setMovies] = useState<Movie[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	// Filters
	const [searchTitle, setSearchTitle] = useState("");
	const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);

	// Fetch all active movies without cinema filter
	useEffect(() => {
		const fetchMovies = async () => {
			try {
				setLoading(true);

				const res = await fetch(API_ENDPOINTS.movies);

				if (!res.ok) throw new Error(t("movies.error"));

				const data: Movie[] = await res.json();
				setMovies(data);
			} catch (err: any) {
				console.error(err);
				setError(err.message || t("movies.error"));
			} finally {
				setLoading(false);
			}
		};

		fetchMovies();
	}, [t]);

	useEffect(() => {
		let result = [...movies];

		if (searchTitle.trim() !== "") {
			result = result.filter((m) => m.title.toLowerCase().includes(searchTitle.toLowerCase()));
		}

		setFilteredMovies(result);
	}, [searchTitle, movies]);

	const openMovieDetails = (movie: Movie) => {
		navigate(`/movies/${movie.uid}`, { state: { movieUid: movie.uid } });
	};

	if (loading) return <p>{t("movies.loading")}</p>;
	if (error) return <p className="text-danger">{error}</p>;

	// const onSelectCinema = (cinema: Cinema) => {
	// 	setSelectedCinema(cinema);
	// };
	return (
		<div>
			{/* ---------- FILTER BAR ---------- */}
			<div className="card p-0 mb-4 shadow-sm">
				<div className="row g-3 pt-3">
					{/* Filter by location*/}

					{/* <CinemaSelectorDropdown
						cinemas={cinemas}
						cities={cities}
						widthClass="col-12 col-md-4"
						label={t("schedule.location")}
						selectedCinema={selectedCinema!}
						onSelectCinema={onSelectCinema}
					/> */}

					{/* Filter by movie title */}
					<div className="col-12 col-md-4">
						{/* <label className="form-label fw-semibold">{t("schedule.title")}</label> */}
						<input
							type="text"
							className="form-control"
							placeholder={t("schedule.search")}
							value={searchTitle}
							onChange={(e) => setSearchTitle(e.target.value)}
						/>
					</div>

					{/* Filter by date*/}
					{/* <div className="col-12 col-md-4">
						<input
							type="date"
							className="form-control"
							value={selectedDate}
							onChange={(e) => setSelectedDate(e.target.value)}
						/>
					</div> */}
				</div>
			</div>
			{/* -------------------------------- */}

			{/* ------- MOVIE RESULTS ------- */}
			<div className="row g-3">
				{filteredMovies.length === 0 && <p className="text-center text-muted">No movies found.</p>}

				{filteredMovies.map((movie) => (
					<div key={movie.uid} className="col-12 col-md-6 col-lg-4">
						<MovieBanner movie={movie} onDetails={openMovieDetails} />
					</div>
				))}
			</div>
		</div>
	);
};

export default Movies;
