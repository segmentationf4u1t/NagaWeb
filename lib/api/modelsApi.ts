import { Endpoints } from "@/conf/cfg";
import { keepCacheFor } from "@/conf/cfg";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Model } from "@/types/models";


// This has to be thought of, Firstly - The term multimodal is not precise,
// for example even stable-diffusion is multimodal cause it generates images from text,
// so there are already two modalities.
// Secondly, I dont have idea how it should function now.



// Mad inheritance system for model configs
// 29.11.24

const baseModelConfigs = {
	"claude-3-5-sonnet": {
		contextLength: 200000,
		description:
			"Claude 3.5 Sonnet strikes the ideal balance between intelligence and speed—particularly for enterprise workloads. It delivers strong performance at a lower cost compared to its peers, and is engineered for high endurance in large-scale AI deployments.",
		company: "Anthropic",
		maxOutput: 8192,
		trainingCutoff: "Apr 2024",
	},
	"claude-3.5-haiku": {
		contextLength: 200000,
		description:
			"Claude 3.5 Haiku is a powerful, multimodal model that can process and generate text, images, and audio. It's designed for a wide range of applications, including content creation, data analysis, and more.",
		company: "Anthropic",
		maxOutput: 8192,
		trainingCutoff: "Jul 2024",
	},
	"claude-3-opus": {
		contextLength: 200000,
		description:
			"Claude 3 Opus is a powerful, multimodal model that can process and generate text, images, and audio. It's designed for a wide range of applications, including content creation, data analysis, and more.",
		company: "Anthropic",
		maxOutput: 4096,
		trainingCutoff: "Aug 2023",
	},
	"claude-3-sonnet": {
		contextLength: 200000,
		description:
			"Claude 3 Sonnet is a powerful, multimodal model that can process and generate text, images, and audio. It's designed for a wide range of applications, including content creation, data analysis, and more.",
		company: "Anthropic",
		maxOutput: 4096,
		trainingCutoff: "Aug 2023",
	},
	"claude-3-haiku": {
		contextLength: 200000,
		description:
			"Claude 3 Haiku is a powerful, multimodal model that can process and generate text, images, and audio. It's designed for a wide range of applications, including content creation, data analysis, and more.",
		company: "Anthropic",
		maxOutput: 4096,
		trainingCutoff: "Aug 2024",
	},
	"gpt-4o": {
		contextLength: 128000,
		description: "The latest GPT-4o model.",
		company: "OpenAI",
		maxOutput: 16384,
		trainingCutoff: "Oct 2023",
	},
	"o1-preview": {
		contextLength: 128000,
		description:
			"O1 Preview is a powerful, multimodal model that can process and generate text, images, and audio. It's designed for a wide range of applications, including content creation, data analysis, and more.",
		company: "OpenAI",
		maxOutput: 32768,
		trainingCutoff: "Oct 2023",
	},
	"o1-mini": {
		contextLength: 128000,
		description:
			"O1 Mini is a smaller version of the O1 model, designed for more resource-constrained environments. It's a powerful tool for a wide range of applications, including content creation, data analysis, and more.",
		company: "OpenAI",
		maxOutput: 65536,
		trainingCutoff: "Oct 2023",
	},
	"gpt-4-turbo": {
		contextLength: 128000,
		description:
			"The latest GPT-4 Turbo model with vision capabilities. Vision requests can now use JSON mode and function calling.",
		company: "OpenAI",
		maxOutput: 4096,
		trainingCutoff: "Dec 2023",
	},
	"gpt-3.5-turbo": {
		contextLength: 16385,
		description: "The latest GPT-3.5 Turbo model.",
		company: "OpenAI",
		maxOutput: 4096,
		trainingCutoff: "Sep 2021",
	},
	"llama-3": {
		contextLength: 8192,
		description: "The latest Llama-3 model.",
		company: "Meta",
		maxOutput: 4096,
		trainingCutoff: "Dec 2023",
	},
};

