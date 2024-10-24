import { Endpoints } from "@/conf/cfg";
import { keepCacheFor } from "@/conf/cfg";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Model } from '@/types/models';


//Be mindful that this is only client side api, it is not used for server side api, for that we use server actions.
//23.10.24
const textModels = [
	"llama-2-70b-chat",
	"llama-2-13b-chat",
	"llama-2-7b-chat",
	"mixtral-8x7b",
	"mistral-7b",
	"gpt-4",
	"gpt-4-turbo-preview",
	"gpt-3.5-turbo",
	"claude-3-haiku-20240307",
	"claude-3-sonnet",
	"claude-3-haiku",
	"mistral-small",
	"claude-3-opus",
	"mistral-large",
	"mistral-large-2402",
	"gpt-4-0125-preview",
	"claude-2.1",
	"claude-3-opus-20240229",
	"claude-3-sonnet-20240229",
	"mistral-small-2402",
	"gpt-3.5-turbo-0125",
	"mistral-next",
	"gpt-4-1106-preview",
	"gpt-4-0613",
	"gpt-3.5-turbo-1106",
	"gpt-3.5-turbo-0613",
	"claude-instant",
	"gemini-pro",
	"gemini-pro-vision",
	"gpt-4-turbo-2024-04-09",
	"gpt-4-1106-vision-preview",
	"gemini-1.5-pro-latest",
	"llama-3-70b-instruct",
	"llama-3-8b-instruct",
	"mixtral-8x22b-instruct",
	"command-r-plus",
	"command-r",
	"mixtral-8x7b-instruct",
	"mistral-7b-instruct",
	"codestral-2405",
	"gemini-1.5-flash-latest",
	"llama-3.1-405b-instruct",
	"llama-3.1-70b-instruct",
	"llama-3.1-8b-instruct",
	"mistral-large-2407",
	"claude-3.5-sonnet-20240620",
	"llama-3.2-3b-instruct",
	"llama-3.2-90b-vision-instruct",
	"llama-3.2-11b-vision-instruct",
	"llama-3.2-1b-instruct",

];
const imageModels = [
	"midjourney",
	"sdxl",
	"latent-consistency-model",
	"kandinsky-2.2",
	"kandinsky-2",
	"playground-v2.5",
	"dall-e-3",
	"kandinsky-3",
	"dall-e",
	"stable-diffusion-2.1",
	"stable-diffusion-1.5",
	"deepfloyd-if",
	"material-diffusion",
	"stable-diffusion-3",
	"kandinsky-3.1",
	"stable-diffusion-3-large",
	"flux-1-pro",
	"flux-1-dev",
	"flux-1-schnell",
];
const audioModels = [
	"whisper-1",
	"m2m100-1.2b",
	"google-tts-1",
	"whisper-large-v3",
	"xtts-v2",
	"bark",
	"whisper-large",
	"eleven-multilingual-v2",
	"eleven-multilingual-v1",
	"eleven-turbo-v2",
	"eleven-monolingual-v1",
];
const embeddingModels = [
	"text-embedding-ada-002",
	"bge-base-en-v1.5",
	"bge-large-en-v1.5",
	"text-embedding-3-small",
	"text-embedding-3-large",
];

//
// This has to be thought of, Firstly - The term multimodal is not precise,
// for example even stable-diffusion is multimodal cause it generates images from text,
// so there are already two modalities.
// Secondly, I dont have idea how it should function now.
//
const multimodalModels = [
	"gpt-4o-2024-08-06",
	"gpt-4o-mini-2024-07-18",
	"gemini-1.5-pro-exp-0801",
	"gemini-1.5-pro",
	"gemini-1.5-flash",
	"gpt-4-vision-preview",
	"gpt-4o-2024-05-13",
	"chatgpt-4o-latest"
];
const moderationModels = ["text-moderation-stable", "text-moderation-latest"];

const modelTypeMap: Record<string, string> = {
	...Object.fromEntries(textModels.map((id) => [id.toLowerCase(), "Text"])),
	...Object.fromEntries(imageModels.map((id) => [id.toLowerCase(), "Image"])),
	...Object.fromEntries(audioModels.map((id) => [id.toLowerCase(), "Audio"])),
	...Object.fromEntries(
		multimodalModels.map((id) => [id.toLowerCase(), "Multimodal"]),
	),
	...Object.fromEntries(
		embeddingModels.map((id) => [id.toLowerCase(), "Embedding"]),
	),
	...Object.fromEntries(
		moderationModels.map((id) => [id.toLowerCase(), "Moderation"]),
	),
};

