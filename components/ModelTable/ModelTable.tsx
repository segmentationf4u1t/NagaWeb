// ModelTable.tsx
import React, {
	useRef,
	useState,
	useEffect,
	useMemo,
	useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { getAdditionalInfo } from "@/lib/api/modelsApi";

// Interfaces
export interface Pricing {
	per_input_token?: number;
	per_output_token?: number;
	per_image?: number;
	per_token?: number;
	per_second?: number;
	per_character?: number;
}

export interface TierData {
	free?: string;
	"tier-1"?: string;
	"tier-2"?: string;
	"tier-3"?: string;
	"tier-4"?: string;
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

// Helper Functions
const formatTokenPrice = (price?: number) => {
	if (price === undefined || price === null) return "N/A";
	// Convert price to per million tokens
	const pricePerMillion = price * 1_000_000;
	return `$${pricePerMillion.toFixed(2)}`;
};

// Separate Table Row Component for Memoization
const ModelTableRow: React.FC<{ model: Model; index: number }> = React.memo(
	({ model, index }) => {
		const DECIMAL_PLACES = 8;
		const additionalInfo = getAdditionalInfo(model.id);

		return (
			<motion.tr
				key={model.id}
				initial="hidden"
				animate="visible"
				exit="exit"
				variants={{
					hidden: { opacity: 0, y: -20 },
					visible: { opacity: 1, y: 0 },
					exit: { opacity: 0, y: -20 },
				}}
				transition={{ type: "spring", stiffness: 100, damping: 12 }}
				className="group hover:bg-neutral-900 transition-colors duration-200"
				style={{
					backgroundColor: `rgba(23, 23, 23, ${index % 2 ? 0.3 : 0})`,
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
					{additionalInfo.type}
				</motion.td>
				<motion.td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
					{model.pricing ? (
						<div>
							{additionalInfo.type === "Image" && model.pricing.per_image && (
								<div>
									Per Image: ${model.pricing.per_image.toFixed(DECIMAL_PLACES)}
								</div>
							)}
							{["Text", "Multimodal"].includes(additionalInfo.type) && (
								<>
									{model.pricing.per_input_token && (
										<div>
											Input tokens:{" "}
											{formatTokenPrice(model.pricing.per_input_token)}
										</div>
									)}
									{model.pricing.per_output_token && (
										<div>
											Output tokens:{" "}
											{formatTokenPrice(model.pricing.per_output_token)}
										</div>
									)}
								</>
							)}
							{additionalInfo.type === "Embedding" &&
								model.pricing.per_token && (
									<div>
										Per 1M Tokens: $
										{(model.pricing.per_token * 1_000_000).toFixed(
											DECIMAL_PLACES,
										)}
									</div>
								)}
							{additionalInfo.type === "Audio" && (
								<>
									{model.pricing.per_second && (
										<div>
											Per Second: $
											{model.pricing.per_second.toFixed(DECIMAL_PLACES)}
										</div>
									)}
									{model.pricing.per_character &&
										!Number.isNaN(model.pricing.per_character) && (
											<div>
												Per Character: $
												{model.pricing.per_character.toFixed(DECIMAL_PLACES)}
											</div>
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
				<motion.td className="px-6 py-4 whitespace-nowrap text-sm bg-gradient-to-r from-rose-500 to-purple-500 bg-clip-text text-transparent font-bold">
					{model.tiersData?.["tier-4"] || "N/A"}
				</motion.td>
			</motion.tr>
		);
	},
);

const ModelTable: React.FC<ModelTableProps> = ({ data }) => {
	const tableRef = useRef<HTMLDivElement>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [isSearching, setIsSearching] = useState(false);

	// Debounce search input
	useEffect(() => {
		if (searchTerm.trim() === "") {
			setIsSearching(false);
			return;
		}
		setIsSearching(true);
		const timer = setTimeout(() => {
			setIsSearching(false);
		}, 300);
		return () => clearTimeout(timer);
	}, [searchTerm]);

	// Memoized filtered data to prevent unnecessary computations
	const filteredData = useMemo(() => {
		const lowercasedTerm = searchTerm.toLowerCase();
		return data.filter(
			(model) =>
				model.id.toLowerCase().includes(lowercasedTerm) ||
				model.modelType.toLowerCase().includes(lowercasedTerm),
		);
	}, [data, searchTerm]);

	const handleSearchChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setSearchTerm(e.target.value);
		},
		[],
	);

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 1 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.05,
			},
		},
	};

	// Shimmer Effect Styles
	const shimmerStyles = `
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

	// Inject Styles inside the component
	useEffect(() => {
		if (typeof document !== "undefined") {
			const styleId = "model-table-shimmer-styles";
			// Prevent multiple injections
			if (!document.getElementById(styleId)) {
				const styleSheet = document.createElement("style");
				styleSheet.id = styleId;
				styleSheet.textContent = shimmerStyles;
				document.head.appendChild(styleSheet);
			}
			// Cleanup is optional here since styles are usually static
		}
	}, []);

	return (
		<div className="flex flex-col h-full">
			<motion.div
				className="mb-4"
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
			>
				<div className="relative flex items-center">
					<motion.div
						className="absolute left-3"
						animate={{
							scale: isSearching ? 1.1 : 1,
							rotate: isSearching ? 360 : 0,
						}}
						transition={{ duration: 0.3 }}
					>
						<Search
							className="text-neutral-400 w-4 h-4 sm:w-5 sm:h-5"
							aria-hidden="true"
						/>
					</motion.div>
					<input
						type="text"
						placeholder="Search by ID or type..."
						value={searchTerm}
						onChange={handleSearchChange}
						className="w-full px-4 py-2 pl-9 sm:pl-10 rounded-lg border border-neutral-700 bg-neutral-900 text-neutral-200 
							focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300
							hover:border-neutral-600 text-sm sm:text-base"
					/>
					<AnimatePresence>
						{searchTerm && (
							<motion.button
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.8 }}
								className="absolute right-3 text-neutral-400 hover:text-neutral-200 w-4 h-4 sm:w-5 sm:h-5"
								onClick={() => setSearchTerm("")}
								aria-label="Clear search"
							>
								✕
							</motion.button>
						)}
					</AnimatePresence>
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
								Cost per 1M tokens
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
							variants={containerVariants}
							initial="hidden"
							animate="visible"
							exit="hidden"
							className="bg-neutral-950 divide-y divide-neutral-800"
						>
							{filteredData.map((model, index) => (
								<ModelTableRow key={model.id} model={model} index={index} />
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
								animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
								transition={{
									duration: 0.5,
									repeat: Number.POSITIVE_INFINITY,
									repeatDelay: 2,
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

export default React.memo(ModelTable);
