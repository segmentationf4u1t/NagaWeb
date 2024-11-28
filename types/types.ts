// types.ts
export interface FeatureItem {
	src: string;
	alt: string;
	title: string;
	description: string;
	id: string;
}

export type Categories = {
	[key: string]: string[]; 
	reasoning: string[];
	coding: string[];
	mathematics: string[];
	data_analysis: string[];
	language: string[];
	if: string[];
};

export interface CheckedCategories {
	[key: string]: {
		average: boolean;
		allSubcategories: boolean;
	};
}

export interface ProcessedResults {
	model: string;
	global_average: number;
	reasoning_average: number;
	coding_average: number;
	mathematics_average: number;
	data_analysis_average: number;
	language_average: number;
	if_average: number;
	[key: string]: string | number;
}

export interface SortConfig {
	key: keyof ProcessedResults;
	direction: "asc" | "desc";
}
