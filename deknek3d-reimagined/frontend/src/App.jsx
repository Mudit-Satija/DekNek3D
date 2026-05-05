import { Link, Route, Routes } from "react-router-dom";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Hero from "./components/layout/Hero";
import Dashboard from "./pages/Dashboard";
import Pricing from "./pages/Pricing";
import Upload from "./pages/Upload";
import Viewer from "./pages/Viewer";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import About from "./pages/About";

function Home() {
	return (
		<div className="min-h-screen bg-slate-950 text-white">
			<Hero />
		</div>
	);
}

function PublicShell({ children }) {
	return <div className="min-h-screen bg-slate-950 text-white">{children}</div>;
}

function PublicNav() {
	return (
		<header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/85 backdrop-blur-deep">
			<nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-4">
				<Link className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-300/80" to="/">
					Deknek3D
				</Link>
				<div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
					<Link className="transition hover:text-white" to="/">
						Home
					</Link>
					<Link className="transition hover:text-white" to="/viewer">
						Viewer
					</Link>
					<Link className="transition hover:text-white" to="/about">
						About
					</Link>
					<Link className="transition hover:text-white" to="/pricing">
						Pricing
					</Link>
				</div>
			</nav>
		</header>
	);
}

export default function App() {
	return (
		<>
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
				<Route
					path="/dashboard"
					element={
						<ProtectedRoute>
							<Dashboard />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/dashboard/profile"
					element={
						<ProtectedRoute>
							<Dashboard dashboardPage="profile" />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/dashboard/settings"
					element={
						<ProtectedRoute>
							<Dashboard dashboardPage="settings" />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/dashboard/models"
					element={
						<ProtectedRoute>
							<Dashboard dashboardPage="models" />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/dashboard/upload"
					element={
						<ProtectedRoute>
							<Upload />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/"
					element={
						<PublicShell>
							<PublicNav />
							<Home />
						</PublicShell>
					}
				/>
				<Route
					path="/upload"
					element={
						<ProtectedRoute>
							<Upload />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/viewer"
					element={
						<PublicShell>
							<PublicNav />
							<Viewer />
						</PublicShell>
					}
				/>
				<Route
					path="/profile"
					element={
						<ProtectedRoute>
							<Profile />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/settings"
					element={
						<ProtectedRoute>
							<Settings />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/pricing"
					element={
						<PublicShell>
							<PublicNav />
							<Pricing />
						</PublicShell>
					}
				/>
				<Route
					path="/about"
					element={
						<PublicShell>
							<PublicNav />
							<About />
						</PublicShell>
					}
				/>
			</Routes>
		</>
	);
}
