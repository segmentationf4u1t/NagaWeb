"use client";

import { useFetchEvaluationsQuery } from '@/lib/api/evaluationsApi';
import ModelComparisonTable from "@/components/ModelComparison/ModelComparisonTable";

export default function LeaderboardPage() {
	const { data: rawData, error, isLoading } = useFetchEvaluationsQuery();
	
	if (error) {
		return (
			<div className="p-8 text-center text-red-500">
				<p>Failed to load data. Please try again later.</p>
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
			<ModelComparisonTable rawData={rawData || []} />
		</div>
	);
}
