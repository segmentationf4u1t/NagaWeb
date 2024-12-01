import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { calculateAverage, getGlobalAverage } from "@/lib/Averaging";
import type { ProcessedResults } from "@/types/types";
import { Endpoints } from "@/conf/cfg";
import { modelAdditionalInfo } from "./modelsApi";

const categories = {
	reasoning: ["web_of_lies_v2", "zebra_puzzle", "spatial"] as string[],
	coding: ["LCB_generation", "coding_completion"] as string[],
	mathematics: ["AMPS_Hard", "math_comp", "olympiad"] as string[],
	data_analysis: ["cta", "tablejoin", "tablereformat"] as string[],
	language: ["connections", "plot_unscrambling", "typos"] as string[],
	if: ["paraphrase", "simplify", "story_generation", "summarize"] as string[],
};
//
const checkedCategories = Object.keys(categories).reduce(
	(acc, category) => {
		acc[category] = { average: true, allSubcategories: false };
		return acc;
	},
	{} as Record<string, { average: boolean; allSubcategories: boolean }>,
);

export const evaluationsApi = createApi({
	reducerPath: "evaluationsApi",
	baseQuery: fetchBaseQuery({ baseUrl: Endpoints.NAGA_EVALUATIONS }),
	endpoints: (builder) => ({
		fetchEvaluations: builder.query<ProcessedResults[], void>({
			query: () => ({
				url: Endpoints.NAGA_EVALUATIONS,
				responseHandler: async (response) => {
					if (!response.ok) throw new Error("Network response was not ok");
					return response.text();
				},
			}),
			transformResponse: (csvContent: string) => {
				if (!csvContent) return [];

				const lines = csvContent.trim().split("\n");
				if (lines.length < 2) return [];

				const headers = lines[0].split(",");

				// First, process all direct evaluations
				const directResults = lines
					.slice(1)
					.map((line) => {
						const values = line.split(",");
						const row = headers.reduce(
							(acc, header, index) => {
								acc[header] = values[index];
								return acc;
							},
							{} as Record<string, string>,
						);

						return {
							model: row.model,
							reasoning_average: calculateAverage(
								row,
								categories.reasoning,
							) as number,
							coding_average: calculateAverage(
								row,
								categories.coding,
							) as number,
							mathematics_average: calculateAverage(
								row,
								categories.mathematics,
							) as number,
							data_analysis_average: calculateAverage(
								row,
								categories.data_analysis,
							) as number,
							language_average: calculateAverage(
								row,
								categories.language,
							) as number,
							if_average: calculateAverage(row, categories.if) as number,
							global_average: Number(
								getGlobalAverage(row, checkedCategories, categories) || 0,
							),
						} as ProcessedResults;
					})
					.filter((result) => result.model); // Filter out any results without a model name

				// Then, add aliased results
				const aliasedResults = Object.entries(modelAdditionalInfo)
					.filter(([_, info]) => info.evaluationAlias)
					.map(([modelId, info]) => {
						const sourceResult = directResults.find(
							(result) =>
								result.model?.toLowerCase() ===
								info.evaluationAlias?.toLowerCase(),
						);

						if (sourceResult) {
							return {
								...sourceResult,
								model: modelId,
							};
						}
						return null;
					})
					.filter((result): result is ProcessedResults => result !== null);

				return [...directResults, ...aliasedResults].sort(
					(a, b) => (b.global_average || 0) - (a.global_average || 0),
				);
			},
		}),
	}),
});

export const {
	useFetchEvaluationsQuery,
	endpoints: { fetchEvaluations },
} = evaluationsApi;
