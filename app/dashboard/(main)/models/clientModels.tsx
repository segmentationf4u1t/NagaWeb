"use client";

import Loading from "@/components/Loader";
import ModelTableSkeleton from "@/components/ModelTable/ModelTableSkeleton";
import { useFetchLimitsQuery } from "@/lib/api/limitsApi";
import { useGetModelsQuery } from "@/lib/api/modelsApi";
import type { Model } from "@/types/models";
import type { Limit } from "@/types/limits";
import dynamic from "next/dynamic";
import type { ProcessedResults } from "@/types/types";
import { useFetchEvaluationsQuery } from "@/lib/api/evaluationsApi";
const ErrorLog = dynamic(() => import("@/components/Err"), {
	loading: () => <Loading />,
});

const ComparisonTable = dynamic(
	() => import("@/components/ModelTable/ComparisonTable"),
	{
		loading: () => <ModelTableSkeleton />,
	},
);

const combineModelsAndLimits = (modelsData: Model[], limitsData: Limit[]) => {
	return modelsData.map((model) => {
		const contextLength = model.contextLength?.toString();

		const modelLimit = limitsData.find((limit) => limit.id === model.limiter);

		// Convert pricing string values to numbers
		const convertedPricing = model.pricing
			? {
					...model.pricing,
					per_input_token: model.pricing.per_input_token
						? Number(model.pricing.per_input_token)
						: undefined,
					per_output_token: model.pricing.per_output_token
						? Number(model.pricing.per_output_token)
						: undefined,
					per_image: model.pricing.per_image
						? Number(model.pricing.per_image)
						: undefined,
					per_token: model.pricing.per_token
						? Number(model.pricing.per_token)
						: undefined,
					per_second: model.pricing.per_second
						? Number(model.pricing.per_second)
						: undefined,
					per_character: model.pricing.per_character
						? Number(model.pricing.per_character)
						: undefined,
				}
			: null;

		const tiersData = {
			"tier-1": "0", // Default value
			free: undefined,
			"tier-2": undefined,
			"tier-3": undefined,
			"tier-4": undefined,
			...Object.entries(modelLimit?.tiers || {}).reduce(
				(acc: { [key: string]: string }, [tierName, limits]) => {
					if (Array.isArray(limits)) {
						acc[tierName] = limits
							.map(
								([value, unit]: [number | string, string]) =>
									`${value} ${unit}`,
							)
							.join(", ");
					}
					return acc;
				},
				{},
			),
		};

		return { ...model, contextLength, tiersData, pricing: convertedPricing };
	});
};

export default function ClientModels() {
	const initialData: ProcessedResults[] = [];
	const { data = initialData } = useFetchEvaluationsQuery(undefined, {
		skip: false,
	});

	const {
		data: modelsData,
		isLoading: isLoadingModels,
		isError: isErrorModels,
	} = useGetModelsQuery();

	const {
		data: limitsData,
		isLoading: isLoadingLimits,
		isError: isErrorLimits,
	} = useFetchLimitsQuery();

	// Handle loading states
	if (isLoadingModels || isLoadingLimits) {
		return <ModelTableSkeleton />;
	}

	// Handle error states
	if (isErrorModels || isErrorLimits) {
		const errorMessage = `Error loading ${
			isErrorModels ? "models" : "limits"
		}. Please report this incident with console print.`;
		return <ErrorLog errorMessage={errorMessage} />;
	}

	// Combine models and limits data
	const combinedData = combineModelsAndLimits(
		modelsData || [],
		limitsData || [],
	);

	const transformedEvaluations = data.map((result) => ({
		model: result.model,
		globalAverage: result.global_average,
		reasoning: result.reasoning_average,
		coding: result.coding_average,
		mathematics: result.mathematics_average,
		dataAnalysis: result.data_analysis_average,
		language: result.language_average,
		if: result.if_average,
	}));
	console.log("transformedEvaluations \n", transformedEvaluations);

	return (
		<div className="h-screen flex flex-col p-2">
			<div className="flex-grow">
				<div
					className="rounded-lg border shadow-sm"
					x-chunk="dashboard-02-chunk-1"
				>
					<div className="flex-grow overflow-hidden">
						<div className="h-full p-4">
							<ComparisonTable
								combinedData={combinedData}
								evaluationsData={transformedEvaluations}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
