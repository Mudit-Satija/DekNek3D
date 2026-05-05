import React, { Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, useGLTF } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";

function DefaultFallbackModel({ paused, accent = "#22d3ee" }) {
	const meshRef = useRef();

	useFrame((state, delta) => {
		if (!meshRef.current || paused) return;
		meshRef.current.rotation.y += delta * 0.65;
		meshRef.current.rotation.x += delta * 0.2;
	});

	return (
		<mesh ref={meshRef} scale={paused ? 1.02 : 1}>
			<icosahedronGeometry args={[1, 2]} />
			<meshStandardMaterial color={accent} wireframe roughness={0.35} metalness={0.45} />
		</mesh>
	);
}

function GltfModel({ url, paused, accent }) {
	const scene = useGLTF(url);
	const rootRef = useRef();

	useFrame((state, delta) => {
		if (!rootRef.current || paused) return;
		rootRef.current.rotation.y += delta * 0.45;
		rootRef.current.rotation.x += delta * 0.08;
	});

	const clone = useMemo(() => scene.scene.clone(true), [scene.scene]);

	return (
		<group ref={rootRef} scale={paused ? 1.08 : 1}>
			<primitive object={clone} />
			{accent ? <ambientLight intensity={0.45} color={accent} /> : null}
		</group>
	);
}

class ModelBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	render() {
		if (this.state.hasError) {
			return this.props.fallback;
		}

		return this.props.children;
	}
}

function ModelPreviewCanvas({ model, paused }) {
	return (
		<Canvas
			camera={{ position: [0, 0, 3.2], fov: 42 }}
			gl={{ antialias: true, alpha: true }}
			dpr={[1, 1.5]}
			className="h-full w-full"
		>
			<ambientLight intensity={0.85} color="#c084fc" />
			<pointLight position={[2.5, 2.5, 3]} intensity={1.8} color="#22d3ee" />
			<pointLight position={[-2.5, -1.8, 2]} intensity={1.2} color="#3b82f6" />
			<ModelBoundary fallback={<DefaultFallbackModel paused={paused} accent={model.accent} />}>
				<Suspense fallback={<DefaultFallbackModel paused={paused} accent={model.accent} />}>
					<GltfModel url={model.modelUrl} paused={paused} accent={model.accent} />
				</Suspense>
			</ModelBoundary>
			<Html center>
				<div className="pointer-events-none rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-200/70 backdrop-blur-md">
					3D Preview
				</div>
			</Html>
		</Canvas>
	);
}

const ModelCard = forwardRef(function ModelCard({ model }, ref) {
	const [paused, setPaused] = useState(false);
	const cardRef = useRef(null);

	useImperativeHandle(ref, () => ({
		get node() {
			return cardRef.current;
		},
	}));

	return (
		<motion.article
			ref={cardRef}
			initial={{ opacity: 0, y: 24 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.35 }}
			transition={{ duration: 0.55, ease: "easeOut" }}
			onMouseEnter={() => setPaused(true)}
			onMouseLeave={() => setPaused(false)}
			className="group min-w-[19rem] snap-center overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/6 shadow-2xl shadow-slate-950/30 backdrop-blur-deep"
		>
			<div className="relative h-72 border-b border-white/10 bg-slate-950/60 p-4">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_45%),radial-gradient(circle_at_bottom,rgba(168,85,247,0.14),transparent_50%)]" />
				<motion.div
					animate={{ scale: paused ? 1.04 : 1 }}
					transition={{ duration: 0.25, ease: "easeOut" }}
					className="relative z-10 h-full w-full"
				>
					<ModelPreviewCanvas model={model} paused={paused} />
				</motion.div>
			</div>

			<div className="space-y-3 px-5 py-5">
				<div>
					<h3 className="text-lg font-semibold text-white">{model.title}</h3>
					<p className="text-sm text-slate-300">by {model.creator}</p>
				</div>

				<div className="flex items-center gap-2 text-sm text-slate-200/85">
					<Heart className="h-4 w-4 text-pink-400" />
					<span>{model.likes.toLocaleString()} likes</span>
				</div>
			</div>
		</motion.article>
	);
});

export default function ModelCardCarousel({ models, scrollerRef, onScrollLeft, onScrollRight }) {
	return (
		<section className="rounded-[2rem] border border-white/10 bg-slate-950/30 p-5 shadow-2xl shadow-slate-950/30 backdrop-blur-deep md:p-6">
			<div className="mb-5 flex items-center justify-between gap-4">
				<div>
					<p className="text-sm uppercase tracking-[0.3em] text-cyan-300/75">Featured models</p>
					<h2 className="mt-2 text-2xl font-semibold text-white md:text-3xl">Explore what creators are building</h2>
				</div>

				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={onScrollLeft}
						className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
						aria-label="Scroll featured models left"
					>
						<ChevronLeft className="h-5 w-5" />
					</button>
					<button
						type="button"
						onClick={onScrollRight}
						className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
						aria-label="Scroll featured models right"
					>
						<ChevronRight className="h-5 w-5" />
					</button>
				</div>
			</div>

			<div
				ref={scrollerRef}
				className="scrollbar-none flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3 pt-1 [scroll-behavior:smooth]"
			>
				{models.map((model) => (
					<ModelCard key={model.id} model={model} />
				))}
			</div>
		</section>
	);
}

