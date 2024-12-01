"use client";

import { useState } from "react";
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
import React from "react";

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

const EvaluationBar = ({ value }: { value: number }) => {
	return (
		<div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5">
			<div
				className="bg-blue-600 h-2.5 rounded-full"
				style={{ width: `${value * 1}%` }}
			/>
		</div>
	);
};

// Helper function to format price per million tokens
const formatPricePerMillion = (pricing: CombinedModelData["pricing"]) => {
	if (!pricing) return "N/A";

	if (pricing.per_input_token && pricing.per_output_token) {
		const inputPrice = (pricing.per_input_token * 1000000).toFixed(2);
		const outputPrice = (pricing.per_output_token * 1000000).toFixed(2);
		return `$${inputPrice} / $${outputPrice}`;
	}

	if (pricing.per_image) {
		return `$${pricing.per_image} per image`;
	}

	if (pricing.per_second) {
		return `$${(pricing.per_second * 1000000).toFixed(6)} per second`;
	}

	if (pricing.per_character) {
		return `$${(pricing.per_character * 1000000).toFixed(6)} per char`;
	}

	return "N/A";
};

// Left column component
const ModelInfo = ({ model }: { model: CombinedModelData }) => {
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
					{model.contextLength}
				</p>
			</div>
			<div>
				<h4 className="font-semibold text-sm text-neutral-800 dark:text-neutral-200">
					Max Output
				</h4>
				<p className="text-neutral-600 dark:text-neutral-400">
					{model.maxOutput}
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
				<a
					href={model.pricingUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center"
				>
					API Call
					<ExternalLink className="h-4 w-4 ml-1" />
				</a>
			</div>
		</div>
	);
};

// Right column component
const ModelEvaluation = ({
	evaluation,
}: { evaluation: EvaluationData | null }) => {
	if (!evaluation) return null;

	// Map the camelCase evaluation fields to display names
	const evaluationMap = {
		"Global Average": evaluation.globalAverage,
		Reasoning: evaluation.reasoning,
		Coding: evaluation.coding,
		Mathematics: evaluation.mathematics,
		"Data Analysis": evaluation.dataAnalysis,
		Language: evaluation.language,
		IF: evaluation.if,
	};

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
};

// Add this helper function near the top of the file
const copyToClipboard = (text: string) => {
	navigator.clipboard.writeText(text);
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

export default function ComparisonTable({
	combinedData,
	evaluationsData,
}: ComparisonTableProps) {
	const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

	const toggleRow = (id: string) => {
		setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
	};

	// Merge combinedData with evaluationsData based on model ID
	const mergedData = combinedData.map((model) => {
		// Normalize model IDs for comparison by removing case sensitivity and common variations
		const normalizedModelId = model.id.toLowerCase().trim();
		const evaluation = evaluationsData.find((evalItem) => {
			const normalizedEvalModel = evalItem.model.toLowerCase().trim();
			return normalizedModelId === normalizedEvalModel;
		});

		return {
			...model,
			evaluation: evaluation
				? {
						...evaluation,
					}
				: null,
		};
	});

	console.log("mergedData", mergedData);

	return (
		<div className="w-full">
			<Table className="w-full border-collapse border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
				<TableHeader>
					<TableRow className="bg-neutral-100 dark:bg-neutral-800">
						<TableHead className="w-[180px] text-neutral-700 dark:text-neutral-300">
							Model
						</TableHead>
						<TableHead className="text-neutral-700 dark:text-neutral-300">
							Type
						</TableHead>
						<TableHead className="text-neutral-700 dark:text-neutral-300">
							Cost per 1M tokens{" "}
						</TableHead>
						<TableHead className="hidden md:table-cell text-neutral-700 dark:text-neutral-300">
							Free limit
						</TableHead>
						<TableHead className="hidden lg:table-cell text-neutral-700 dark:text-neutral-300">
							Tier-1 limit
						</TableHead>
						<TableHead className="hidden lg:table-cell text-neutral-700 dark:text-neutral-300">
							Tier-2 limit
						</TableHead>
						<TableHead className="hidden xl:table-cell text-neutral-700 dark:text-neutral-300">
							Tier-3 limit
						</TableHead>
						<TableHead className="hidden xl:table-cell text-neutral-700 dark:text-neutral-300">
							Tier-4 limit
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{mergedData.map((model) => (
						<React.Fragment key={model.id}>
							<TableRow className="group border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
								<TableCell className="font-medium text-neutral-900 dark:text-neutral-100">
									<div className="flex items-center">
										<Button
											variant="ghost"
											size="sm"
											className="p-0 hover:bg-transparent text-neutral-900 dark:text-neutral-100"
											onClick={() => toggleRow(model.id)}
											aria-expanded={expandedRows[model.id]}
											aria-controls={`${model.id}-details`}
										>
											<span className="sr-only">
												{expandedRows[model.id] ? "Collapse" : "Expand"} details
												for {model.id}
											</span>
											{expandedRows[model.id] ? (
												<ChevronUp className="h-4 w-4 mr-2 text-neutral-500 dark:text-neutral-400 transition-transform group-hover:text-neutral-700 dark:group-hover:text-neutral-200" />
											) : (
												<ChevronDown className="h-4 w-4 mr-2 text-neutral-500 dark:text-neutral-400 transition-transform group-hover:text-neutral-700 dark:group-hover:text-neutral-200" />
											)}
											{model.id}
										</Button>
										<Button
											variant="ghost"
											size="sm"
											className="ml-2 p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded"
											onClick={() => copyToClipboard(model.id)}
											title="Copy model ID"
										>
											<span className="sr-only">Copy model ID</span>
											<CopyIcon />
										</Button>
									</div>
								</TableCell>
								<TableCell className="text-neutral-700 dark:text-neutral-300">
									{model.modelType || model.type || "N/A"}
								</TableCell>
								<TableCell className="text-neutral-700 dark:text-neutral-300">
									{formatPricePerMillion(model.pricing)}
								</TableCell>
								<TableCell className="hidden md:table-cell text-neutral-700 dark:text-neutral-300">
									{model.tiersData?.free || "N/A"}
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
							</TableRow>
							{expandedRows[model.id] && (
								<TableRow id={`${model.id}-details`}>
									<TableCell
										colSpan={8}
										className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700"
									>
										<div className="p-4 rounded-md">
											<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
												<ModelInfo model={model} />
												<ModelEvaluation evaluation={model.evaluation} />
											</div>
										</div>
									</TableCell>
								</TableRow>
							)}
						</React.Fragment>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
