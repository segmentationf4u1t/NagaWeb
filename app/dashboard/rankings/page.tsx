"use client";

import { useState, useEffect } from "react";
import ModelComparisonTable from "@/components/ModelComparison/ModelComparisonTable";
import type { ProcessedResults } from "@/types/types";

export default function LeaderboardPage() {
	const [rawData, setRawData] = useState<ProcessedResults[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadData = async () => {
			try {
				setIsLoading(true);
				const response = await fetch(
					"https://livebench.ai/table_2024_08_31.csv",
				);

				if (!response.ok) {
					throw new Error("Failed to fetch data");
				}

				const csvContent = await response.text();
				const lines = csvContent.trim().split("\n");
				const headers = lines[0].split(",");

				const data = lines.slice(1).map((line) => {
					const values = line.split(",");
					const row = headers.reduce(
						(acc, header, index) => {
							acc[header] = values[index];
							return acc;
						},
						{} as Record<string, string>,
					);

					return {
						...row,
						model: row.model || "",
						global_average: 0,
						reasoning_average: 0,
						coding_average: 0,
						mathematics_average: 0,
						data_analysis_average: 0,
						language_average: 0,
						if_average: 0,
					} as ProcessedResults;
				});

				setRawData(data);
				setError(null);
			} catch (err) {
				console.error("Error loading data:", err);
				setError("Failed to load data. Please try again later.");
			} finally {
				setIsLoading(false);
			}
		};

		loadData();
	}, []);

	if (error) {
		return (
			<div className="p-8 text-center text-red-500">
				<p>{error}</p>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="p-8 text-center">
				<div className="animate-pulse space-y-4">
					<div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3 mx-auto" />
					<div className="h-64 bg-neutral-200 dark:bg-neutral-800 rounded" />
				</div>
			</div>
		);
	}

	return (
		<div className="p-4">
			<div className="rounded-lg border shadow-sm">
				<ModelComparisonTable rawData={rawData} />
			</div>
		</div>
	);
}
