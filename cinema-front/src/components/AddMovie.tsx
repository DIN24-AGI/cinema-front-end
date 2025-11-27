import React, { useState } from "react";

type AddMovieProps = {
	onAdd?: (movie: { title: string; time: string }) => void;
	options?: string[];
};

const AddMovie: React.FC<AddMovieProps> = ({ onAdd, options = ["Inception", "Interstellar", "The Dark Knight"] }) => {
	const [title, setTitle] = useState(options[0] ?? "");
	const [time, setTime] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!title || !time) return;
		onAdd?.({ title, time });
	};

	return (
		<div className="container my-3">
			<form className="d-flex align-items-center gap-2" onSubmit={handleSubmit}>
				<select
					className="form-select w-auto"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					aria-label="Select movie"
				>
					{options.map((opt) => (
						<option key={opt} value={opt}>
							{opt}
						</option>
					))}
				</select>

				<input
					type="time"
					className="form-control w-auto"
					value={time}
					onChange={(e) => setTime(e.target.value)}
					aria-label="Select time"
				/>

				<button type="submit" className="btn btn-primary">
					Add
				</button>
			</form>
		</div>
	);
};

export default AddMovie;
