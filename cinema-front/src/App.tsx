import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Movie from "./components/Movie";
import MovieList from "./pages/MovieList";

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<MovieList />
		</>
	);
}

export default App;
