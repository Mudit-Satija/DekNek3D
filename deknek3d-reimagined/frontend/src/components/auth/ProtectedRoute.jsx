import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
	const location = useLocation();
	let token = null;

	try {
		const raw = localStorage.getItem("auth");
		if (raw) {
			const parsed = JSON.parse(raw);
			token = parsed?.token || null;
		}
	} catch (_error) {
		token = null;
	}

	if (!token) {
		return <Navigate to="/signup" replace state={{ from: location.pathname }} />;
	}

	return children;
}
