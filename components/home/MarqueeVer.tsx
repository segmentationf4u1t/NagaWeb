"use client";

import Marquee from "@/components/ui/marquee";
import { getAdditionalInfo, useGetModelsQuery} from "@/lib/api/modelsApi";
import type { Model } from '@/types/models';
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
	maxOutput?: number;
	trainingCutoff?: string;
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
	maxOutput,
	trainingCutoff,
}: LLMInfoProps) {
	const formatTokenCost = (cost: number | undefined): string => {
		return cost !== undefined ? `$${(cost * 1000000).toFixed(2)}` : "N/A";
	};

	return (
		<Card className="w-full max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg">
			<CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-2">
				<div>
					<CardTitle className="text-lg sm:text-xl md:text-2xl font-bold">{name}</CardTitle>
					<p className="text-xs sm:text-sm text-muted-foreground mt-1">{modelType}</p>
				</div>
				<Avatar className="h-10 w-10 sm:h-12 sm:w-12">
					<AvatarImage src={`/logos/${companyLogo.toLowerCase()}.svg`} alt={`${company} logo`} />
					<AvatarFallback>{company[0]}</AvatarFallback>
				</Avatar>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col gap-3">
					<p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3">
						{description || "No description available"}
					</p>
					
					<Separator />
					
					<div className="grid grid-cols-2 gap-4">
						<div className="flex flex-col">
							<span className="text-xs sm:text-sm font-medium text-muted-foreground">
								Context Length
							</span>
							<span className="text-sm sm:text-base font-semibold">
								{contextLength
									? `${contextLength >= 1000000
										? `${(contextLength / 1000000).toFixed(1)}M`
										: contextLength >= 1000
											? `${Math.round(contextLength / 1000)}K`
											: contextLength.toLocaleString()} tokens`
									: "N/A"}
							</span>
						</div>
						<div className="flex flex-col items-end">
							<span className="text-xs sm:text-sm font-medium text-muted-foreground">
								Max Output
							</span>
							<span className="text-sm sm:text-base font-semibold">
								{maxOutput
									? `${maxOutput >= 1000
										? `${Math.round(maxOutput / 1000)}K`
										: maxOutput.toLocaleString()} tokens`
									: "N/A"}
							</span>
						</div>
					</div>
					
					
					
					<div className="flex flex-col sm:flex-row justify-between gap-3">
						<div className="flex flex-col">
							<span className="text-xs sm:text-sm font-medium text-muted-foreground">
								Training Cutoff
							</span>
							<span className="text-sm sm:text-base">
								{trainingCutoff || "N/A"}
							</span>
						</div>
						<div className="flex flex-col items-start sm:items-end">
							<span className="text-xs sm:text-sm font-medium text-muted-foreground">
								Pricing
							</span>
							<div className="flex flex-col items-start sm:items-end">
								<span className="text-xs sm:text-sm">
									Input: {formatTokenCost(inputTokenCost)}
								</span>
								<span className="text-xs sm:text-sm">
									Output: {formatTokenCost(outputTokenCost)}
								</span>
							</div>
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
	if (!models?.length) return <div>No models available</div>;

	const modelArray = models || [];
	

	const quarterLength = Math.ceil(modelArray.length / 4);
	const firstRow = modelArray.slice(0, quarterLength);
	const secondRow = modelArray.slice(quarterLength, 2 * quarterLength);
	const thirdRow = modelArray.slice(2 * quarterLength, 3 * quarterLength);
	const fourthRow = modelArray.slice(3 * quarterLength);

	const mapModelToLLMInfo = (model: Model): LLMInfoProps => {
		const additionalInfo = getAdditionalInfo(model.id);
		return {
			id: model.id,
			name: model.id,
			company: additionalInfo.company,
			companyLogo: additionalInfo.company.toLowerCase(),
			modelType: additionalInfo.type,
			description: additionalInfo.description,
			contextLength: additionalInfo.contextLength,
			inputTokenCost: model.pricing?.per_input_token
				? Number.parseFloat(model.pricing.per_input_token)
				: undefined,
			outputTokenCost: model.pricing?.per_output_token
				? Number.parseFloat(model.pricing.per_output_token)
				: undefined,
			maxOutput: additionalInfo.maxOutput,
			trainingCutoff: additionalInfo.trainingCutoff,
		};
	};

	return (
		<div>
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
			<p className="text-left text-sm text-muted-foreground mt-2">
				* Pricing is determined based on the input and output of 1 million tokens.
			</p>
		</div>
	);
}
