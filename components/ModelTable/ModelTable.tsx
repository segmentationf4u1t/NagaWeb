// ModelTable.tsx
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface Pricing {
	per_input_token?: number;
	per_output_token?: number;
	per_image?: number;
	per_token?: number;
	per_second?: number;
	per_character?: number;
}

export interface TierData {
	[key: string]: string | number | undefined;
	free?: string;
	"tier-1"?: string;
	"tier-2"?: string;
	"tier-3"?: string;
}

export interface Model {
	id: string;
	modelType: string;
	pricing: Pricing | null;
	tiersData: TierData | null;
	points_to?: string;
}

interface ModelTableProps {
	data: Model[];
}

const ModelTable: React.FC<ModelTableProps> = ({ data }) => {
	const tableRef = useRef<HTMLDivElement>(null);
	const DECIMAL_PLACES = 8;
	const [searchTerm, setSearchTerm] = useState("");
	const [isSearching, setIsSearching] = useState(false);

	const filteredData = data.filter((model) =>
		model.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
		model.modelType.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
		setIsSearching(true);
	};

	// Add debounced search effect
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsSearching(false);
		}, 300);
		return () => clearTimeout(timer);
	}, []); // Remove searchTerm from dependencies

	const container = {
		hidden: { opacity: 1 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.05
			}
		}
	};

	const item = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: {
				type: "spring",
				stiffness: 100,
				damping: 12
			}
		},
		exit: {
			y: -20,
			opacity: 0,
			transition: {
				duration: 0.2
			}
		}
	};

	return (
		<div className="flex flex-col h-full">
			<motion.div 
				className="mb-4"
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
			>
				<div className="relative">
					<input
						type="text"
						placeholder="Search by ID or type..."
						value={searchTerm}
						onChange={handleSearchChange}
						className="w-full px-4 py-2 pl-10 rounded-lg border border-neutral-700 bg-neutral-900 text-neutral-200 
							focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300
							hover:border-neutral-600"
					/>
					<motion.div
						className="absolute left-3 top-2 -translate-y-1/2"
						animate={{
							scale: isSearching ? 1.1 : 1,
							rotate: isSearching ? 360 : 0
						}}
						transition={{ duration: 0.3 }}
					>
						🔍
					</motion.div>
					{searchTerm && (
						<motion.button
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
							onClick={() => setSearchTerm("")}
						>
							✕
						</motion.button>
					)}
				</div>
			</motion.div>

			<div ref={tableRef} className="flex-grow overflow-auto">
				<table className="w-full divide-y divide-neutral-200">
					<motion.thead 
						className="bg-muted/20 sticky top-0"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2 }}
					>
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
								ID
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
								Type
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
								Cost
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
								Free Limit
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
								Tier-1 Limit
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
								Tier-2 Limit
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
								Tier-3 Limit
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
								Tier-4 Limit
							</th>
						</tr>
					</motion.thead>
					<AnimatePresence mode="wait">
						<motion.tbody
							variants={container}
							initial="hidden"
							animate="visible"
							className="bg-neutral-950 divide-y divide-neutral-800"
						>
							{filteredData.map((model, index) => (
								<motion.tr 
									key={model.id}
									variants={item}
									layout
									className="group hover:bg-neutral-900 transition-colors duration-200"
									style={{
										originY: 0,
										backgroundColor: `rgba(23, 23, 23, ${index % 2 ? 0.3 : 0})`
									}}
								>
									<motion.td 
										className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-200"
										whileHover={{ scale: 1.02 }}
										transition={{ type: "spring", stiffness: 300 }}
									>
										{model.id}
									</motion.td>
									<motion.td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
										{model.modelType}
									</motion.td>
									<motion.td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
										{model.pricing ? (
											<div>
												{model.modelType.toLowerCase() === 'image' && model.pricing.per_image && (
													<div>Per Image: ${Number(model.pricing.per_image).toFixed(DECIMAL_PLACES)}</div>
												)}
												{(model.modelType.toLowerCase() === 'text' || model.modelType.toLowerCase() === 'multimodal') && (
													<>
														{model.pricing.per_input_token && (
															<div>Per Input Token: ${Number(model.pricing.per_input_token).toFixed(DECIMAL_PLACES)}</div>
														)}
														{model.pricing.per_output_token && (
															<div>Per Output Token: ${Number(model.pricing.per_output_token).toFixed(DECIMAL_PLACES)}</div>
														)}
													</>
												)}
												{model.modelType.toLowerCase() === 'embedding' && model.pricing.per_token && (
													<div>per token: ${Number(model.pricing.per_token).toFixed(DECIMAL_PLACES)}</div>
												)}
												{model.modelType.toLowerCase() === 'audio' && (
													<>
														{model.pricing.per_second && (
															<div>Per Second: ${Number(model.pricing.per_second).toFixed(DECIMAL_PLACES)}</div>
														)}
														{model.pricing.per_character && Number.isNaN(Number(model.pricing.per_character)) === false && (
															<div>Per Character: ${Number(model.pricing.per_character).toFixed(DECIMAL_PLACES)}</div>
														)}
													</>
												)}
											</div>
										) : (
											"N/A"
										)}
									</motion.td>
									<motion.td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
										{model.tiersData?.free || "N/A"}
									</motion.td>
									<motion.td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500 font-bold">
										{model.tiersData?.["tier-1"] || "N/A"}
									</motion.td>
									<motion.td className="px-6 py-4 whitespace-nowrap text-sm text-purple-500 font-bold">
										{model.tiersData?.["tier-2"] || "N/A"}
									</motion.td>
									<motion.td className="px-6 py-4 whitespace-nowrap text-sm text-rose-500 font-bold">
										{model.tiersData?.["tier-3"] || "N/A"}
									</motion.td>
									<motion.td className="px-6 py-4 whitespace-nowrap text-sm text-rose-600 font-bold">
										{model.tiersData?.["tier-4"] || "N/A"}
									</motion.td>
								</motion.tr>
							))}
						</motion.tbody>
					</AnimatePresence>
				</table>

				<AnimatePresence>
					{filteredData.length === 0 && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{ type: "spring", stiffness: 100 }}
							className="text-neutral-400 text-center py-8"
						>
							<motion.div
								animate={{ 
									scale: [1, 1.1, 1],
									rotate: [0, 5, -5, 0]
								}}
								transition={{ 
									duration: 0.5,
									repeat: Number.POSITIVE_INFINITY,
									repeatDelay: 2
								}}
								className="text-4xl mb-4"
							>
								🔍
							</motion.div>
							<span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
								No results found for "{searchTerm}"
							</span>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};

// Add keyframe animations for shimmer effect
const styles = `
@keyframes shimmer {
	0% {
		background-position: -1000px 0;
	}
	100% {
		background-position: 1000px 0;
	}
}

.animate-shimmer {
	animation: shimmer 2s infinite linear;
	background: linear-gradient(to right, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%);
	background-size: 1000px 100%;
}
`;

if (typeof document !== 'undefined') {
	const styleSheet = document.createElement('style');
	styleSheet.textContent = styles;
	document.head.appendChild(styleSheet);
}

export default ModelTable;
