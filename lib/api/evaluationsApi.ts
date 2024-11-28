import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { calculateAverage, getGlobalAverage } from '@/app/dashboard/rankings/Averaging';
import type { ProcessedResults, Categories, CheckedCategories } from '@/types/types';

const categories: Categories = {
  reasoning: ["connections", "plot_unscrambling", "spatial", "zebra_puzzle"],
  coding: ["coding_completion", "LCB_generation"],
  mathematics: ["math_comp", "olympiad"],
  data_analysis: ["tablejoin", "tablereformat"],
  language: ["paraphrase", "story_generation", "summarize", "typos"],
  if: ["AMPS_Hard", "cta", "simplify", "web_of_lies_v2"],
};

const checkedCategories: CheckedCategories = Object.keys(categories).reduce(
  (acc, category) => {
    acc[category] = { average: true, allSubcategories: false };
    return acc;
  },
  {} as CheckedCategories,
);

export const evaluationsApi = createApi({
  reducerPath: 'evaluationsApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api',
    credentials: 'same-origin',
  }),
  endpoints: (builder) => ({
    fetchEvaluations: builder.query<ProcessedResults[], void>({
      query: () => ({
        url: 'evaluations/latest',
        credentials: 'same-origin',
      }),
      transformResponse: (response: ProcessedResults[]) => {
        if (!response || !Array.isArray(response)) {
          return [];
        }
        return response.map(row => ({
          ...row,
          reasoning_average: Number(calculateAverage(row, categories.reasoning)),
          coding_average: Number(calculateAverage(row, categories.coding)),
          mathematics_average: Number(calculateAverage(row, categories.mathematics)),
          data_analysis_average: Number(calculateAverage(row, categories.data_analysis)),
          language_average: Number(calculateAverage(row, categories.language)),
          if_average: Number(calculateAverage(row, categories.if)),
          global_average: Number(getGlobalAverage(row, checkedCategories, categories) || 0),
        })).sort((a, b) => b.global_average - a.global_average);
      },
    }),
  }),
});

export const { 
  useFetchEvaluationsQuery,
  endpoints: { fetchEvaluations },
} = evaluationsApi;
