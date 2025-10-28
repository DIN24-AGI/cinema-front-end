import MovieList from "./pages/MovieList";

function App() {
	return (
		<div className="container-fluid d-flex justify-content-center">
			<div className="w-100" style={{ maxWidth: "1200px" }}>
				<MovieList />
			</div>
		</div>
	);
}

export default App;
