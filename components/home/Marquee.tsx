import Marquee from "@/components/ui/marquee";
import ModelCard from "./modelCard";
import { useGetModelsQuery } from "@/lib/api/modelsApi";

export default function MarqueeDemo() {
	const { data: models, isLoading, error } = useGetModelsQuery();

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error loading models</div>;
	}

	// Filter models to include only Text, Image, Embedding, and Audio types
	const filteredModels =
		models?.filter((model) =>
			["Text", "Image", "Embedding", "Audio", "Multimodal"].includes(
				model.modelType,
			),
		) || [];

	// Shuffle the filtered models to mix different types
	const shuffledModels = [...filteredModels].sort(() => Math.random() - 0.5);

	// Split shuffled models into two groups
	const midpoint = Math.ceil(shuffledModels.length / 2);
	const firstRow = shuffledModels.slice(0, midpoint);
	const secondRow = shuffledModels.slice(midpoint);
	
	return (
		<div className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
			
			<Marquee pauseOnHover className="[--duration:120s]">
				{firstRow.map((model) => (
					<ModelCard
						key={model.id}
						companyName={model.id.split("-")[0]}
						modelName={model.id}
						inputPrice={model.pricing?.per_input_token || "0"}
						perImagePrice={model.pricing?.per_image || "0"}
						perTokenPrice={model.pricing?.per_token || "0"}
						perCharacterPrice={model.pricing?.per_character || "0"}
						outputPrice={model.pricing?.per_output_token || "0"}
						category={model.modelType}
						logoUrl={`logos/${model.id.split("-")[0]}.svg`}
					/>
				))}
			</Marquee>
			<Marquee pauseOnHover className="[--duration:120s]" reverse>
				{secondRow.map((model) => (
					<ModelCard
						key={model.id}
						companyName={model.id.split("-")[0]}
						modelName={model.id}
						inputPrice={model.pricing?.per_input_token || "0"}
						perImagePrice={model.pricing?.per_image || "0"}
						perTokenPrice={model.pricing?.per_token || "0"}
						perCharacterPrice={model.pricing?.per_character || "0"}
						outputPrice={model.pricing?.per_output_token || "0"}
						category={model.modelType}
						logoUrl={`logos/${model.id.split("-")[0]}.svg`}
					/>
				))}
			</Marquee>
			
		</div>
	);
}
