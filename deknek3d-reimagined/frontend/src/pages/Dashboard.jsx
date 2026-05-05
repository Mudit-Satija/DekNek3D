import { motion } from "framer-motion";
import { LayoutDashboard, Boxes, Upload, UserRound, Settings } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import DashboardStats from "../components/dashboard/DashboardStats";
import Timeline from "../components/dashboard/TimelineSafe";
import ProfileHeader from "../components/profile/ProfileHeader";
import AnimatedProfileTabs from "../components/profile/AnimatedProfileTabs";
import { SettingsContent } from "./Settings";
import ModelGridInfinite from "../components/gallery/ModelGridInfinite";

const quickActions = [
	{ label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
	{ label: "My Models", icon: Boxes, to: "/dashboard/models" },
	{ label: "Upload", icon: Upload, to: "/dashboard/upload" },
	{ label: "Profile", icon: UserRound, to: "/dashboard/profile" },
	{ label: "Settings", icon: Settings, to: "/dashboard/settings" },
];

const profileData = {
	coverUrl:
		"https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1600&q=80",
	username: "Jordan Doe",
	verified: true,
	bio: "Building high-end 3D assets, immersive product previews, and fast-moving creative pipelines for the marketplace.",
	social: [
		{ name: "portfolio", url: "#" },
		{ name: "instagram", url: "#" },
		{ name: "x", url: "#" },
	],
	stats: { followers: 18420, following: 321, models: 68, likes: 49210 },
	achievements: ["Early Adopter", "Top Creator", "Verified Seller"],
};

function DashboardPage() {
	return (
		<div className="space-y-6">
			<DashboardStats />

			<div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
				<Timeline />

				<motion.aside
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.35, delay: 0.08 }}
					className="rounded-3xl border border-white/10 bg-slate-950/40 p-5"
				>
					<h2 className="text-xl font-semibold text-white">Quick actions</h2>
					<div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
						{quickActions.map((item) => {
							const Icon = item.icon;
							return (
								<Link
									key={item.label}
									to={item.to}
									className="flex min-h-20 flex-col items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left text-sm text-slate-200 transition hover:bg-white/10"
								>
									<Icon className="h-4 w-4 text-cyan-300" />
									<span>{item.label}</span>
								</Link>
							);
						})}
					</div>
				</motion.aside>
			</div>
		</div>
	);
}

function ModelsPage() {
	return (
		<div className="space-y-6">
			<div className="rounded-3xl border border-white/10 bg-slate-950/40 p-6">
				<h2 className="text-2xl font-semibold text-white">My Models</h2>
				<p className="mt-2 text-sm text-slate-300">Manage your uploaded assets, update metadata, and track performance.</p>
			</div>
			<div className="rounded-3xl border border-white/10 bg-slate-950/40 p-6">
				<ModelGridInfinite />
			</div>
		</div>
	);
}

function ProfilePage() {
	return (
		<div className="space-y-6">
			<ProfileHeader profile={profileData} isOwner />
			<AnimatedProfileTabs />
		</div>
	);
}

export default function Dashboard({ dashboardPage = null }) {
	let content = <DashboardPage />;

	if (dashboardPage === "profile") {
		content = <ProfilePage />;
	} else if (dashboardPage === "settings") {
		content = <SettingsContent />;
	} else if (dashboardPage === "models") {
		content = <ModelsPage />;
	}

	return <DashboardLayout>{content}</DashboardLayout>;
}
