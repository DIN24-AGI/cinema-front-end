import { useState } from "react";
import AppRoutes from "./routes/AppRoutes";

function App() {
	const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

	return <AppRoutes token={token} setToken={setToken} />;
}

export default App;
