import React from "react";
import type { Hall } from "../types/cinemaTypes";
import type { ShowTime, Movie } from "../types/cinemaTypes";
import AddMovie from "./AddMovie";

interface HallScheduleProps {
	hall: Hall;
	movies?: Movie[];
	schedule?: ShowTime[]; // Pass schedule separately since Hall from cinemaTypes doesn't include it
}

const HallSchedule: React.FC<HallScheduleProps> = ({ hall, schedule = [] }) => {
	return (
		<section aria-label={`Schedule for hall ${hall.name}`}>
			<header>
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
				<ul>
					{schedule.map((show) => (
						<li key={show.id}>
							<strong>{show.movieTitle}</strong>{" "}
							<span>
								{formatTime(show.startTime)}
								{show.endTime ? ` - ${formatTime(show.endTime)}` : ""}
							</span>
						</li>
					))}
				</ul>
			) : (
				<p>No scheduled shows.</p>
			)}
			<AddMovie onAdd={() => console.log("Movie Added")} />
		</section>
	);
};

function formatTime(value: string): string {
	// Accepts ISO or "HH:mm" and returns a short, locale-aware time string
	const isISO = /\d{4}-\d{2}-\d{2}T/.test(value);
	const date = isISO ? new Date(value) : parseHM(value);
	return isNaN(date.getTime()) ? value : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function parseHM(hm: string): Date {
	const [h, m] = hm.split(":").map(Number);
	const d = new Date();
	d.setHours(h || 0, m || 0, 0, 0);
	return d;
}

export default HallSchedule;
