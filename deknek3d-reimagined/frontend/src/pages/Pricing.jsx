import { Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const tiers = [
	{
		name: "Starter",
		price: "Rs 99",
		period: "1 month",
		description: "For creators getting comfortable with 3D publishing.",
		features: ["Unlimited downloads", "Unlimited creations", "Basic support"],
		accent: "from-blue-500 via-cyan-400 to-purple-500",
	},
	{
		name: "Pro",
		price: "Rs 249",
		period: "6 months",
		description: "For serious builders who need speed and collaboration.",
		features: ["Unlimited downloads", "Unlimited creations", "Priority support", "Team workspaces"],
		accent: "from-purple-500 via-blue-500 to-cyan-400",
		popular: true,
	},
	{
		name: "Studio",
		price: "Rs 499",
		period: "1 year",
		description: "For studios shipping polished 3D experiences at scale.",
		features: ["Unlimited downloads", "Unlimited creations", "Dedicated support", "Team controls"],
		accent: "from-cyan-400 via-blue-500 to-purple-500",
	},
];

function PricingCard({ tier, index }) {
	return (
		<motion.article
			initial={{ opacity: 0, y: 28 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.3 }}
			transition={{ duration: 0.55, delay: index * 0.12, ease: "easeOut" }}
			whileHover={{ y: -10, rotateX: 3, rotateY: -3, scale: 1.01 }}
			style={{ transformPerspective: 1200 }}
			className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/6 p-[1px] shadow-2xl shadow-slate-950/30 backdrop-blur-deep"
		>
			<div className={`pricing-shimmer absolute inset-0 bg-gradient-to-r ${tier.accent} opacity-80`} />
			<div className="relative h-full rounded-[calc(2rem-1px)] border border-white/10 bg-slate-950/75 p-7 text-white backdrop-blur-glass">
				{tier.popular ? (
					<div className="mb-6 flex items-center justify-between">
						<span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200 animate-pulse">
							<Sparkles className="h-3.5 w-3.5" /> Popular
						</span>
					</div>
				) : null}

				<div className="space-y-4">
					<div>
						<p className="text-sm uppercase tracking-[0.35em] text-slate-300/70">{tier.name}</p>
						<h3 className="mt-3 text-4xl font-semibold text-white">{tier.price}<span className="text-base font-normal text-slate-300">/{tier.period}</span></h3>
					</div>
					<p className="text-sm leading-6 text-slate-300">{tier.description}</p>

					<ul className="space-y-3 pt-2">
						{tier.features.map((feature) => (
							<li key={feature} className="flex items-start gap-3 text-sm text-slate-200">
								<span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-cyan-300">
									<Check className="h-3.5 w-3.5" />
								</span>
								<span>{feature}</span>
							</li>
						))}
					</ul>

					<button
						type="button"
						className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition duration-200 hover:shadow-[0_0_30px_rgba(34,211,238,0.35)]"
					>
						Get Started
					</button>
				</div>
			</div>
		</motion.article>
	);
}

export default function Pricing() {
	return (
		<section className="relative overflow-hidden bg-slate-950 px-6 py-20 text-white">
			<div className="pricing-bg-pattern absolute inset-0 opacity-60" />
			<div className="relative mx-auto max-w-7xl">
				<motion.div
					initial={{ opacity: 0, y: 18 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.4 }}
					transition={{ duration: 0.5 }}
					className="mx-auto mb-12 max-w-3xl text-center"
				>
					<p className="text-sm uppercase tracking-[0.35em] text-cyan-300/75">Pricing</p>
					<h2 className="mt-3 font-display text-4xl font-semibold md:text-6xl">
						Choose the plan that fits your build.
					</h2>
					<p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
						Flexible pricing for solo creators, fast-growing teams, and studios shipping 3D experiences at scale.
					</p>
				</motion.div>

				<div className="grid gap-6 lg:grid-cols-3">
					{tiers.map((tier, index) => (
						<PricingCard key={tier.name} tier={tier} index={index} />
					))}
				</div>
			</div>
		</section>
	);
}

