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
}

export interface SortConfig {
	key: keyof ProcessedResults;
	direction: "asc" | "desc";
}

export interface EvaluationData {
	id: string;
	AMPS_Hard: string;
	LCB_generation: string;
	coding_completion: string;
	connections: string;
	cta: string;
	math_comp: string;
	olympiad: string;
	paraphrase: string;
	plot_unscrambling: string;
	simplify: string;
	spatial: string;
	story_generation: string;
	summarize: string;
	tablejoin: string;
	tablereformat: string;
	typos: string;
	web_of_lies_v2: string;
	zebra_puzzle: string;
}

export interface ModelData {
	id: string;
	type: string;
	modelType?: string;
	description?: string;
	contextLength?: string;
	maxOutput?: string;
	trainingCutoff?: string;
	pricing?: {
		per_input_token?: number;
		per_output_token?: number;
		per_image?: number;
		per_token?: number;
		per_second?: number;
		per_character?: number;
	} | null;
	pricingUrl?: string;
	tiersData: {
		freeLimit?: string;
		tier1Limit?: string;
		tier2Limit?: string;
		tier3Limit?: string;
		tier4Limit?: string;
	};
}
