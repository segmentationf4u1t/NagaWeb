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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
} from "@/components/ui/dialog";

interface ApiKey {
	id: string;
	key: string;
	name: string;
	createdAt: Date;
	expiresAt?: Date;
	lastUsed: Date;
	fundLimit?: number;
}

export default function ApiKeyGenerator() {
	const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [newKeyName, setNewKeyName] = useState("");
	const [newKeyExpiration, setNewKeyExpiration] = useState<Date | undefined>();
	const [newKeyFundLimit, setNewKeyFundLimit] = useState<number | undefined>();

	const generateApiKey = () => {
		const newKey =
			Math.random().toString(36).substring(2, 15) +
			Math.random().toString(36).substring(2, 15);
		const newApiKey: ApiKey = {
			id: Date.now().toString(),
			key: newKey,
			name: newKeyName,
			createdAt: new Date(),
			expiresAt: newKeyExpiration,
			lastUsed: new Date(
				Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000,
			), // Random date within last 30 days
		};
		setApiKeys([...apiKeys, newApiKey]);
		setIsModalOpen(false);
		setNewKeyName("");
		setNewKeyExpiration(undefined);
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
								<p className="font-bold text-sm">{apiKey.name}</p>
								<p className="font-mono text-sm">
									{apiKey.key.substring(0, 10)}...
									{apiKey.key.substring(apiKey.key.length - 5)}
								</p>
								<p className="text-xs text-muted-foreground">
									Created: {apiKey.createdAt.toLocaleString()}
								</p>
								{apiKey.expiresAt && (
									<p className="text-xs text-muted-foreground">
										Expires: {apiKey.expiresAt.toLocaleString()}
									</p>
								)}
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
				<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
					<DialogTrigger asChild>
						<Button className="w-full" disabled={apiKeys.length >= 3}>
							<RefreshCw className="mr-2 h-4 w-4" />
							Generate New Key
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Generate API Key</DialogTitle>
							<DialogDescription>
								Provide a name and optional expiration date for your new API
								key.
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="name" className="text-right">
									Name
								</Label>
								<Input
									id="name"
									value={newKeyName}
									onChange={(e) => setNewKeyName(e.target.value)}
									className="col-span-3"
								/>
							</div>
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="expiresAt" className="text-right">
									Expires At
								</Label>
								<Input
									id="expiresAt"
									type="date"
									value={
										newKeyExpiration
											? newKeyExpiration.toISOString().split("T")[0]
											: ""
									}
									onChange={(e) =>
										setNewKeyExpiration(
											e.target.value ? new Date(e.target.value) : undefined,
										)
									}
									className="col-span-3"
								/>
							</div>
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="fundLimit" className="text-right">
									Fund Limit
								</Label>
								<Input
									id="fundLimit"
									type="number"
									value={newKeyFundLimit ?? ""}
									onChange={(e) =>
										setNewKeyFundLimit(
											e.target.value ? parseFloat(e.target.value) : undefined,
										)
									}
									className="col-span-3"
								/>
							</div>
						</div>
						<DialogFooter>
							<DialogClose asChild>
								<Button type="button" variant="secondary">
									Cancel
								</Button>
							</DialogClose>
							<Button type="button" onClick={generateApiKey}>
								Generate
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</CardFooter>
		</Card>
	);
}