const modelAdditionalInfo: Record<
	string,
	{ contextLength: number | undefined; description: string; company: string }
> = {
	"claude-1": {
		contextLength: 100000,
		description:
			"An older version of Anthropic's Claude model that excels at a wide range of tasks from sophisticated dialogue and creative content generation to detailed instruction. It is good for complex reasoning, creativity, thoughtful dialogue, coding, and detailed content creation.",
		company: "Anthropic",
	},
	"claude-2": {
		contextLength: 100000,
		description:
			"An older version of Anthropic's Claude model that excels at a wide range of tasks from sophisticated dialogue and creative content generation to detailed instruction. It is good for complex reasoning, creativity, thoughtful dialogue, coding, and detailed content creation.",
		company: "Anthropic",
	},
	"llama-2-70b-chat": {
		contextLength: 4096,
		description:
			"A highly capable language model by Meta, featuring 70 billion parameters, designed for conversational AI with advanced reasoning and understanding.",
		company: "Meta",
	},
	"llama-2-13b-chat": {
		contextLength: 4096,
		description:
			"A conversational AI model by Meta with 13 billion parameters, offering a balance of performance and efficiency for diverse natural language tasks.",
		company: "Meta",
	},
	"llama-2-7b-chat": {
		contextLength: 4096,
		description:
			"A compact and efficient language model by Meta, equipped with 7 billion parameters, suitable for conversational AI applications with moderate computational needs.",
		company: "Meta",
	},
	"mixtral-8x7b": {
		contextLength: 8192,
		description:
			"A mixture-of-experts language model by Mistral, combining eight 7-billion-parameter sub-models, designed to enhance performance through dynamic expert routing.",
		company: "Mistral",
	},
	"mistral-7b": {
		contextLength: 8192,
		description:
			"An efficient language model with 7 billion parameters by Mistral, optimized for high-performance natural language processing across various domains.",
		company: "Mistral",
	},
	"gpt-4": {
		contextLength: 8192,
		description:
			"A state-of-the-art language model by OpenAI, known for its advanced reasoning, problem-solving, and natural language understanding capabilities.",
		company: "OpenAI",
	},
	"gpt-4-turbo-preview": {
		contextLength: 128000,
		description:
			"An optimized variant of GPT-4, offering improved efficiency and a significantly extended context window, ideal for long-form content generation and analysis.",
		company: "OpenAI",
	},
	"gpt-3.5-turbo": {
		contextLength: 16368,
		description:
			"An enhanced version of GPT-3.5, providing fast and cost-effective language generation with optimized performance for conversational and general-purpose tasks.",
		company: "OpenAI",
	},
	"claude-3-haiku-20240307": {
		contextLength: 200000,
		description:
			"A variant of Claude 3 by Anthropic, optimized for generating concise and creative responses, suitable for artistic and expressive language tasks.",
		company: "Anthropic",
	},
	"claude-3-sonnet": {
		contextLength: 200000,
		description:
			"Anthropic's Claude 3 variant, tailored for producing structured and poetic outputs with an emphasis on form and stylistic quality.",
		company: "Anthropic",
	},
	"claude-3-haiku": {
		contextLength: 200000,
		description:
			"A Claude 3 variant by Anthropic, designed for generating brief and imaginative content, with a focus on creative writing and artistic expression.",
		company: "Anthropic",
	},
	"mistral-small": {
		contextLength: 33000,
		description:
			"A compact language model by Mistral, aimed at efficient deployment scenarios where computational resources are limited, while still providing robust performance.",
		company: "Mistral",
	},
	"claude-3-opus": {
		contextLength: 100000,
		description:
			"Claude 3's comprehensive variant by Anthropic, intended for detailed and thorough responses, suitable for in-depth analysis and extended content generation.",
		company: "Anthropic",
	},
	"mistral-large": {
		contextLength: 33000,
		description:
			"An enhanced model from Mistral with increased parameters, offering superior performance for complex language processing tasks and large-scale deployments.",
		company: "Mistral",
	},
	"mistral-large-2402": {
		contextLength: 8192,
		description:
			"A large-scale language model by Mistral, released in February 2024, featuring improvements in efficiency and language understanding capabilities.",
		company: "Mistral",
	},
	"gpt-4-0125-preview": {
		contextLength: 128000,
		description:
			"A preview version of GPT-4 by OpenAI, released in January 2025, incorporating experimental features and optimizations for enhanced language performance.",
		company: "OpenAI",
	},
	"claude-2.1": {
		contextLength: 100000,
		description:
			"An improved version of Claude 2 by Anthropic, featuring upgrades in safety measures and performance to better handle complex language tasks.",
		company: "Anthropic",
	},
	"claude-3-opus-20240229": {
		contextLength: 200000,
		description:
			"The Opus variant of Claude 3 by Anthropic, released on February 29, 2024, designed for generating comprehensive and nuanced content.",
		company: "Anthropic",
	},
	"claude-3-sonnet-20240229": {
		contextLength: 200000,
		description:
			"The Sonnet variant of Claude 3, released by Anthropic on February 29, 2024, focused on producing structured poetic outputs with stylistic precision.",
		company: "Anthropic",
	},
	"mistral-small-2402": {
		contextLength: 128000,
		description:
			"A small-scale language model by Mistral, introduced in February 2024, suitable for lightweight tasks while maintaining solid language generation capabilities.",
		company: "Mistral",
	},
	"gpt-3.5-turbo-0125": {
		contextLength: 16368,
		description:
			"An updated release of GPT-3.5 Turbo by OpenAI, launched in January 2025, with performance improvements for enhanced conversational abilities.",
		company: "OpenAI",
	},
	"mistral-next": {
		contextLength: 16368,
		description:
			"A next-generation language model by Mistral, offering advanced language capabilities with a longer context window for extended content generation and analysis.",
		company: "Mistral",
	},
	"gpt-4-1106-preview": {
		contextLength: 128000,
		description:
			"A preview version of GPT-4, released by OpenAI in November 2006, featuring experimental features for early user feedback and testing.",
		company: "OpenAI",
	},
	"gpt-4-0613": {
		contextLength: 128000,
		description:
			"A GPT-4 variant released by OpenAI in June 2013, with specific optimizations for performance and accuracy improvements.",
		company: "OpenAI",
	},
	"gpt-3.5-turbo-1106": {
		contextLength: 16368,
		description:
			"An updated variant of GPT-3.5 Turbo by OpenAI, released in November 2006, with optimizations for improved efficiency.",
		company: "OpenAI",
	},
	"gpt-3.5-turbo-0613": {
		contextLength: 16368,
		description:
			"A June 2013 release of GPT-3.5 Turbo by OpenAI, featuring enhancements in processing speed and output quality.",
		company: "OpenAI",
	},
	"claude-instant": {
		contextLength: 10000,
		description:
			"An Anthropic model optimized for instant responses with lower latency, ideal for time-sensitive conversational applications.",
		company: "Anthropic",
	},
	"gemini-pro": {
		contextLength: 33000,
		description:
			"A high-performance model by Google, offering extended context length and advanced capabilities for complex natural language tasks.",
		company: "Google",
	},
	"gemini-pro-vision": {
		contextLength: 2000000,
		description:
			"An extension of Google's Gemini Pro model with integrated vision capabilities for multi-modal tasks, enhancing text and image understanding.",
		company: "Google",
	},
	"gpt-4-turbo-2024-04-09": {
		contextLength: 128000,
		description:
			"A turbo-optimized variant of GPT-4 by OpenAI, released on April 9, 2024, designed for high-efficiency language processing and extended context usage.",
		company: "OpenAI",
	},
	"gpt-4-1106-vision-preview": {
		contextLength: 128000,
		description:
			"A preview version of GPT-4 by OpenAI, featuring vision capabilities and released on November 6, 2024, for multi-modal processing.",
		company: "OpenAI",
	},
	"gemini-1.5-pro-latest": {
		contextLength: 2000000,
		description:
			"The latest iteration of Google's Gemini 1.5 Pro, incorporating cutting-edge advancements for high-quality natural language processing.",
		company: "Google",
	},
	"llama-3-70b-instruct": {
		contextLength: 128000,
		description:
			"An instruction-following model by Meta, featuring 70 billion parameters for superior performance on structured tasks and guided responses.",
		company: "Meta",
	},
	"llama-3-8b-instruct": {
		contextLength: 128000,
		description:
			"A smaller variant of Meta's Llama 3, equipped with 8 billion parameters, optimized for instruction-based tasks.",
		company: "Meta",
	},
	"gemini-1.5": {
		contextLength: 2000000,
		description:
			"An advanced version of Google's Gemini, incorporating improvements in language understanding and generation capabilities for versatile applications.",
		company: "Google",
	},
	"gpt-3-turbo": {
		contextLength: 16368,
		description:
			"A streamlined version of GPT-3 by OpenAI, designed for efficient conversational AI tasks.",
		company: "OpenAI",
	},
	
	"gpt-4-turbo-202406": {
		contextLength: 128000,
		description:
			"A June 2024 release of GPT-4 Turbo by OpenAI, featuring advanced optimizations for language tasks and extended context.",
		company: "OpenAI",
	},
	
	"mixtral-8x22b-instruct": {
		contextLength: 64000,
		description:
			"An advanced large language model with a sparse Mixture-of-Experts architecture, featuring 141 billion parameters. Optimized for instruction-based tasks, it excels in reasoning, coding, and multilingual tasks.",
		company: "Mistral AI",
	},
	"command-r-plus": {
		contextLength: 128000,
		description:
			"An advanced language model optimized for command-line and programming tasks",
		company: "Cohere",
	},
	"command-r": {
		contextLength: 128000,
		description:
			"A language model designed for command-line interactions and programming assistance",
		company: "Cohere",
	},
	"mixtral-8x7b-instruct": {
		contextLength: 33000,
		description:
			"An instruction-tuned version of the Mixtral 8x7B model, optimized for following specific instructions",
		company: "Mistral AI",
	},
	"mistral-7b-instruct": {
		contextLength: 33000,
		description:
			"An instruction-tuned version of the Mistral 7B model, designed for better instruction following",
		company: "Mistral AI",
	},

	"codestral-2405": {
		contextLength: 33000,
		description:
			"A code-focused language model released in May 2024, optimized for programming tasks",
		company: "Mistral AI",
	},
	"gemini-1.5-flash-latest": {
		contextLength: 1000000,
		description:
			"The latest version of Google's Gemini 1.5 model, optimized for quick responses and low latency",
		company: "Google",
	},

	"llama-3.1-405b-instruct": {
		contextLength: undefined,
		description:
			"An instruction-tuned version of Llama 3.1 with 405 billion parameters, designed for complex language tasks",
		company: "Meta",
	},
	"llama-3.1-70b-instruct": {
		contextLength: undefined,
		description:
			"An instruction-tuned version of Llama 3.1 with 70 billion parameters, optimized for following specific instructions",
		company: "Meta",
	},
	"llama-3.1-8b-instruct": {
		contextLength: undefined,
		description:
			"A smaller, instruction-tuned version of Llama 3.1 with 8 billion parameters, suitable for efficient deployment",
		company: "Meta",
	},
	"mistral-large-2407": {
		contextLength: undefined,
		description:
			"An updated large-scale language model by Mistral, released in July 2024, with improved performance",
		company: "Mistral AI",
	},
	"claude-3.5-sonnet-20240620": {
		contextLength: undefined,
		description:
			"An updated version of Claude 3.5 Sonnet, released on June 20, 2024, with enhanced poetic and creative capabilities",
		company: "Anthropic",
	},
	"chatgpt-4o-latest": {
		contextLength: 128000,
		description:
			"GPT-4o is a multimodal model that processes text, audio, and images. It is faster and more efficient than previous models and offers capabilities such as enhanced real-time interactions, multilingual support, and advanced contextual understanding.",
		company: "OpenAI",
	},
	"gpt-4o-2024-08-06": {
		contextLength: 128000,
		description:
			"GPT-4o is a multimodal AI model that processes text, audio, and visual data, simplifying interactions across these formats and improving response quality.",
		company: "OpenAI",
	},
	"gpt-4o-2024-05-13": {
		contextLength: 128000,
		description:
			"GPT-4o is a multilingual, multimodal generative pre-trained transformer that can process and generate text, images, and audio. It achieves state-of-the-art results in voice, multilingual, and vision benchmarks.",
		company: "OpenAI",
	},
	"gpt-4o-mini-2024-07-18": {
		contextLength: 128000,
		description:
			"GPT-4o Mini is OpenAI's latest cost-efficient model designed to deliver advanced natural language processing and multimodal capabilities for diverse applications such as customer support chatbots and real-time text responses.",
		company: "OpenAI",
	},
	"gemini-1.5-pro-exp-0801": {
		contextLength: 2000000,
		description:
			"Gemini 1.5 Pro EXP 0801 is capable of processing diverse types of data, including text, audio, images, and video, with a breakthrough context length of 2 million tokens, enabling sophisticated reasoning tasks and enhanced long-context understanding.",
		company: "Google",
	},
	"gemini-1.5-pro": {
		contextLength: 2000000,
		description:
			"Gemini 1.5 Pro is a multimodal AI model developed by Google DeepMind that integrates text, image, and video processing, enabling it to process and reason over long documents and various data types effectively. It is designed to enhance performance in generative AI applications across multiple platforms.",
		company: "Google",
	},
	"gemini-1.5-flash": {
		contextLength: 1000000,
		description:
			"Lightweight, fast, and cost-efficient models featuring multimodal reasoning and a breakthrough long context window of up to one million tokens.",
		company: "Google",
	},
	"llama-3.2-90b-vision-instruct": {
		contextLength: 128000,
		description:
			"The Llama 3.2 90B Vision Instruct model is optimized for visual recognition, image reasoning, and captioning, capable of processing both text and images for advanced multimodal applications.",
		company: "Meta",
	},
	"llama-3.2-11b-vision-instruct": {
		contextLength: 128000,
		description:
			"Llama 3.2 11B Vision is a multimodal model designed to handle tasks combining visual and textual data, excelling in image captioning and visual question answering. It integrates visual understanding with language processing for high-accuracy image analysis in various applications, including content creation and customer service.",
		company: "Meta",
	},
	"llama-3.2-3b-instruct": {
		contextLength: 128000,
		description:
			"Llama 3.2 3B Instruct is a multilingual large language model optimized for instruction-following tasks, including dialogue generation, summarization, and agentic retrieval. It is trained on diverse datasets and demonstrates strong performance across various Natural Language Processing tasks.",
		company: "Meta",
	},
	"llama-3.2-1b-instruct": {
		contextLength: 128000,
		description:
			"Llama 3.2 1B Instruct is optimized for multilingual dialogue tasks, including agentic retrieval and summarization. It is designed for commercial and research use, supporting various languages.",
		company: "Meta",
	},

	"flux-1-pro": {
		contextLength: undefined,
		description:
			"An advanced image generation model based on the FLUX.1-dev architecture, designed to deliver higher quality outputs, improved efficiency, and better alignment with user prompts. It generates images quickly and accurately from textual descriptions, suitable for both artistic and commercial applications.",
		company: "Black Forest Labs",
	},
	"flux-1-dev": {
		contextLength: undefined,
		description:
			"FLUX.1 [dev] is an advanced image generation model that converts text descriptions into vivid images, excelling in prompt adherence and image quality, utilizing a 12 billion parameter architecture.",
		company: "Black Forest Labs",
	},
	"flux-1-schnell": {
		contextLength: undefined,
		description:
			"FLUX.1 [schnell] is an advanced text-to-image generation model featuring 12 billion parameters and utilizing a novel technique called latent adversarial diffusion distillation, excelling in rapid image generation and high-quality output.",
		company: "Black Forest Labs",
	},
	"stable-diffusion-3-large": {
		contextLength: undefined,
		description:
			"Stable Diffusion 3 (SD3) is an advanced text-to-image generation model that generates high-quality images from textual descriptions. It demonstrates superior performance in typography and prompt adherence compared to other state-of-the-art generation systems.",
		company: "Stability AI",
	},
	"midjourney": {
		contextLength: undefined,
		description:
			"Midjourney is a generative artificial intelligence tool designed to create images from text prompts, known for producing high-quality, detailed, and lifelike images.",
		company: "Midjourney, Inc.",
	},
	"dall-e-3": {
		contextLength: undefined,
		description:
			"DALL-E 3 is an advanced AI program developed by OpenAI that specializes in generating highly detailed and contextually accurate images from textual descriptions. This tool represents a significant leap forward in the field of artificial intelligence, particularly in the domain of creative and generative AI.",
		company: "OpenAI",
	},
	"playground-v2.5": {
		contextLength: undefined,
		description:
			"Playground v2.5 is a state-of-the-art open-source text-to-image generative model focusing on aesthetic quality, capable of generating highly aesthetic images at a resolution of 1024x1024 pixels.",
		company: "Playground",
	},
	sdxl: {
		contextLength: undefined,
		description:
			"SDXL is a latent diffusion model for text-to-image synthesis, designed to create highly realistic images, improve image generation quality, and provide various image manipulation capabilities like inpainting and image-to-image transitions.",
		company: "Stability AI",
	},
	"kandinsky-3.1": {
		contextLength: undefined,
		description:
			"Kandinsky 3.1 is a large-scale text-to-image generation model based on latent diffusion, designed to generate high-quality images from textual descriptions with enhanced realism and various useful features.",
		company: "AI-Forever",
	},
	"kandinsky-3": {
		contextLength: undefined,
		description:
			"Kandinsky 3.0 is an open-source text-to-image diffusion model that uses latent diffusion to generate high-quality images based on text prompts, improving upon its predecessors in text understanding and visual quality.",
		company: "Sber",
	},
	"kandinsky-2.2": {
		contextLength: undefined,
		description:
			"Kandinsky 2.2 is a multilingual text-to-image latent diffusion model that incorporates a new and powerful image encoder (CLIP-ViT-G) and the ControlNet mechanism, enabling improved control over image generation from text prompts.",
		company: "AI Forever",
	},
	"kandinsky-2": {
		contextLength: undefined,
		description:
			"The kandinsky-2 model excels at generating visually appealing, text-guided images across a wide range of subjects and styles, utilizing an improved image encoder and ControlNet mechanism.",
		company: "ai-forever",
	},
	"text-embedding-3-small": {
		contextLength: 8191,
		description:
			"OpenAI's text-embedding-3-small is a highly efficient model designed for natural language processing tasks, converting text into numerical representations for improved semantic understanding.",
		company: "OpenAI",
	},
	"text-embedding-3-large": {
		contextLength: 8192,
		description:
			"Text-embedding-3-large is a robust language model designed for generating high-dimensional text embeddings. These embeddings provide sophisticated numerical representations of text data and are optimized for a wide range of natural language processing (NLP) tasks including semantic search, text clustering, and classification. The model's large size ensures enhanced accuracy and depth of understanding, making it suitable for applications requiring high-quality text representation.",
		company: "OpenAI",
	},
	"text-embedding-ada-002": {
		contextLength: 8191,
		description:
			"A state-of-the-art embedding engine operating within a 1536-dimensional semantic space, designed to encode textual data efficiently for various applications including natural language processing and machine learning tasks.",
		company: "OpenAI",
	},
	"bge-large-en-v1.5": {
		contextLength: 512,
		description:
			"BGE-Large-EN-v1.5 is an advanced language model that provides rich, contextual embeddings for English text, enhancing tasks like sentiment analysis, text classification, and semantic search.",
		company: "Beijing Academy of Artificial Intelligence",
	},
	"text-moderation-latest": {
		contextLength: 32768,
		description:
			"OpenAI's text moderation model assesses text for potentially harmful content, categorizing it into various sensitivity types, such as hate speech, self-harm, and violence.",
		company: "OpenAI",
	},
	"text-moderation-stable": {
		contextLength: 32768,
		description:
			"A fine-tuned model that can detect whether text may be sensitive or unsafe, designed to check compliance with OpenAI's usage policies across various content categories.",
		company: "OpenAI",
	},
	"whisper-large": {
		contextLength: undefined,
		description:
			"Whisper is a pre-trained model for automatic speech recognition (ASR) and speech translation, trained on 680,000 hours of labeled data. It demonstrates strong abilities to generalize to various datasets and domains without fine-tuning.",
		company: "OpenAI",
	},

	"eleven-multilingual-v2": {
		contextLength: undefined,
		description:
			"An updated version of Eleven Labs' multilingual text-to-speech model, offering improved voice synthesis across multiple languages.",
		company: "Eleven Labs",
	},
	"eleven-multilingual-v1": {
		contextLength: undefined,
		description:
			"The first version of Eleven Labs' multilingual text-to-speech model, supporting voice synthesis in various languages.",
		company: "Eleven Labs",
	},
	"eleven-turbo-v2": {
		contextLength: undefined,
		description:
			"A fast text-to-speech model by Eleven Labs, optimized for quick voice generation while maintaining high quality.",
		company: "Eleven Labs",
	},
	"eleven-monolingual-v1": {
		contextLength: undefined,
		description:
			"A single-language text-to-speech model by Eleven Labs, focused on high-quality voice synthesis for a specific language.",
		company: "Eleven Labs",
	},
};

// Helper function to get additional info
const getAdditionalInfo = (modelId: string) => {
	const lowercaseId = modelId.toLowerCase();
	return (
		modelAdditionalInfo[lowercaseId] || {
			contextLength: 0,
			description: "No description available",
			company: "Unknown",
		}
	);
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
							modelType: modelTypeMap[model.id.toLowerCase()] || "Unknown",
							contextLength: additionalInfo.contextLength,
							description: additionalInfo.description,
							company: additionalInfo.company,
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
	}),
});

// Update the exported hooks
export const { useGetModelsQuery, useGetTotalModelsQuery } = modelsApi;