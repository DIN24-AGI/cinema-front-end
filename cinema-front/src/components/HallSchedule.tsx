import React from "react";
import type { Hall, Showing, Movie } from "../types/cinemaTypes";
import AddShowing from "./AddShowing";
import ShowingView from "./ShowingView";

/**
 * Props for HallSchedule component
 */
interface HallScheduleProps {
	hall: Hall; // Cinema hall information (name, capacity, dimensions)
	movies?: Movie[]; // Available movies that can be scheduled
	date: string; // Selected date in YYYY-MM-DD format
	schedule?: Showing[]; // Current showings scheduled for this hall on the selected date
	onCreated?: (show: Showing) => void; // Callback when a new showing is created
	onDeleted?: (uid: string) => void; // Callback when a showing is deleted
}

/**
 * HallSchedule Component
 *
 * Displays and manages the schedule for a single cinema hall on a specific date.
 *
 * Features:
 * - Shows hall information (name, capacity, active status)
 * - Lists all scheduled showings for the hall
 * - Allows adding new showings via AddShowing component
 * - Handles showing deletion
 * - Passes existing showings to AddShowing for overlap detection
 *
 * Layout:
 * 1. Header: Hall name, capacity info, active/inactive badge
 * 2. Schedule list: All showings for this hall (or "No scheduled shows" message)
 * 3. Add showing form: Interface to create new showings
 *
 * Data flow:
 * - Receives schedule and movies from parent (Scheduler)
 * - Passes schedule to AddShowing for overlap validation
 * - Notifies parent via callbacks when showings are created/deleted
 * - Parent refetches data to keep UI synchronized with database
 */
const HallSchedule: React.FC<HallScheduleProps> = ({
	hall,
	movies = [],
	date,
	schedule = [],
	onCreated,
	onDeleted,
}) => {
	return (
		<section aria-label={`Schedule for hall ${hall.name}`}>
			{/* Hall Information Header */}
			<header className="mb-3">
				{/* Hall name */}
				<h2>{hall.name}</h2>

				{/* Capacity information */}
				<small>
					Capacity: {hall.seats} seats ({hall.rows} rows × {hall.cols} cols)
				</small>

				{/* Active/Inactive status badge */}
				{hall.active !== undefined && (
					<span className={`ms-2 badge ${hall.active ? "bg-success" : "bg-secondary"}`}>
						{hall.active ? "Active" : "Inactive"}
					</span>
				)}
			</header>

			{/* Schedule List or Empty State */}
			{schedule?.length ? (
				// Display list of showings if any exist
				<div className="d-flex flex-column gap-2 mb-3">
					{schedule.map((show) => {
						// Find movie details for this showing
						const movie = movies.find((m) => m.uid === show.movie_uid);
						const movieTitle = movie?.title || "Unknown Movie";

						return (
							<ShowingView
								key={show.uid}
								id={show.uid}
								movieTitle={movieTitle}
								startTime={show.starts_at}
								endTime={show.ends_at}
								fullPrice={show.adult_price} // Price in cents
								discountedPrice={show.child_price} // Price in cents
								onDeleted={onDeleted} // Pass delete callback
							/>
						);
					})}
				</div>
			) : (
				// Empty state when no showings scheduled
				<p className="text-muted">No scheduled shows.</p>
			)}

			{/* Add New Showing Form */}
			<AddShowing
				movies={movies} // Available movies to schedule
				hall_uid={hall.uid} // Current hall UID
				date={date} // Selected date
				onCreated={onCreated} // Callback on successful creation
				existingShowings={schedule} // Pass current schedule for overlap detection
			/>
		</section>
	);
};

export default HallSchedule;
