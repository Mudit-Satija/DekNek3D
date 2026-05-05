import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AppearanceProvider } from "./context/AppearanceContext";
import AuthProvider from "./context/AuthContext";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<AppearanceProvider>
			<AuthProvider>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</AuthProvider>
		</AppearanceProvider>
	</React.StrictMode>
);
