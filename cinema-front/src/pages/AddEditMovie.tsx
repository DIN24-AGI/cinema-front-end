/**
 * AddEditMovie
 * Dual-purpose form for creating new movies and editing existing ones.
 *
 * Mode detection:
 * - Add mode: /admin/movies/add (no :id param)
 * - Edit mode: /admin/movies/edit/:id (loads existing movie data)
 *
 * Features:
 * - Form validation (required fields, numeric bounds)
 * - API integration: POST for create, PUT for update
 * - Null safety for textarea/input controlled components
 * - i18n support for all labels and messages
 */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { API_ENDPOINTS } from "../util/baseURL";
import type { MovieItem } from "../types/cinemaTypes";

const AddEditMovie = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const isEditMode = Boolean(id);

	const [formData, setFormData] = useState({
		title: "",
		duration_minutes: "",
		description: "",
		poster_url: "",
		release_year: "",
		shows_allowed: "",
		shows_left: "",
		active: true,
	});

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [fetchingOmdb, setFetchingOmdb] = useState(false);
	const [omdbError, setOmdbError] = useState("");

	const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY;

	useEffect(() => {
		if (isEditMode) {
			const fetchMovie = async () => {
				const token = localStorage.getItem("token");
				if (!token) {
					navigate("/admin/login");
					return;
				}

				try {
					setLoading(true);
					setError("");
					const res = await fetch(`${API_ENDPOINTS.movies}/${id}`, {
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
					});

					if (!res.ok) throw new Error("fetchFailed");

					const movie: MovieItem = await res.json();
					setFormData({
						title: movie.title ?? "",
						duration_minutes: String(movie.duration_minutes ?? ""),
						description: movie.description ?? "",
						poster_url: movie.poster_url ?? "",
						release_year: String(movie.release_year ?? ""),
						shows_allowed: String(movie.shows_allowed ?? ""),
						shows_left: String(movie.shows_left ?? ""),
						active: Boolean(movie.active),
					});
				} catch (e: any) {
					setError(e.message === "fetchFailed" ? t("movies.fetchError") : t("cinemas.genericError"));
				} finally {
					setLoading(false);
				}
			};

			fetchMovie();
		}
	}, [id, isEditMode, navigate, t]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value, type } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
		}));
	};

	/**
	 * Fetches movie details from OMDB API by title
	 */
	const handleFetchOmdbDetails = async () => {
		if (!formData.title.trim()) {
			setOmdbError(t("movies.titleRequired"));
			return;
		}

		try {
			setFetchingOmdb(true);
			setOmdbError("");

			const response = await fetch(
				`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(formData.title)}&type=movie`
			);

			if (!response.ok) {
				throw new Error(t("movies.omdbFetchError"));
			}

			const data = await response.json();

			if (data.Response === "False") {
				setOmdbError(t("movies.movieNotFound"));
				return;
			}

			// Parse and set movie details
			setFormData((prev) => ({
				...prev,
				release_year: data.Year || prev.release_year,
				duration_minutes: data.Runtime ? String(parseInt(data.Runtime.split(" ")[0])) : prev.duration_minutes,
				poster_url: data.Poster && data.Poster !== "N/A" ? data.Poster : prev.poster_url,
				description: data.Plot || prev.description,
			}));

			setOmdbError("");
		} catch (err: any) {
			console.error("OMDB fetch error:", err);
			setOmdbError(err.message || t("movies.omdbFetchError"));
		} finally {
			setFetchingOmdb(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (
			!formData.title.trim() ||
			!formData.duration_minutes ||
			!formData.release_year ||
			!formData.shows_allowed ||
			!formData.shows_left
		) {
			setError(t("changePassword.fillFields"));
			return;
		}

		const token = localStorage.getItem("token");
		if (!token) {
			navigate("/admin/login");
			return;
		}

		try {
			setSubmitting(true);
			setError("");

			const payload = {
				title: formData.title.trim(),
				duration_minutes: parseInt(formData.duration_minutes, 10),
				description: formData.description.trim(),
				poster_url: formData.poster_url.trim(),
				release_year: parseInt(formData.release_year, 10),
				shows_allowed: parseInt(formData.shows_allowed, 10),
				shows_left: parseInt(formData.shows_left, 10),
				active: formData.active,
			};

			const url = isEditMode ? `${API_ENDPOINTS.movies}/${id}` : API_ENDPOINTS.movies;

			const method = isEditMode ? "PUT" : "POST";

			const res = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(payload),
			});

			if (!res.ok) throw new Error("submitFailed");

			navigate("/admin/movies");
		} catch (e: any) {
			setError(
				e.message === "submitFailed"
					? isEditMode
						? t("movies.updateError")
						: t("movies.createError")
					: t("cinemas.genericError")
			);
		} finally {
			setSubmitting(false);
		}
	};

	const handleCancel = () => {
		navigate("/admin/movies");
	};

	// Show loading state while fetching existing movie data
	if (loading) {
		return (
			<div className="container py-4">
				<div className="alert alert-info">{t("cinemas.loading")}</div>
			</div>
		);
	}

	return (
		<div className="container py-4">
			{/* Page title changes based on mode */}
			<h2 className="mb-4">{isEditMode ? t("movies.editMovie") : t("movies.addMovie")}</h2>

			{/* Error alert shown above form */}
			{error && <div className="alert alert-danger">{error}</div>}
			{omdbError && <div className="alert alert-warning">{omdbError}</div>}

			<form onSubmit={handleSubmit}>
				{/* Grid layout: title (6 cols), release year (3 cols), duration (3 cols) */}
				<div className="row">
					<div className="col-md-6 mb-3">
						<label htmlFor="title" className="form-label">
							{t("movies.title")} *
						</label>
						<div className="input-group">
							<input
								type="text"
								className="form-control"
								id="title"
								name="title"
								value={formData.title}
								onChange={handleChange}
								required
							/>
							<button
								type="button"
								className="btn btn-outline-secondary"
								onClick={handleFetchOmdbDetails}
								disabled={fetchingOmdb || !formData.title.trim()}
							>
								{fetchingOmdb ? t("util.loading") : t("movies.fetchDetails")}
							</button>
						</div>
					</div>

					<div className="col-md-3 mb-3">
						<label htmlFor="release_year" className="form-label">
							{t("movies.releaseYear")} *
						</label>
						<input
							type="number"
							className="form-control"
							id="release_year"
							name="release_year"
							value={formData.release_year}
							onChange={handleChange}
							min="1800"
							max="2100"
							required
						/>
					</div>

					<div className="col-md-3 mb-3">
						<label htmlFor="duration_minutes" className="form-label">
							{t("movies.durationMinutes")} *
						</label>
						<input
							type="number"
							className="form-control"
							id="duration_minutes"
							name="duration_minutes"
							value={formData.duration_minutes}
							onChange={handleChange}
							min="1"
							required
						/>
					</div>
				</div>

				{/* Optional poster URL field */}
				<div className="mb-3">
					<label htmlFor="poster_url" className="form-label">
						{t("movies.posterUrl")}
					</label>
					<input
						type="url"
						className="form-control"
						id="poster_url"
						name="poster_url"
						value={formData.poster_url}
						onChange={handleChange}
						placeholder="https://example.com/poster.jpg"
					/>
					{formData.poster_url && (
						<img src={formData.poster_url} alt="Movie poster preview" className="mt-2" style={{ maxHeight: "150px" }} />
					)}
				</div>

				{/* Optional multi-line description */}
				<div className="mb-3">
					<label htmlFor="description" className="form-label">
						{t("movies.description")}
					</label>
					<textarea
						className="form-control"
						id="description"
						name="description"
						value={formData.description}
						onChange={handleChange}
						rows={4}
					/>
				</div>

				{/* Shows management: allowed vs remaining */}
				<div className="row">
					<div className="col-md-6 mb-3">
						<label htmlFor="shows_allowed" className="form-label">
							{t("movies.showsAllowed")} *
						</label>
						<input
							type="number"
							className="form-control"
							id="shows_allowed"
							name="shows_allowed"
							value={formData.shows_allowed}
							onChange={handleChange}
							min="0"
							required
						/>
					</div>

					<div className="col-md-6 mb-3">
						<label htmlFor="shows_left" className="form-label">
							{t("movies.showsLeft")} *
						</label>
						<input
							type="number"
							className="form-control"
							id="shows_left"
							name="shows_left"
							value={formData.shows_left}
							onChange={handleChange}
							min="0"
							required
						/>
					</div>
				</div>

				{/* Active/inactive checkbox */}
				<div className="mb-3 form-check">
					<input
						type="checkbox"
						className="form-check-input"
						id="active"
						name="active"
						checked={formData.active}
						onChange={handleChange}
					/>
					<label className="form-check-label" htmlFor="active">
						{t("util.active")}
					</label>
				</div>

				{/* Submit and cancel buttons */}
				<div className="d-flex gap-2">
					<button type="submit" className="btn btn-primary" disabled={submitting}>
						{submitting ? t("util.saving") : isEditMode ? t("util.save") : t("movies.addMovie")}
					</button>
					<button type="button" className="btn btn-secondary" onClick={handleCancel} disabled={submitting}>
						{t("util.cancel")}
					</button>
				</div>
			</form>
		</div>
	);
};

export default AddEditMovie;
