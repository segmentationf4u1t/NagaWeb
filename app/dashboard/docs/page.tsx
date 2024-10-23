import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type React from "react";

type EndpointType = {
	url: string;
	description: string;
};

const NagaEndpoints: EndpointType[] = [
	{ url: "https://api.naga.ac/v1/", description: "Base URL" },
	{ url: "https://api.naga.ac/docs", description: "API Documentation" },
	{ url: "https://api.naga.ac/v1/models", description: "Available Models" },
	{ url: "https://api.naga.ac/v1/limits", description: "API Limits" },
	{ url: "https://api.naga.ac/v1/embeddings", description: "Embeddings" },
	{
		url: "https://api.naga.ac/v1/moderations",
		description: "Content Moderation",
	},
	{
		url: "https://api.naga.ac/v1/chat/tokenizer",
		description: "Chat Tokenizer",
	},
	{
		url: "https://api.naga.ac/v1/chat/completions",
		description: "Chat Completions",
	},
	{
		url: "https://api.naga.ac/v1/image/generations",
		description: "Image Generation",
	},
	{
		url: "https://api.naga.ac/v1/audio/translations",
		description: "Audio Translation",
	},
	{
		url: "https://api.naga.ac/v1/audio/tts/generation",
		description: "Text-to-Speech",
	},
	{
		url: "https://api.naga.ac/v1/audio/transcriptions",
		description: "Audio Transcription",
	},
];

const Documentation: React.FC = () => {
	return (
		<div className="mx-auto p-6">
			<h1 className="text-4xl font-bold mb-8">Naga API Documentation</h1>

			<Tabs defaultValue="overview" className="mb-8">
				<TabsList>
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="usage">Usage</TabsTrigger>
					<TabsTrigger value="endpoints">Endpoints</TabsTrigger>
				</TabsList>

				<TabsContent value="overview">
					<Card>
						<CardHeader>
							<CardTitle>Overview</CardTitle>
							<CardDescription>Introduction to Naga API</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="mb-4">
								Naga API provides a seamless integration with OpenAI-compatible
								projects. It offers various endpoints for AI-powered
								functionalities such as chat completions, image generation, and
								audio processing.
							</p>
							<Button asChild>
								<a
									href="https://api.naga.ac/docs"
									target="_blank"
									rel="noopener noreferrer"
								>
									View Full Documentation
								</a>
							</Button>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="usage">
					<Card>
						<CardHeader>
							<CardTitle>Usage</CardTitle>
							<CardDescription>How to use Naga API</CardDescription>
						</CardHeader>
						<CardContent>
							<h3 className="text-xl font-semibold mb-2">
								Setting up environment variables
							</h3>
							<pre className="bg-neutral-900 p-4 rounded-md mb-4">
								<code>
									{`export OPENAI_API_KEY=YourNagaKeyGoesHere
export OPENAI_BASE_URL=https://api.naga.ac/v1`}
								</code>
							</pre>
							<p className="mb-4">For Windows (NT) users:</p>
							<pre className="bg-neutral-900 p-4 rounded-md mb-4">
								<code>
									{`$env:OPENAI_API_KEY=YourNagaKeyGoesHere
$env:OPENAI_BASE_URL=https://api.naga.ac/v1`}
								</code>
							</pre>
							<p className="mb-4">
								You can also source these variables in your shell startup files
								(Unix only):
							</p>
							<pre className="bg-neutral-900 p-4 rounded-md">
								<code>
									curl
									https://raw.githubusercontent.com/segmentationf4u1t/NagaWeb/main/sourcemeUnix.txt
									`{">"} ~/.bashrc
								</code>
							</pre>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="endpoints">
					<Card>
						<CardHeader>
							<CardTitle>Endpoints</CardTitle>
							<CardDescription>Available Naga API endpoints</CardDescription>
						</CardHeader>
						<CardContent>
							<ul className="space-y-2">
								{NagaEndpoints.map((endpoint) => (
									<li key={endpoint.url} className="flex items-center">
										<span className="font-semibold mr-2">
											{endpoint.description}:
										</span>
										<a
											href={endpoint.url}
											target="_blank"
											rel="noopener noreferrer"
											className="text-blue-500 hover:underline"
										>
											{endpoint.url}
										</a>
									</li>
								))}
							</ul>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			<Card>
				<CardHeader>
					<CardTitle>Additional Resources</CardTitle>
				</CardHeader>
				<CardContent>
					<ul className="list-disc list-inside space-y-2">
						<li>
							<a
								href="https://developer.mozilla.org/en-US/"
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-500 hover:underline"
							>
								Mozilla Developer Network (MDN)
							</a>
						</li>
						<li>
							<a
								href="https://platform.openai.com/docs/introduction"
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-500 hover:underline"
							>
								OpenAI API Documentation
							</a>
						</li>
						<li>
							<a
								href="https://www.freecodecamp.org/news/python-fundamentals-for-data-science/"
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-500 hover:underline"
							>
								Python Fundamentals for Data Science
							</a>
						</li>
					</ul>
				</CardContent>
			</Card>
		</div>
	);
};

export default Documentation;
