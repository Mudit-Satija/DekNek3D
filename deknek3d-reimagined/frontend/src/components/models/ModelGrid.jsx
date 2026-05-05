import { useMemo, useRef } from "react";
import ModelCardCarousel from "./ModelCard";

const defaultModels = [
	{
		id: "aurora-chair",
		title: "Aurora Chair",
		creator: "Mina Atelier",
		likes: 12400,
		modelUrl: "/models/sample.glb",
		accent: "#22d3ee",
	},
	{
		id: "orbital-drone",
		title: "Orbital Drone",
		creator: "Nova Forge",
		likes: 8720,
		modelUrl: "/models/demo.gltf",
		accent: "#a855f7",
	},
	{
		id: "prism-sneaker",
		title: "Prism Sneaker",
		creator: "Studio Flux",
		likes: 15630,
		modelUrl: "/models/sample.glb",
		accent: "#3b82f6",
	},
	{
		id: "neo-watch",
		title: "Neo Watch",
		creator: "Arcade Lab",
		likes: 9400,
		modelUrl: "/models/demo.gltf",
		accent: "#22d3ee",
	},
];

export default function ModelGrid({ models = defaultModels }) {
	const scrollerRef = useRef(null);
	const preparedModels = useMemo(() => models, [models]);

	const scrollByAmount = (direction) => {
		if (!scrollerRef.current) return;
		scrollerRef.current.scrollBy({ left: direction * 420, behavior: "smooth" });
	};

	return (
		<ModelCardCarousel
			models={preparedModels}
			scrollerRef={scrollerRef}
			onScrollLeft={() => scrollByAmount(-1)}
			onScrollRight={() => scrollByAmount(1)}
		/>
	);
}

