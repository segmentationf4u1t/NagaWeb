"use client";

import { useMemo, memo, Component, type ReactNode } from "react";
import Marquee from "@/components/ui/marquee";
import { getAdditionalInfo, useGetModelsQuery } from "@/lib/api/modelsApi";
import type { Model } from "@/types/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

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

// Memoized card component to prevent unnecessary re-renders
const LlmCard = memo(function LlmCard({
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
	const formatTokenCost = useMemo(
		() =>
			(cost: number | undefined): string => {
				return cost !== undefined ? `$${(cost * 1000000).toFixed(2)}` : "N/A";
			},
		[],
	);

	const formattedContextLength = useMemo(() => {
		if (!contextLength) return "N/A";
		if (contextLength >= 1000000)
			return `${(contextLength / 1000000).toFixed(1)}M tokens`;
		if (contextLength >= 1000) {
			const formattedNumber = contextLength.toLocaleString("en-US");
			return `${formattedNumber} tokens`;
		}
		return `${contextLength.toLocaleString("en-US")} tokens`;
	}, [contextLength]);

	const formattedMaxOutput = useMemo(() => {
		if (!maxOutput) return "N/A";
		if (maxOutput >= 1000) {
			const formattedNumber = maxOutput.toLocaleString("en-US");
			return `${formattedNumber} tokens`;
		}
		return `${maxOutput.toLocaleString("en-US")} tokens`;
	}, [maxOutput]);

	// Sanitize company logo path
	const sanitizedLogoPath = useMemo(() => {
		return companyLogo.toLowerCase().replace(/[^a-z0-9-]/g, "");
	}, [companyLogo]);

	return (
		<Card className="w-full max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg">
			<CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-2">
				<div>
					<CardTitle className="text-lg sm:text-xl md:text-2xl font-bold">
						{name}
					</CardTitle>
					<p className="text-xs sm:text-sm text-muted-foreground mt-1">
						{modelType}
					</p>
				</div>
				<Avatar className="h-10 w-10 sm:h-12 sm:w-12">
					<AvatarImage
						src={`/logos/${sanitizedLogoPath}.svg`}
						alt={`${company} logo`}
					/>
					<AvatarFallback>{company?.[0] ?? "N/A"}</AvatarFallback>
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
								{formattedContextLength}
							</span>
						</div>
						<div className="flex flex-col items-end">
							<span className="text-xs sm:text-sm font-medium text-muted-foreground">
								Max Output
							</span>
							<span className="text-sm sm:text-base font-semibold">
								{formattedMaxOutput}
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
});

// Custom error boundary implementation
class ErrorBoundary extends Component<
	{ children: ReactNode; fallback: (error: Error) => ReactNode },
	{ hasError: boolean; error: Error | null }
> {
	constructor(props: {
		children: ReactNode;
		fallback: (error: Error) => ReactNode;
	}) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error) {
		return { hasError: true, error };
	}

	render() {
		if (this.state.hasError && this.state.error) {
			return this.props.fallback(this.state.error);
		}
		return this.props.children;
	}
}

const LoadingSpinner = () => (
	<div className="flex items-center justify-center h-[500px]">
		<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
	</div>
);

const SkeletonCard = () => (
	<Card className="w-full max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg">
		<CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-2">
			<div className="space-y-2">
				<Skeleton className="h-6 w-32" />
				<Skeleton className="h-4 w-24" />
			</div>
			<Skeleton className="h-12 w-12 rounded-full" />
		</CardHeader>
		<CardContent>
			<div className="flex flex-col gap-3">
				<Skeleton className="h-16 w-full" />
				<Separator />
				<div className="grid grid-cols-2 gap-4">
					<div className="flex flex-col gap-2">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-5 w-20" />
					</div>
					<div className="flex flex-col items-end gap-2">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-5 w-20" />
					</div>
				</div>
				<div className="flex flex-col sm:flex-row justify-between gap-3">
					<div className="flex flex-col gap-2">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-5 w-28" />
					</div>
					<div className="flex flex-col items-start sm:items-end gap-2">
						<Skeleton className="h-4 w-16" />
						<div className="flex flex-col gap-1">
							<Skeleton className="h-4 w-20" />
							<Skeleton className="h-4 w-20" />
						</div>
					</div>
				</div>
			</div>
		</CardContent>
	</Card>
);

const SkeletonMarquee = () => {
	const columns = ["col1", "col2", "col3", "col4"];
	const skeletonCards = ["card1", "card2", "card3", "card4"];

	return (
		<div className="relative flex h-[500px] w-full flex-row items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
			{columns.map((colId) => (
				<div key={colId} className="w-1/4 px-2 space-y-4">
					{skeletonCards.map((cardId) => (
						<SkeletonCard key={`${colId}-${cardId}`} />
					))}
				</div>
			))}
			<div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white dark:from-background" />
			<div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white dark:from-background" />
		</div>
	);
};

export function MarqueeVertical() {
	const { data: models, isLoading, error } = useGetModelsQuery();

	const { firstRow, secondRow, thirdRow, fourthRow } = useMemo(() => {
		if (!models?.length)
			return { firstRow: [], secondRow: [], thirdRow: [], fourthRow: [] };

		// Filter models to only include Text and Multimodal types
		const filteredModels = models.filter((model) => {
			const additionalInfo = getAdditionalInfo(model.id);
			return ["Text", "Multimodal"].includes(additionalInfo?.type ?? "");
		});

		const modelArray = [...filteredModels];
		const quarterLength = Math.ceil(modelArray.length / 4);

		return {
			firstRow: modelArray.slice(0, quarterLength),
			secondRow: modelArray.slice(quarterLength, 2 * quarterLength),
			thirdRow: modelArray.slice(2 * quarterLength, 3 * quarterLength),
			fourthRow: modelArray.slice(3 * quarterLength),
		};
	}, [models]);

	const mapModelToLLMInfo = useMemo(
		() =>
			(model: Model): LLMInfoProps => {
				const additionalInfo = getAdditionalInfo(model.id);
				return {
					id: model.id,
					name: model.id,
					company: additionalInfo?.company ?? "Unknown",
					companyLogo: additionalInfo?.company?.toLowerCase() ?? "unknown",
					modelType: additionalInfo?.type ?? "Unknown",
					description: additionalInfo?.description,
					contextLength: additionalInfo?.contextLength,
					inputTokenCost: model.pricing?.per_input_token
						? Number.parseFloat(model.pricing.per_input_token)
						: undefined,
					outputTokenCost: model.pricing?.per_output_token
						? Number.parseFloat(model.pricing.per_output_token)
						: undefined,
					maxOutput: additionalInfo?.maxOutput,
					trainingCutoff: additionalInfo?.trainingCutoff,
				};
			},
		[],
	);

	if (isLoading) return <SkeletonMarquee />;
	if (error)
		return (
			<>
				<div className="flex items-center justify-center h-[500px] text-red-500">
					<SkeletonMarquee />
				</div>
				<p>Error loading models, MITIGATED</p>
			</>
		);
	if (!models?.length)
		return (
			<div className="flex items-center justify-center h-[500px] text-muted-foreground">
				<p className="text-xl">No models available</p>
			</div>
		);

	return (
		<ErrorBoundary
			fallback={(error: Error) => (
				<div className="text-red-500 p-4">
					<p>Something went wrong:</p>
					<pre>{error.message}</pre>
				</div>
			)}
		>
			<div>
				<div className="relative flex h-[500px] w-full flex-row items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
					<Marquee
						pauseOnHover
						vertical
						className="[--duration:60s] w-1/4 px-2"
					>
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
					<Marquee
						pauseOnHover
						vertical
						className="[--duration:60s] w-1/4 px-2"
					>
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
					* Pricing is determined based on the input and output of 1 million
					tokens.
				</p>
			</div>
		</ErrorBoundary>
	);
}
