import React from "react";
import type { Hall, Showing, Movie } from "../types/cinemaTypes";
import AddMovie from "./AddMovie";
import ShowingView from "./ShowingView";

interface HallScheduleProps {
	hall: Hall;
	movies?: Movie[];
	date: string;
	schedule?: Showing[];
	onCreated?: (show: Showing) => void;
	onDeleted?: (uid: string) => void;
}

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
			<header className="mb-3">
				<h2>{hall.name}</h2>
				<small>
					Capacity: {hall.seats} seats ({hall.rows} rows × {hall.cols} cols)
				</small>
				{hall.active !== undefined && (
					<span className={`ms-2 badge ${hall.active ? "bg-success" : "bg-secondary"}`}>
						{hall.active ? "Active" : "Inactive"}
					</span>
				)}
			</header>

			{schedule?.length ? (
				<div className="d-flex flex-column gap-2 mb-3">
					{schedule.map((show) => {
						const movie = movies.find((m) => m.uid === show.movie_uid);
						const movieTitle = movie?.title || "Unknown Movie";

						return (
							<ShowingView
								key={show.uid}
								id={show.uid}
								movieTitle={movieTitle}
								startTime={show.starts_at}
								endTime={show.ends_at}
								onDeleted={onDeleted}
							/>
						);
					})}
				</div>
			) : (
				<p className="text-muted">No scheduled shows.</p>
			)}

			<AddMovie movies={movies} hall_uid={hall.uid} date={date} onCreated={onCreated} />
		</section>
	);
};

export default HallSchedule;
