"use client"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { useGetTotalModelsQuery } from "@/lib/api/modelsApi"

export default function FeaturesTwo() {
	const { data: totalModels, isLoading, error } = useGetTotalModelsQuery();

	const features = [
		{
			id: 0,
			title: "Disneyland of Models",
			description: "Extensive AI Model Selection",
			content: () => (
				<>
					We offer access to over{' '}
					{error ? (
						'many'
					) : isLoading ? (
						'...'
					) : (
						<span className='font-bold'>{totalModels}</span>
					)}{' '}
					models through our API, providing unparalleled variety and flexibility for your needs.
				</>
			),
		},
		{	
			id: 1,
			title: "Comprehensive Services",
			description: "One-Stop AI Solution",
			content: "Our comprehensive AI suite covers everything from text and image generation to audio processing, embeddings, and content moderation.",
		},
		{
			id: 2,
			title: "OG's in Business",
			description: "Ruling The Scene Since Day Zero",
			content: "We've seen 'em come and watch 'em go, watched 'em rise witnessed it, and wonder where they've gone now.",
		},
		{
			id: 3,
			title: "Designed for everyone",
			description: "Even Apes Could Use It",
			content: "Built for developers, businesses, and visionaries seeking to push the limits of AI.",
		},
		{
			id: 4,
			title: "Seamless Integration",
			description: "1.. 2.. 3.. We're in",
			content: "Works everywhere OpenAI libraries do, with no changes needed.",
		},
		{
			id: 5,
			title: "Unmatched Affordability",
			description: "We're cheaper than the cheapest",
			content: "Access proprietary models at 4x cheaper rates without compromising on quality.",
		},
	];
	
	return (
		<div className="my-6">
			<h1 className="my-4 md:my-6 text-pretty text-3xl md:text-4xl font-bold lg:text-6xl text-foreground">Insane that we're this good.</h1>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 bg-background">
				{features.map((feature) => (
					<Card key={feature.id} className="bg-neutral-900 hover:bg-card/80 transition-colors">
						<CardHeader className="space-y-0.5">
							<div className="flex items-center space-x-2">
								<div>
									<CardTitle className="text-xl font-bold text-primary">
										{feature.title}
									</CardTitle>
									<CardDescription>{feature.description}</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">
								{typeof feature.content === 'function' ? feature.content() : feature.content}
							</p>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
