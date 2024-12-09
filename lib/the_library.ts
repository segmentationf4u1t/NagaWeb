// Helper function to format numbers with commas
export const formatNumber = (value: number): string => {
	return value.toLocaleString("en-US");
};

// Helper function to format price per million tokens
export const formatPricePerMillion = (
	pricing: {
		per_input_token?: number;
		per_output_token?: number;
		per_image?: number;
		per_second?: number;
		per_character?: number;
	} | null,
) => {
	if (!pricing) return "Pending Evaluation";

	try {
		if (pricing.per_input_token && pricing.per_output_token) {
			const inputPrice = formatNumber(pricing.per_input_token * 1000000);
			const outputPrice = formatNumber(pricing.per_output_token * 1000000);
			return `$${inputPrice} / $${outputPrice}`;
		}

		if (pricing.per_image) {
			return `$${formatNumber(pricing.per_image)} per image`;
		}

		if (pricing.per_second) {
			return `$${(pricing.per_second * 1000000).toFixed(6)} per second`;
		}

		if (pricing.per_character) {
			return `$${(pricing.per_character * 1000000).toFixed(6)} per char`;
		}
	} catch (error) {
		console.error("Error formatting price:", error);
		return "err";
	}

	return "Free of Charge";
};

export const formatContextLength = (value?: string | number) => {
	if (!value) return "N/A";

	// If value is already a number, use it directly
	if (typeof value === "number") {
		if (value >= 1000000) {
			return `${(value / 1000000).toFixed(1)}M tokens`;
		}
		return `${value.toLocaleString("en-US")} tokens`;
	}

	// If value is a string, parse it
	const numericValue = Number.parseInt(value.replace(/[^0-9]/g, ""), 10);
	if (Number.isNaN(numericValue)) return value;

	if (numericValue >= 1000000) {
		return `${(numericValue / 1000000).toFixed(1)}M tokens`;
	}
	return `${numericValue.toLocaleString("en-US")} tokens`;
};