// Helper function to get model base name
const getBaseModelName = (modelId: string): string | null => {
	// Example patterns to detect base models:
	const patterns = [
		// Claude patterns
		/(claude-\d+-\d+-sonnet).*$/,
		/(claude-\d+\.?\d*-sonnet).*$/,
		/(claude-\d+\.?\d*-haiku).*$/,
		/(claude-\d+\.?\d*-opus).*$/,
		
		// GPT patterns
		/(gpt-4-turbo).*$/,
		/(gpt-4)(?:-\d+)?.*$/,
		/(gpt-3\.5-turbo)(?:-\d+)?.*$/,
		
		// Mistral patterns
		/(mistral-(?:small|medium|large)).*$/,
		/(mistral-\d+b).*$/,
		
		// Llama patterns
		/(llama-\d+(?:\.\d+)?-\d+b).*$/,
		
		// Gemini patterns
		/(gemini-\d+\.?\d*-(?:pro|flash)).*$/,
		
		// O1 patterns
		/(o1-(?:mini|preview)).*$/,
		
		// Mixtral patterns
		/(mixtral-\d+x\d+b).*$/,
	];

	for (const pattern of patterns) {
		const match = modelId.match(pattern);
		if (match && match[1]) {
			return match[1];
		}
	}
	return null;
};

// Modified modelAdditionalInfo with inheritance
const modelAdditionalInfo: Record<
	string,
	{
		contextLength: number | undefined;
		description: string;
		company: string;
		maxOutput?: number | undefined;
		trainingCutoff?: string | undefined;
		type: string;
	}
> = {
	// Define specific models with their unique properties
	"claude-3-5-sonnet-20241022": {
		// Inherit from base config and override specific properties
		...baseModelConfigs["claude-3-5-sonnet"],
		// Override specific properties if needed
		description:
			"Updated version of Claude 3.5 Sonnet with improved capabilities",
	},
	"gpt-4o-2024-05-13": {
		...baseModelConfigs["gpt-4o"],
		description: "Original gpt-4o snapshot from May 13, 2024.",
		maxOutput: 4096,
	},
};

// Modified getAdditionalInfo function to support inheritance
export const getAdditionalInfo = (modelId: string) => {
    const lowercaseId = modelId.toLowerCase();

    if (modelAdditionalInfo[lowercaseId]) {
        return modelAdditionalInfo[lowercaseId];
    }

    const baseModelId = getBaseModelName(lowercaseId);
    if (baseModelId && baseModelConfigs[baseModelId]) {
        return baseModelConfigs[baseModelId];
    }

    return {
        contextLength: 0,
        description: "No description available",
        company: "Unknown",
        type: "Unknown"
    };
};

//27.03 Caching for Query
//14.10.24 Additional context length, description and company info added

export const modelsApi = createApi({
	reducerPath: "modelsApi",
	baseQuery: fetchBaseQuery({ baseUrl: Endpoints.NAGA_BASE_URL }),
	endpoints: (build) => ({
        getModels: build.query<Model[], void>({
            query: () => "models",
            transformResponse: (response: { data: Model[] }) => {
                return response.data
                    .filter((model) => model.object === "model")
                    .map((model) => {
                        const additionalInfo = getAdditionalInfo(model.id);
                        return {
                            ...model,
                            modelType: additionalInfo.type,
                            contextLength: additionalInfo.contextLength,
                            description: additionalInfo.description,
                            company: additionalInfo.company,
                            maxOutput: additionalInfo.maxOutput,
                            trainingCutoff: additionalInfo.trainingCutoff,
                        };
                    });
            },
            keepUnusedDataFor: keepCacheFor,
        }),

		// New endpoint to get the total number of models
		getTotalModels: build.query<number, void>({
			query: () => "models",
			transformResponse: (response: { data: Model[] }) => {
				return response.data.filter((model) => model.object === "model").length;
			},
			keepUnusedDataFor: keepCacheFor,
		}),

		// New endpoint to get model counts by type
		getModelTypeCounts: build.query<Record<string, number>, void>({
			query: () => "models",
			transformResponse: (response: { data: Model[] }) => {
				const models = response.data.filter(
					(model) => model.object === "model",
				);
				const counts: Record<string, number> = {
					Text: 0,
					Image: 0,
					Audio: 0,
					Multimodal: 0,
					Embedding: 0,
					Moderation: 0,
				};

				for (const model of models) {
					const modelType = modelTypeMap[model.id.toLowerCase()] || "Unknown";
					counts[modelType] = (counts[modelType] || 0) + 1;
				}

				return counts;
			},
			keepUnusedDataFor: keepCacheFor,
		}),
	}),
});

// Update the exported hooks
export const {
	useGetModelsQuery,
	useGetTotalModelsQuery,
	useGetModelTypeCountsQuery,
} = modelsApi;
