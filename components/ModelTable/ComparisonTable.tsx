"use client";

import { useState, useMemo, useCallback, memo } from "react";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/hooks/use-toast";
import React from "react";
import { Input } from "@/components/ui/input";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { formatPricePerMillion, formatContextLength } from "@/lib/the_library";

interface EvaluationData {
	model: string;
	globalAverage: number;
	reasoning: number;
	coding: number;
	mathematics: number;
	dataAnalysis: number;
	language: number;
	if: number;
}

interface CombinedModelData {
	id: string;
	type: string;
	modelType?: string;
	contextLength?: string;
	maxOutput?: string;
	trainingCutoff?: string;
	description?: string;
	pricingUrl?: string;
	pricing?: {
		per_input_token?: number;
		per_output_token?: number;
		per_image?: number;
		per_token?: number;
		per_second?: number;
		per_character?: number;
	} | null;
	tiersData: {
		free?: string;
		"tier-1": string;
		"tier-2"?: string;
		"tier-3"?: string;
		"tier-4"?: string;
	};
}

interface ComparisonTableProps {
	combinedData: CombinedModelData[];
	evaluationsData: EvaluationData[];
}

// Memoized EvaluationBar component
const EvaluationBar = memo(({ value }: { value: number }) => {
	const width = Math.min(Math.max(value, 0), 100); // Sanitize input
	return (
		<div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5">
			<div
				className="bg-blue-600 h-2.5 rounded-full"
				style={{ width: `${width}%` }}
			/>
		</div>
	);
});
EvaluationBar.displayName = "EvaluationBar";

// Memoized ModelInfo component
const ModelInfo = memo(({ model }: { model: CombinedModelData }) => {
	return (
		<div className="space-y-4">
			<p className="text-sm text-neutral-600 dark:text-neutral-400">
				{model.description}
			</p>
			<div>
				<h4 className="font-semibold text-sm text-neutral-800 dark:text-neutral-200">
					Context Length
				</h4>
				<p className="text-neutral-600 dark:text-neutral-400">
					{formatContextLength(model.contextLength)}
				</p>
			</div>
			<div>
				<h4 className="font-semibold text-sm text-neutral-800 dark:text-neutral-200">
					Max Output
				</h4>
				<p className="text-neutral-600 dark:text-neutral-400">
					{formatContextLength(model.maxOutput)}
				</p>
			</div>
			<div>
				<h4 className="font-semibold text-sm text-neutral-800 dark:text-neutral-200">
					Training Cutoff
				</h4>
				<p className="text-neutral-600 dark:text-neutral-400">
					{model.trainingCutoff}
				</p>
			</div>
			<div>
				<h4 className="font-semibold text-sm text-neutral-800 dark:text-neutral-200">
					Quick Actions
				</h4>
				{model.pricingUrl && (
					<a
						href={model.pricingUrl}
						target="_blank"
						rel="noopener noreferrer nofollow"
						className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center"
					>
						API Call
						<ExternalLink className="h-4 w-4 ml-1" aria-hidden="true" />
						<span className="sr-only">(opens in new tab)</span>
					</a>
				)}
			</div>
		</div>
	);
});
ModelInfo.displayName = "ModelInfo";

// Memoized ModelEvaluation component
const ModelEvaluation = memo(
	({ evaluation }: { evaluation: EvaluationData | null }) => {
		if (!evaluation) return null;

		const evaluationMap = useMemo(
			() => ({
				"Global Average": evaluation.globalAverage,
				Reasoning: evaluation.reasoning,
				Coding: evaluation.coding,
				Mathematics: evaluation.mathematics,
				"Data Analysis": evaluation.dataAnalysis,
				Language: evaluation.language,
				IF: evaluation.if,
			}),
			[evaluation],
		);

		return (
			<div className="space-y-4">
				<h4 className="font-semibold text-sm text-neutral-800 dark:text-neutral-200">
					Model Evaluation
				</h4>
				{Object.entries(evaluationMap).map(([key, value]) => (
					<div key={key} className="space-y-1">
						<div className="flex justify-between items-center">
							<span className="text-sm text-neutral-600 dark:text-neutral-400">
								{key}
							</span>
							<span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
								{typeof value === "number" ? value.toFixed(1) : "0.0"}
							</span>
						</div>
						<EvaluationBar value={typeof value === "number" ? value : 0} />
					</div>
				))}
			</div>
		);
	},
);
ModelEvaluation.displayName = "ModelEvaluation";

// Safe clipboard copy function with error handling
const copyToClipboard = async (text: string): Promise<boolean> => {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch (error) {
		console.error("Failed to copy text:", error);
		return false;
	}
};

// Update the SVG with proper accessibility
const CopyIcon = () => (
	<svg
		className="h-4 w-4 text-neutral-500"
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		aria-labelledby="copyIconTitle"
	>
		<title id="copyIconTitle">Copy to clipboard</title>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
		/>
	</svg>
);

