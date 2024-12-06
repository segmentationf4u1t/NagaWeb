export interface UnitCosts {
	per_input_token?: string;
	per_output_token?: string;
	tokens_per_input_image?: number;
	per_image?: string;
	per_token?: string;
	per_second?: string;
	per_character?: string;
}

export interface Pricing extends UnitCosts {}

export interface Model {
	id: string;
	object: string;
	limiter?: string;
	pricing?: Pricing;
	max_images?: number;
	multiple_of?: number;
	allowed_for?: string[];
	type: string;
	modelType: string;
	contextLength: number | undefined;
	description: string;
	company: string;
}
