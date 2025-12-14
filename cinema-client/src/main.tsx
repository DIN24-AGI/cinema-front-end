import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap FIRST
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./index.css"; // Then your overrides
import "./i18n/config";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>
);