const RankDisplay = memo(({ rank }: { rank?: number }) => {
	if (!rank) return <span>N/A</span>;
	return <span className="text-base">{rank}</span>;
});
RankDisplay.displayName = "RankDisplay";

// Add this animation configuration before the ComparisonTable component
const tableAnimations = {
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0 },
	exit: { opacity: 0, y: -20 },
};

export default function ComparisonTable({
	combinedData,
	evaluationsData,
}: ComparisonTableProps) {
	const { toast } = useToast();
	const [searchQuery, setSearchQuery] = useState("");

	// First, calculate mergedData with ranks
	const mergedData = useMemo(() => {
		// First merge the data
		const merged = combinedData.map((model) => {
			const normalizedModelId = model.id.toLowerCase().trim();
			const evaluation = evaluationsData.find(
				(evalItem) => evalItem.model.toLowerCase().trim() === normalizedModelId,
			);

			return {
				...model,
				evaluation: evaluation ? { ...evaluation } : null,
			};
		});

		// Sort and assign ranks
		const sortedData = merged
			.sort((a, b) => {
				const scoreA = a.evaluation?.globalAverage ?? -1;
				const scoreB = b.evaluation?.globalAverage ?? -1;
				return scoreB - scoreA;
			})
			.map((model, index) => ({
				...model,
				rank: index + 1,
			}));

		return sortedData;
	}, [combinedData, evaluationsData]);

	// Initialize expandedRows with the top-ranked model's ID
	const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>(
		() => {
			const topRankedModel = mergedData.find((model) => model.rank === 1);
			return topRankedModel ? { [topRankedModel.id]: true } : {};
		},
	);

	const toggleRow = useCallback((id: string) => {
		setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
	}, []);

	const handleCopy = useCallback(
		async (id: string) => {
			const success = await copyToClipboard(id);
			if (success) {
				toast({
					title: "Copied!",
					description: `Model ID "${id}" copied to clipboard`,
					duration: 2000,
				});
			} else {
				toast({
					title: "Failed to copy",
					description: "Please try again",
					variant: "destructive",
					duration: 2000,
				});
			}
		},
		[toast],
	);

	// Memoize the price formatting for each model
	const memoizedPrices = useMemo(() => {
		return combinedData.reduce(
			(acc, model) => {
				acc[model.id] = formatPricePerMillion(model.pricing);
				return acc;
			},
			{} as Record<string, string>,
		);
	}, [combinedData]);

	// Filter mergedData based on search query
	const filteredData = useMemo(() => {
		return mergedData.filter((model) =>
			model.id.toLowerCase().includes(searchQuery.toLowerCase()),
		);
	}, [mergedData, searchQuery]);
	console.log(filteredData);
	return (
		<div className="w-full">
			<Input
				type="text"
				placeholder="Search models..."
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				className="mb-4 p-4 rounded-full"
			/>
			<Table className="w-full table-fixed border-collapse border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
				<TableHeader>
					<TableRow className="bg-neutral-100 dark:bg-neutral-800">
						<TableHead className="w-[80px] text-neutral-700 dark:text-neutral-300">
							Rank
						</TableHead>
						<TableHead className="w-[200px] text-neutral-700 dark:text-neutral-300">
							Model
						</TableHead>
						<TableHead className="w-[120px] text-neutral-700 dark:text-neutral-300">
							Type
						</TableHead>
						<TableHead className="w-[150px] text-neutral-700 dark:text-neutral-300">
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger className="flex items-center">
										Cost per 1M tokens{" "}
										<span className="ml-1 text-neutral-400">ⓘ</span>
									</TooltipTrigger>
									<TooltipContent>
										<p>$Input / $Output price per million tokens</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</TableHead>
						<TableHead className="w-[120px] hidden md:table-cell text-neutral-700 dark:text-neutral-300">
							Free limit
						</TableHead>
						<TableHead className="w-[120px] hidden lg:table-cell text-neutral-700 dark:text-neutral-300">
							Tier-1 limit
						</TableHead>
						<TableHead className="w-[120px] hidden lg:table-cell text-neutral-700 dark:text-neutral-300">
							Tier-2 limit
						</TableHead>
						<TableHead className="w-[120px] hidden xl:table-cell text-neutral-700 dark:text-neutral-300">
							Tier-3 limit
						</TableHead>
						<TableHead className="w-[120px] hidden xl:table-cell text-neutral-700 dark:text-neutral-300">
							Tier-4 limit
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{filteredData.map((model, index) => (
						<React.Fragment key={model.id}>
							<motion.tr
								className="group border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 bg-neutral-800/50"
								initial="initial"
								animate="animate"
								exit="exit"
								variants={tableAnimations}
								transition={{
									duration: 0.3,
									delay: index * 0.1, // Stagger effect
									ease: "easeOut",
								}}
							>
								<TableCell className="font-medium text-neutral-900 dark:text-neutral-100">
									<div className="flex items-center">
										{model.modelType === "Text" ||
										model.modelType === "Multimodal" ? (
											<Button
												variant="ghost"
												size="sm"
												className="p-0 hover:bg-transparent text-neutral-900 dark:text-neutral-100"
												onClick={() => toggleRow(model.id)}
												aria-expanded={expandedRows[model.id]}
												aria-controls={`${model.id}-details`}
											>
												<span className="sr-only">
													{expandedRows[model.id] ? "Collapse" : "Expand"}{" "}
													details for {model.id}
												</span>
												{expandedRows[model.id] ? (
													<ChevronUp className="h-4 w-4 mr-2 text-neutral-500 dark:text-neutral-400 transition-transform group-hover:text-neutral-700 dark:group-hover:text-neutral-200" />
												) : (
													<ChevronDown className="h-4 w-4 mr-2 text-neutral-500 dark:text-neutral-400 transition-transform group-hover:text-neutral-700 dark:group-hover:text-neutral-200" />
												)}
											</Button>
										) : (
											<Button
												variant="ghost"
												size="sm"
												className="p-0 text-neutral-400 dark:text-neutral-600 cursor-default"
												disabled
											>
												<ChevronDown className="h-4 w-4 mr-2" />
											</Button>
										)}
										<RankDisplay rank={model.rank} />
									</div>
								</TableCell>
								<TableCell className="font-medium text-neutral-900 dark:text-neutral-100">
									<div className="flex items-center">
										<span>{model.id}</span>
										<Button
											variant="ghost"
											size="sm"
											className="ml-2 p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded"
											onClick={() => handleCopy(model.id)}
											title="Copy model ID"
										>
											<span className="sr-only">Copy model ID</span>
											<CopyIcon />
										</Button>
									</div>
								</TableCell>
								<TableCell className="text-neutral-700 dark:text-neutral-300">
									{model.modelType || "N/A"}
								</TableCell>
								<TableCell className="text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
									{memoizedPrices[model.id] === "Free of Charge" ? (
										<motion.span
											className="font-bold text-green-500 inline-block"
											initial={{ scale: 1 }}
											animate={{ scale: [1, 1.05, 1] }}
											transition={{
												duration: 1.5,
												repeat: Infinity,
												repeatType: "loop",
											}}
										>
											{memoizedPrices[model.id]}
										</motion.span>
									) : (
										memoizedPrices[model.id]
									)}
								</TableCell>
								<TableCell className="hidden md:table-cell text-neutral-700 dark:text-neutral-300">
									{model.tiersData?.free ? (
										model.tiersData.free
									) : (
										<motion.span
											className="text-amber-500"
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ delay: 0.5 }}
										>
											<span className="inline-flex">
												{Array.from("Upgrade to unlock").map((char, index) => (
													<motion.span
														key={index}
														style={{
															display: "inline-block",
															whiteSpace: "pre",
														}}
														initial={{ y: 0 }}
														animate={{ y: [0, -3, 0] }}
														transition={{
															duration: 0.5,
															delay: index * 0.05,
															repeat: Infinity,
															repeatType: "loop",
														}}
													>
														{char}
													</motion.span>
												))}
												<ExternalLink
													className="h-4 w-4 ml-1"
													aria-hidden="true"
												/>
											</span>
										</motion.span>
									)}
								</TableCell>
								<TableCell className="hidden lg:table-cell text-neutral-700 dark:text-blue-500 font-bold">
									{model.tiersData?.["tier-1"] || "N/A"}
								</TableCell>
								<TableCell className="hidden lg:table-cell text-neutral-700 dark:text-purple-500 font-bold">
									{model.tiersData?.["tier-2"] || "N/A"}
								</TableCell>
								<TableCell className="hidden xl:table-cell text-neutral-700 dark:text-rose-500 font-bold">
									{model.tiersData?.["tier-3"] || "N/A"}
								</TableCell>
								<TableCell className="hidden xl:table-cell text-neutral-700 bg-gradient-to-r from-rose-500 to-purple-500 bg-clip-text text-transparent font-bold">
									{model.tiersData?.["tier-4"] || "N/A"}
								</TableCell>
							</motion.tr>
							{expandedRows[model.id] && (
								<motion.tr
									id={`${model.id}-details`}
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: "auto" }}
									exit={{ opacity: 0, height: 0 }}
									transition={{ duration: 0.3 }}
								>
									<TableCell
										colSpan={9}
										className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700"
									>
										<div className="p-4 rounded-md">
											<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
												<ModelInfo model={model} />
												<ModelEvaluation evaluation={model.evaluation} />
											</div>
										</div>
									</TableCell>
								</motion.tr>
							)}
						</React.Fragment>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
