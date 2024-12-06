"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Copy, RefreshCw, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ApiKey {
	id: string;
	key: string;
	createdAt: Date;
	lastUsed: Date;
}

export default function ApiKeyGenerator() {
	const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);

	const generateApiKey = () => {
		if (apiKeys.length >= 3) {
			alert("You can only have a maximum of 3 API keys.");
			return;
		}

		const newKey =
			Math.random().toString(36).substring(2, 15) +
			Math.random().toString(36).substring(2, 15);
		const newApiKey: ApiKey = {
			id: Date.now().toString(),
			key: newKey,
			createdAt: new Date(),
			lastUsed: new Date(
				Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000,
			), // Random date within last 30 days
		};
		setApiKeys([...apiKeys, newApiKey]);
	};

	const copyToClipboard = (key: string) => {
		navigator.clipboard.writeText(key);
	};

	const revokeKey = (id: string) => {
		setApiKeys(apiKeys.filter((key) => key.id !== id));
	};

	const simulateKeyUsage = (id: string) => {
		setApiKeys(
			apiKeys.map((key) =>
				key.id === id ? { ...key, lastUsed: new Date() } : key,
			),
		);
	};

	return (
		<Card className="bg-card">
			<CardHeader>
				<CardTitle>API Keys</CardTitle>
				<CardDescription>Generate and manage your API keys</CardDescription>
			</CardHeader>
			<CardContent>
				<ScrollArea className="h-[200px] w-full rounded-md border">
					{apiKeys.map((apiKey) => (
						<div
							key={apiKey.id}
							className="flex items-center justify-between p-4 border-b last:border-b-0"
						>
							<div>
								<p className="font-mono text-sm">
									{apiKey.key.substring(0, 10)}...
									{apiKey.key.substring(apiKey.key.length - 5)}
								</p>
								<p className="text-xs text-muted-foreground">
									Created: {apiKey.createdAt.toLocaleString()}
								</p>
								<p className="text-xs text-muted-foreground">
									Last Used: {apiKey.lastUsed.toLocaleString()}
								</p>
							</div>
							<div className="flex space-x-2">
								<Button
									size="icon"
									variant="outline"
									onClick={() => copyToClipboard(apiKey.key)}
								>
									<Copy className="h-4 w-4" />
								</Button>
								<Button
									size="icon"
									variant="outline"
									onClick={() => simulateKeyUsage(apiKey.id)}
								>
									<RefreshCw className="h-4 w-4" />
								</Button>
								<Button
									size="icon"
									variant="outline"
									onClick={() => revokeKey(apiKey.id)}
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</div>
						</div>
					))}
				</ScrollArea>
			</CardContent>
			<CardFooter>
				<Button
					onClick={generateApiKey}
					className="w-full"
					disabled={apiKeys.length >= 3}
				>
					<RefreshCw className="mr-2 h-4 w-4" />
					Generate New Key
				</Button>
			</CardFooter>
		</Card>
	);
}
