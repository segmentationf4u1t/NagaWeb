"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardDescription,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { CalendarIcon, Trash2Icon, Settings } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ApiKey {
	id: string;
	name: string;
	key: string;
	expirationDate?: Date;
	fundLimit?: number;
	lastUsed: Date;
}

export default function ApiKeyGenerator() {
	const [name, setName] = useState("");
	const [expirationDate, setExpirationDate] = useState<Date>();
	const [fundLimit, setFundLimit] = useState("");
	const [open, setOpen] = useState(false);
	const [editKey, setEditKey] = useState<ApiKey | null>(null);
	const [apiKeys, setApiKeys] = useState<ApiKey[]>([
		{
			id: "1",
			name: "Test Key 1",
			key: "api_123456",
			expirationDate: new Date("2023-12-31"),
			fundLimit: 1000,
			lastUsed: new Date("2023-06-15"),
		},
		{
			id: "2",
			name: "Test Key 2",
			key: "api_789012",
			fundLimit: 500,
			lastUsed: new Date("2023-06-10"),
		},
	]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (editKey) {
			// Update existing key
			setApiKeys(
				apiKeys.map((key) =>
					key.id === editKey.id
						? {
								...key,
								name,
								expirationDate,
								fundLimit: fundLimit ? parseFloat(fundLimit) : undefined,
							}
						: key,
				),
			);
			setEditKey(null);
		} else {
			// Create new key
			const newKey: ApiKey = {
				id: Date.now().toString(),
				name,
				key: "api_" + Math.random().toString(36).substr(2, 9),
				expirationDate,
				fundLimit: fundLimit ? parseFloat(fundLimit) : undefined,
				lastUsed: new Date(),
			};
			setApiKeys([...apiKeys, newKey]);
		}
		setOpen(false);
		resetForm();
	};

	const handleRevoke = (id: string) => {
		setApiKeys(apiKeys.filter((key) => key.id !== id));
	};

	const handleEdit = (apiKey: ApiKey) => {
		setName(apiKey.name);
		setExpirationDate(apiKey.expirationDate);
		setFundLimit(apiKey.fundLimit ? apiKey.fundLimit.toString() : "");
		setEditKey(apiKey);
		setOpen(true);
	};

	const resetForm = () => {
		setName("");
		setExpirationDate(undefined);
		setFundLimit("");
	};

	return (
		<Card className="w-full bg-background text-foreground">
			<CardHeader>
				<CardTitle>API Key Management</CardTitle>
				<CardDescription>
					Manage your API keys, extend their expriations or remove them!
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-6">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="text-left">Name</TableHead>
								<TableHead className="text-left">Expiration</TableHead>
								<TableHead className="text-left">Fund Limit</TableHead>
								<TableHead className="text-left">Last Used</TableHead>
								<TableHead className="text-left">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{apiKeys.map((apiKey) => (
								<TableRow key={apiKey.id}>
									<TableCell>{apiKey.name}</TableCell>
									<TableCell>
										{apiKey.expirationDate
											? format(apiKey.expirationDate, "PPP")
											: "No expiration"}
									</TableCell>
									<TableCell>
										{apiKey.fundLimit
											? `$${apiKey.fundLimit.toFixed(2)}`
											: "No limit"}
									</TableCell>
									<TableCell>{format(apiKey.lastUsed, "PPP")}</TableCell>
									<TableCell className="text-right">
										<div className="flex items-center justify-end space-x-2">
											<Button
												variant="outline"
												size="icon"
												onClick={() => handleEdit(apiKey)}
											>
												<Settings className="h-4 w-4" />
											</Button>
											<Button
												variant="destructive"
												size="icon"
												onClick={() => handleRevoke(apiKey.id)}
											>
												<Trash2Icon className="h-4 w-4" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>

					<div className="flex justify-end">
						<Dialog open={open} onOpenChange={setOpen}>
							<DialogTrigger asChild>
								<Button>Generate New API Key</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-[425px]">
								<DialogHeader>
									<DialogTitle>Generate API Key</DialogTitle>
									<DialogDescription>
										Create a new API key with optional expiration and fund
										limit.
									</DialogDescription>
								</DialogHeader>
								<form onSubmit={handleSubmit}>
									<div className="grid gap-4 py-4">
										<div className="grid grid-cols-4 items-center gap-4">
											<Label htmlFor="name" className="text-right">
												Name
											</Label>
											<Input
												id="name"
												value={name}
												onChange={(e) => setName(e.target.value)}
												className="col-span-3"
												required
											/>
										</div>
										<div className="grid grid-cols-4 items-center gap-4">
											<Label htmlFor="expiration" className="text-right">
												Expiration
											</Label>
											<Popover>
												<PopoverTrigger asChild>
													<Button
														id="expiration"
														variant={"outline"}
														className={cn(
															"col-span-3 justify-start text-left font-normal",
															!expirationDate && "text-muted-foreground",
														)}
													>
														<CalendarIcon className="mr-2 h-4 w-4" />
														{expirationDate ? (
															format(expirationDate, "PPP")
														) : (
															<span>Pick a date</span>
														)}
													</Button>
												</PopoverTrigger>
												<PopoverContent className="w-auto p-0">
													<Calendar
														mode="single"
														selected={expirationDate}
														onSelect={setExpirationDate}
														initialFocus
													/>
												</PopoverContent>
											</Popover>
										</div>
										<div className="grid grid-cols-4 items-center gap-4">
											<Label htmlFor="fund-limit" className="text-right">
												Fund Limit
											</Label>
											<Input
												id="fund-limit"
												value={fundLimit}
												onChange={(e) => setFundLimit(e.target.value)}
												className="col-span-3"
												type="number"
												placeholder="Optional"
											/>
										</div>
									</div>
									<DialogFooter>
										<Button type="submit">Generate Key</Button>
									</DialogFooter>
								</form>
							</DialogContent>
						</Dialog>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
