import DashboardLayout from "../components/layout/DashboardLayout";
import ProfileHeader from "../components/profile/ProfileHeader";
import AnimatedProfileTabs from "../components/profile/AnimatedProfileTabs";

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

export function ProfileContent() {
	return (
		<div className="space-y-6">
			<ProfileHeader profile={profileData} isOwner />
			<AnimatedProfileTabs />
		</div>
	);
}

export default function Profile() {
	return (
		<DashboardLayout>
			<ProfileContent />
		</DashboardLayout>
	);
}

