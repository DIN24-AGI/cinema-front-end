export interface Cinema {
	uid: string;
	city_uid: string;
	city_name: string;
	name: string;
	address: string;
	phone: string;
	active: boolean;
}

export interface City {
	uid: string;
	name: string;
}

export interface Hall {
	uid: string;
	cinema_uid: string;
	name: string;
	rows: number;
	cols: number;
	seats: number;
	active?: boolean;
	created_at?: string;
	updated_at?: string;
}

export interface Movie {
	uid: string;
	title: string;
	duration_minutes: number;
	description: string;
	poster_url: string;
	release_year: number;
	shows_allowed: number;
	shows_left: number;
	active: boolean;
}

export type MovieItem = {
	uid: string;
	title: string;
	duration_minutes: number;
	description: string;
	poster_url: string;
	release_year: number;
	shows_allowed: number;
	shows_left: number;
	active: boolean;
};

export interface ShowTime {
	id: string;
	movieTitle: string;
	startTime: string; // ISO string or HH:mm
	endTime?: string; // optional
}
