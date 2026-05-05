import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line, Sphere, Torus, RoundedBox } from "@react-three/drei";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Download, Heart, Eye, Boxes } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

function AnimatedValue({ value, duration = 1400, suffix = "" }) {
	const [displayValue, setDisplayValue] = useState(0);

	useEffect(() => {
		let frameId;
		const start = performance.now();

		const tick = (now) => {
			const progress = Math.min((now - start) / duration, 1);
			setDisplayValue(Math.round(value * progress));
			if (progress < 1) {
				frameId = window.requestAnimationFrame(tick);
			}
		};

		frameId = window.requestAnimationFrame(tick);
		return () => window.cancelAnimationFrame(frameId);
	}, [duration, value]);

	return <span>{displayValue.toLocaleString()}{suffix}</span>;
}

function MiniLineChart() {
	const points = useMemo(
		() => [
			[-1.3, -0.55, 0],
			[-0.75, -0.2, 0],
			[-0.15, -0.3, 0],
			[0.35, 0.15, 0],
			[0.9, 0.1, 0],
			[1.35, 0.55, 0],
		],
		[]
	);

	return <Line points={points} color="#22d3ee" lineWidth={2} />;
}

function RotatingIconContent({ kind, ref }) {
	useFrame((state, delta) => {
		if (!ref.current) return;
		ref.current.rotation.x += delta * 0.25;
		ref.current.rotation.y += delta * 0.35;
		ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
	});

	if (kind === "chart") {
		return (
			<group ref={ref}>
				<MiniLineChart />
				<mesh position={[1.05, 0.45, 0]}>
					<octahedronGeometry args={[0.14, 0]} />
					<meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.4} />
				</mesh>
			</group>
		);
	}

	if (kind === "heart") {
		return (
			<Float speed={1.4} rotationIntensity={0.7} floatIntensity={0.8}>
				<mesh ref={ref}>
					<torusKnotGeometry args={[0.45, 0.16, 120, 18]} />
					<meshStandardMaterial color="#fb7185" emissive="#f43f5e" emissiveIntensity={0.45} roughness={0.18} metalness={0.55} />
				</mesh>
			</Float>
		);
	}

	if (kind === "download") {
		return (
			<Float speed={1.2} rotationIntensity={0.6} floatIntensity={0.8}>
				<group ref={ref}>
					<mesh position={[0, 0.18, 0]}>
						<boxGeometry args={[0.58, 0.58, 0.58]} />
						<meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.22} roughness={0.22} metalness={0.7} />
					</mesh>
					<mesh position={[0, -0.45, 0]}>
						<coneGeometry args={[0.18, 0.52, 16]} />
						<meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.25} />
					</mesh>
				</group>
			</Float>
		);
	}

	return (
		<Float speed={1.1} rotationIntensity={0.8} floatIntensity={0.9}>
			<mesh ref={ref}>
				<icosahedronGeometry args={[0.7, 0]} />
				<meshStandardMaterial color="#a855f7" emissive="#60a5fa" emissiveIntensity={0.3} roughness={0.24} metalness={0.65} />
			</mesh>
		</Float>
	);
}

function ThreeIcon({ kind }) {
	const ref = useRef();

	return <RotatingIconContent kind={kind} ref={ref} />;
}

function StatIconCanvas({ kind }) {
	return (
		<Canvas camera={{ position: [0, 0, 3.1], fov: 45 }} gl={{ alpha: true, antialias: true }}>
			<ambientLight intensity={0.9} color="#c084fc" />
			<pointLight position={[2, 2, 2]} intensity={1.5} color="#22d3ee" />
			<ThreeIcon kind={kind} />
		</Canvas>
	);
}

const stats = [
	{
		label: "Total Models uploaded",
		value: 248,
		delta: "+12.4%",
		direction: "up",
		tone: "from-blue-500/20 to-cyan-400/10",
		kind: "chart",
		help: "Uploads this month are trending upward.",
	},
	{
		label: "Total Views count",
		value: 125480,
		delta: "+8.7%",
		direction: "up",
		tone: "from-purple-500/20 to-blue-500/10",
		kind: "views",
		help: "Your audience keeps expanding.",
	},
	{
		label: "Total Likes received",
		value: 8740,
		delta: "+4.9%",
		direction: "up",
		tone: "from-pink-500/20 to-purple-500/10",
		kind: "heart",
		help: "Community engagement is healthy.",
	},
	{
		label: "Total Downloads",
		value: 16290,
		delta: "-1.2%",
		direction: "down",
		tone: "from-cyan-400/20 to-emerald-400/10",
		kind: "download",
		help: "Track export performance and optimize packages.",
	},
];

function StatCard({ stat, index }) {
	const DirectionIcon = stat.direction === "up" ? ArrowUpRight : ArrowDownRight;

	return (
		<motion.article
			initial={{ opacity: 0, y: 26 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.3 }}
			transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
			whileHover={{ y: -10 }}
			className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/6 p-[1px] shadow-2xl shadow-black/20 backdrop-blur-deep"
		>
			<div className={`absolute inset-0 bg-gradient-to-br ${stat.tone} opacity-70`} />
			<div className="relative h-full rounded-[calc(2rem-1px)] border border-white/10 bg-slate-950/75 p-5 text-white transition-shadow group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:p-6">
				<div className="flex items-start justify-between gap-4">
					<div>
						<p className="text-sm uppercase tracking-[0.28em] text-slate-300/80">{stat.label}</p>
						<h3 className="mt-3 text-3xl font-semibold text-white">
							{stat.kind === "views" ? <AnimatedValue value={stat.value} /> : <AnimatedValue value={stat.value} />}
						</h3>
					</div>
					<div className={`rounded-2xl border border-white/10 bg-white/5 p-2 ${stat.kind === "heart" ? "animate-pulse" : ""}`}>
						{stat.kind === "heart" ? <Heart className="h-5 w-5 text-pink-400" fill="currentColor" /> : null}
						{stat.kind === "download" ? <Download className="h-5 w-5 text-cyan-300" /> : null}
						{stat.kind === "views" ? <Eye className="h-5 w-5 text-purple-300" /> : null}
						{stat.kind === "chart" ? <Boxes className="h-5 w-5 text-cyan-300" /> : null}
					</div>
				</div>

				<div className="mt-4 flex items-center justify-between gap-3">
					<span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${stat.direction === "up" ? "bg-emerald-400/10 text-emerald-300" : "bg-rose-400/10 text-rose-300"}`}>
						<DirectionIcon className="h-3.5 w-3.5" />
						{stat.delta}
					</span>
					<p className="text-xs text-slate-400">vs last period</p>
				</div>

				<div className="mt-5 h-24 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/55 p-2">
					<StatIconCanvas kind={stat.kind} />
				</div>

				<p className="mt-4 text-sm leading-6 text-slate-300">{stat.help}</p>
			</div>
		</motion.article>
	);
}

export default function DashboardStats() {
	return (
		<motion.section
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
		>
			{stats.map((stat, index) => (
				<StatCard key={stat.label} stat={stat} index={index} />
			))}
		</motion.section>
	);
}

