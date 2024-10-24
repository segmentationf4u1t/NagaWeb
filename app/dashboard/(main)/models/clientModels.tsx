"use client";

import Loading from "@/components/Loader";
import ModelTableSkeleton from "@/components/ModelTable/ModelTableSkeleton";
import { useFetchLimitsQuery } from "@/lib/api/limitsApi";
import { useGetModelsQuery } from "@/lib/api/modelsApi";
import type { Model } from "@/types/models";
import type { Limit } from "@/types/limits";
import dynamic from "next/dynamic";
const ErrorLog = dynamic(() => import("@/components/Err"), {
	loading: () => <Loading />,
});

const ModelTable = dynamic(() => import("@/components/ModelTable/ModelTable"), {
	loading: () => <ModelTableSkeleton />,
});

// Utility function to combine models and limits data

const combineModelsAndLimits = (modelsData: Model[], limitsData: Limit[]) => {
	return modelsData.map((model) => {
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

		if (!modelLimit) {
			return { ...model, tiersData: {}, pricing: convertedPricing };
		}

		const tiersData = Object.entries(modelLimit.tiers).reduce(
			(acc: { [key: string]: string }, [tierName, limits]) => {
				if (Array.isArray(limits)) {
					const limitString = limits
						.map(
							([value, unit]: [number | string, string]) => `${value} ${unit}`,
						)
						.join(", ");
					acc[tierName] = limitString;
				} else {
					acc[tierName] = "Unknown limit";
				}
				return acc;
			},
			{} as { [key: string]: string },
		);

		return { ...model, tiersData, pricing: convertedPricing };
	});
};

const clientModels = () => {
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

	return (
		<div className="h-screen flex flex-col p-2">
			<div className="flex-grow">
				<div
					className="rounded-lg border shadow-smm"
					x-chunk="dashboard-02-chunk-1"
				>
					<div className="flex-grow overflow-hidden">
						<div className="h-full p-4">
							<ModelTable data={combinedData} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default clientModels;
