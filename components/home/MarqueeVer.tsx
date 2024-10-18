"use client";

import Marquee from "@/components/ui/marquee";
import { useGetModelsQuery,type Model } from "@/lib/api/modelsApi";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface LLMInfoProps {
	id: string;
	name: string;
	company: string;
	companyLogo: string;
	modelType: string;

	description?: string;
	contextLength?: number;
	inputTokenCost?: number;
	outputTokenCost?: number;
}

export default function LlmCard({
	name,
	company,
	companyLogo,
	modelType,
	description,
	contextLength,
	inputTokenCost,
	outputTokenCost,
}: LLMInfoProps) {
	const formatTokenCost = (cost: number | undefined): string => {
		return cost !== undefined ? `$${(cost * 1000).toFixed(6)}` : "N/A";
	};

	return (
		<Card className="w-full max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg">
			<CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-2">
				<div>
					<CardTitle className="text-lg sm:text-xl md:text-2xl font-bold">{name}</CardTitle>
					<p className="text-xs sm:text-sm text-muted-foreground mt-1">{modelType}</p>
				</div>
				<Avatar className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12">
					<AvatarImage src={`/logos/${companyLogo.toLowerCase()}.svg`} alt={`${company} logo`} />
					<AvatarFallback>{company[0]}</AvatarFallback>
				</Avatar>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col gap-2 sm:gap-3">
					<p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3">
						{description || "No description available"}
					</p>
					<Separator />
					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
						<div className="flex flex-col">
							<span className="text-xs sm:text-sm font-medium">Context Length</span>
							<span className="text-sm sm:text-md font-bold">
								{contextLength
									? `${contextLength >= 1000000
										? `${(contextLength / 1000000).toFixed(1)}M`
										: contextLength >= 1000
											? `${Math.round(contextLength / 1000)}K`
											: contextLength.toLocaleString()} tokens`
									: "N/A"}
							</span>
						</div>
						<div className="flex flex-col items-start sm:items-end mt-2 sm:mt-0">
							<span className="text-xs sm:text-sm">
								Input: {formatTokenCost(inputTokenCost)}
							</span>
							<span className="text-xs sm:text-sm">
								Output: {formatTokenCost(outputTokenCost)}
							</span>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export function MarqueeVertical() {
	const { data: models, isLoading, error } = useGetModelsQuery();

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Error loading models</div>;

	const modelArray = models || [];
	const filteredModels = modelArray.filter(model => model.contextLength);
	const quarterLength = Math.ceil(filteredModels.length / 4);
	const firstRow = filteredModels.slice(0, quarterLength);
	const secondRow = filteredModels.slice(quarterLength, 2 * quarterLength);
	const thirdRow = filteredModels.slice(2 * quarterLength, 3 * quarterLength);
	const fourthRow = filteredModels.slice(3 * quarterLength);

	const mapModelToLLMInfo = (model: Model): LLMInfoProps => ({
		id: model.id,
		name: model.id,
		company: model.company,
		companyLogo: model.company.toLowerCase(),
		modelType: model.modelType,
		description: model.description,
		contextLength: model.contextLength || undefined,
		inputTokenCost: model.pricing?.per_input_token
			? Number.parseFloat(model.pricing.per_input_token)
			: undefined,
		outputTokenCost: model.pricing?.per_output_token
			? Number.parseFloat(model.pricing.per_output_token)
			: undefined,
	});

	return (
		<div className="relative flex h-[500px] w-full flex-row items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
			<Marquee pauseOnHover vertical className="[--duration:60s] w-1/4 px-2">
				{firstRow.map((model) => (
					<LlmCard key={model.id} {...mapModelToLLMInfo(model)} />
				))}
			</Marquee>
			<Marquee
				reverse
				pauseOnHover
				vertical
				className="[--duration:60s] w-1/4 px-2"
			>
				{secondRow.map((model) => (
					<LlmCard key={model.id} {...mapModelToLLMInfo(model)} />
				))}
			</Marquee>
			<Marquee pauseOnHover vertical className="[--duration:60s] w-1/4 px-2">
				{thirdRow.map((model) => (
					<LlmCard key={model.id} {...mapModelToLLMInfo(model)} />
				))}
			</Marquee>
			<Marquee
				reverse
				pauseOnHover
				vertical
				className="[--duration:60s] w-1/4 px-2"
			>
				{fourthRow.map((model) => (
					<LlmCard key={model.id} {...mapModelToLLMInfo(model)} />
				))}
			</Marquee>
			<div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white dark:from-background" />
			<div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white dark:from-background" />
		</div>
	);
}
