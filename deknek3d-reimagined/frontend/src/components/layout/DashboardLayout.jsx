import { motion, AnimatePresence } from "framer-motion";
import {
	Bell,
	ChevronDown,
	LayoutDashboard,
	Menu,
	PanelLeftClose,
	PanelLeftOpen,
	Settings,
	SquareArrowOutUpRight,
	Upload,
	UserRound,
	X,
	Boxes,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const navigationItems = [
	{ label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
	{ label: "My Models", icon: Boxes, to: "/dashboard/models" },
	{ label: "Upload", icon: Upload, to: "/dashboard/upload" },
	{ label: "Profile", icon: UserRound, to: "/dashboard/profile" },
	{ label: "Settings", icon: Settings, to: "/dashboard/settings" },
];

function Sidebar({ isOpen, onClose }) {
	return (
		<motion.aside
			initial={{ x: -280, opacity: 0 }}
			animate={{ x: 0, opacity: 1 }}
			transition={{ type: "spring", stiffness: 120, damping: 18 }}
			className={`fixed left-0 top-0 z-40 flex h-screen w-72 flex-col border-r border-white/10 bg-slate-950/80 px-4 py-5 text-white backdrop-blur-deep transition-transform duration-300 ${
				isOpen ? "translate-x-0" : "-translate-x-full"
			}`}
		>
			<button
				type="button"
				onClick={onClose}
				className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10 lg:hidden"
				aria-label="Close menu"
			>
				<X className="h-4 w-4" />
			</button>

			<div className="mb-8 flex items-center gap-3 px-2">
				<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-400 shadow-lg shadow-blue-950/30">
					<SquareArrowOutUpRight className="h-5 w-5" />
				</div>
				<div>
					<p className="text-xs uppercase tracking-[0.32em] text-cyan-300/75">Deknek3D</p>
					<p className="text-sm text-slate-300">Workspace</p>
				</div>
			</div>

			<nav className="space-y-2">
				{navigationItems.map((item) => {
					const Icon = item.icon;
					return (
						<NavLink
							key={item.label}
							to={item.to}
							end={item.to === "/dashboard"}
							className={({ isActive }) =>
								`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
									isActive
										? "bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
										: "text-slate-300 hover:bg-white/8 hover:text-white"
								}`
							}
						>
							<Icon className="h-4 w-4 text-cyan-300" />
							<span>{item.label}</span>
						</NavLink>
					);
				})}
			</nav>

			<div className="mt-auto rounded-3xl border border-white/10 bg-gradient-to-br from-white/8 to-white/5 p-4 backdrop-blur-glass">
				<p className="text-xs uppercase tracking-[0.28em] text-slate-400">Studio status</p>
				<p className="mt-2 text-sm text-white">All systems ready for publishing.</p>
				<div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
					<div className="h-full w-3/4 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400" />
				</div>
			</div>
		</motion.aside>
	);
}

function TopNavbar({ isSidebarOpen, onToggleSidebar }) {
	const [open, setOpen] = useState(false);
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate("/");
	};

	return (
		<div className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-white/10 bg-slate-950/75 px-4 py-4 backdrop-blur-deep sm:px-6">
			<div className="flex items-center gap-3 lg:pl-0">
				<button
					type="button"
					onClick={onToggleSidebar}
					className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10 lg:hidden"
					aria-label="Open menu"
				>
					<Menu className="h-5 w-5" />
				</button>
				<button
					type="button"
					onClick={onToggleSidebar}
					className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10 lg:inline-flex"
					aria-label={isSidebarOpen ? "Hide side panel" : "Show side panel"}
				>
					{isSidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
				</button>
				<div>
					<p className="text-xs uppercase tracking-[0.3em] text-cyan-300/75">Dashboard</p>
					<h1 className="text-lg font-semibold text-white">Creative control center</h1>
				</div>
			</div>

			<div className="flex flex-1 items-center justify-end gap-3">
				<div className="hidden w-full max-w-md items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 md:flex">
					<input
						type="search"
						placeholder="Search models, creators, or settings"
						className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
					/>
				</div>
				<button
					type="button"
					className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
					aria-label="Notifications"
				>
					<Bell className="h-5 w-5" />
					<span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-pink-500 shadow-[0_0_14px_rgba(236,72,153,0.8)]" />
				</button>

				<div className="relative">
					<button
						type="button"
						onClick={() => setOpen((current) => !current)}
						className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-2 py-1.5 text-left text-white transition hover:bg-white/10"
					>
						<div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-400 text-sm font-semibold text-white">
							{user?.name ? user.name.split(" ").map(n => n[0]).slice(0,2).join("").toUpperCase() : "JD"}
						</div>
						<div className="hidden pr-1 sm:block">
							<p className="text-sm font-medium leading-none text-white">{user?.name || "Jordan Doe"}</p>
							<p className="text-xs text-slate-400">{user?.role || "Studio owner"}</p>
						</div>
						<ChevronDown className="hidden h-4 w-4 text-slate-300 sm:block" />
					</button>

					<AnimatePresence>
						{open ? (
							<motion.div
								initial={{ opacity: 0, y: 10, scale: 0.96 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								exit={{ opacity: 0, y: 10, scale: 0.96 }}
								transition={{ duration: 0.18 }}
								className="absolute right-0 mt-3 w-52 rounded-2xl border border-white/10 bg-slate-950/90 p-2 shadow-2xl shadow-black/40 backdrop-blur-deep"
							>
								<Link to="/login" className="block rounded-xl px-3 py-2 text-sm text-slate-200 transition hover:bg-white/8">Switch account</Link>
								<Link to="/profile" className="block rounded-xl px-3 py-2 text-sm text-slate-200 transition hover:bg-white/8">View profile</Link>
								<Link to="/settings" className="block rounded-xl px-3 py-2 text-sm text-slate-200 transition hover:bg-white/8">Account settings</Link>
								<button onClick={handleLogout} className="w-full text-left rounded-xl px-3 py-2 text-sm text-slate-200 transition hover:bg-white/8">Sign out</button>
							</motion.div>
						) : null}
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
}

export default function DashboardLayout({ children }) {
	const location = useLocation();
	const content = children ?? <Outlet />;
	const title = useMemo(() => location.pathname.split("/").filter(Boolean).slice(-1)[0] ?? "dashboard", [location.pathname]);
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	return (
		<div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(59,130,246,0.14),transparent_0_24%),radial-gradient(circle_at_78%_16%,rgba(168,85,247,0.14),transparent_0_24%),radial-gradient(circle_at_50%_86%,rgba(34,211,238,0.09),transparent_0_24%)]" />

			<AnimatePresence>
				{isSidebarOpen ? (
					<motion.button
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setIsSidebarOpen(false)}
						className="fixed inset-0 z-30 bg-slate-950/60 lg:hidden"
						aria-label="Close sidebar overlay"
					/>
				) : null}
			</AnimatePresence>

			<Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

			<div className={`relative z-10 min-h-screen transition-[padding] duration-300 ${isSidebarOpen ? "lg:pl-72" : "lg:pl-0"}`}>
				<TopNavbar isSidebarOpen={isSidebarOpen} onToggleSidebar={() => setIsSidebarOpen((current) => !current)} />
				<motion.main
					key={title}
					initial={{ opacity: 0, y: 18 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.35, ease: "easeOut" }}
					className="p-4 sm:p-6"
				>
					<div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/20 backdrop-blur-glass sm:p-6">
						{content}
					</div>
				</motion.main>
			</div>
		</div>
	);
}
