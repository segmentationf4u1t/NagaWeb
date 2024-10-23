"use client";

import Loading from "@/components/Loader";
import ModelTableSkeleton from "@/components/ModelTable/ModelTableSkeleton";
import { useFetchLimitsQuery } from "@/lib/api/limitsApi";
import { useGetModelsQuery } from "@/lib/api/modelsApi";
import dynamic from "next/dynamic";
const ErrorLog = dynamic(() => import("@/components/Err"), {
	loading: () => <Loading />,
});

const ModelTable = dynamic(() => import("@/components/ModelTable/ModelTable"), {
	loading: () => <ModelTableSkeleton />,
});

// Utility function to combine models and limits data

const combineModelsAndLimits = (modelsData: any[], limitsData: any[]) => {
	return modelsData.map((model) => {
		const modelLimit = limitsData.find((limit) => limit.id === model.limiter);

		if (!modelLimit) {
			return { ...model, tiersData: {} };
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

		return { ...model, tiersData };
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
					className="rounded-lg border border-dashed shadow-sm"
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
