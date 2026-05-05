import Hero from "../components/layout/Hero";
import FeaturesSection from "../components/3d/FeaturesSection";
import ModelGrid from "../components/models/ModelGrid";

export default function Home() {
	return (
		<div className="space-y-20 bg-slate-950">
			<Hero />
			<FeaturesSection />
			<section id="gallery" className="mx-auto max-w-7xl px-6 pb-20">
				<ModelGrid />
			</section>
		</div>
	);
}

