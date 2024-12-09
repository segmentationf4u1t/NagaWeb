"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ResponsiveContainer,
	AreaChart,
	Area,
	XAxis,
	YAxis,
	Tooltip,
} from "recharts";
import { useState, useEffect } from "react";
import {
	Table,
	TableHeader,
	TableBody,
	TableHead,
	TableRow,
	TableCell,
	TableCaption,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

const data = [
	{ name: "Jan", usage: 4000 },
	{ name: "Feb", usage: 3000 },
	{ name: "Mar", usage: 5000 },
	{ name: "Apr", usage: 4500 },
	{ name: "May", usage: 6000 },
	{ name: "Jun", usage: 5500 },
];

// Placeholder for fetching request logs from the database
async function fetchRequestLogs(days: number) {
	// Replace this with your actual database query logic
	// Example:
	// const response = await fetch(`/api/request-logs?days=${days}`);
	// const data = await response.json();
	// return data;

	// Returning dummy data for now
	return [
		{
			logId: 1,
			requestId: "req-1",
			apiKeyId: "api-key-1",
			modelId: "model-1",
			success: true,
			cost: 0.05,
			createdAt: new Date("2023-12-25"),
		},
		// ... more dummy data ...
		{
			logId: 2,
			requestId: "req-2",
			apiKeyId: "api-key-1",
			modelId: "model-2",
			success: false,
			cost: 0,
			createdAt: new Date("2023-12-26"),
		},
		{
			logId: 3,
			requestId: "req-3",
			apiKeyId: "api-key-2",
			modelId: "model-1",
			success: true,
			cost: 0.07,
			createdAt: new Date("2023-12-26"),
		},
		{
			logId: 4,
			requestId: "req-4",
			apiKeyId: "api-key-1",
			modelId: "model-3",
			success: true,
			cost: 0.1,
			createdAt: new Date("2023-12-27"),
		},
		{
			logId: 5,
			requestId: "req-5",
			apiKeyId: "api-key-2",
			modelId: "model-2",
			success: true,
			cost: 0.03,
			createdAt: new Date("2023-12-28"),
		},
		{
			logId: 6,
			requestId: "req-6",
			apiKeyId: "api-key-1",
			modelId: "model-1",
			success: false,
			cost: 0,
			createdAt: new Date("2023-12-29"),
		},
		{
			logId: 7,
			requestId: "req-7",
			apiKeyId: "api-key-2",
			modelId: "model-3",
			success: true,
			cost: 0.12,
			createdAt: new Date("2023-12-30"),
		},
		{
			logId: 8,
			requestId: "req-8",
			apiKeyId: "api-key-1",
			modelId: "model-2",
			success: true,
			cost: 0.06,
			createdAt: new Date("2023-12-31"),
		},
		{
			logId: 9,
			requestId: "req-9",
			apiKeyId: "api-key-2",
			modelId: "model-1",
			success: true,
			cost: 0.08,
			createdAt: new Date("2024-01-01"),
		},
		{
			logId: 10,
			requestId: "req-10",
			apiKeyId: "api-key-1",
			modelId: "model-3",
			success: true,
			cost: 0.09,
			createdAt: new Date("2024-01-02"),
		},
	];
}

// Interface for the statistics data
interface Statistics {
	totalRequests: number;
	successfulRequests: number;
	failedRequests: number;
	totalCost: number;
	requestsByApiKey: { [apiKey: string]: number };
	requestsByModel: { [modelId: string]: number };
	costByApiKey: { [apiKey: string]: number };
}

// Interface for table data (combining all statistics into one)
interface TableData {
	metric: string;
	value: string | number;
}

export default function ApiUsageChart() {
	const [statistics, setStatistics] = useState<Statistics | null>(null);
	const [tableData, setTableData] = useState<TableData[]>([]);
	const [sortConfig, setSortConfig] = useState<{
		key: keyof TableData | null;
		direction: "ascending" | "descending";
	}>({ key: null, direction: "ascending" });

	useEffect(() => {
		const loadStatistics = async () => {
			const logs = await fetchRequestLogs(30); // Fetch logs for the last 30 days
			const stats = calculateStatistics(logs);
			setStatistics(stats);
		};

		loadStatistics();
	}, []);

	// Function to calculate statistics from request logs
	function calculateStatistics(logs: any[]): Statistics {
		const totalRequests = logs.length;
		const successfulRequests = logs.filter((log) => log.success).length;
		const failedRequests = totalRequests - successfulRequests;
		const totalCost = logs
			.filter((log) => log.success)
			.reduce((sum, log) => sum + log.cost, 0);

		const requestsByApiKey: { [apiKey: string]: number } = {};
		const requestsByModel: { [modelId: string]: number } = {};
		const costByApiKey: { [apiKey: string]: number } = {};

		logs.forEach((log) => {
			requestsByApiKey[log.apiKeyId] =
				(requestsByApiKey[log.apiKeyId] || 0) + 1;
			requestsByModel[log.modelId] = (requestsByModel[log.modelId] || 0) + 1;
			if (log.success) {
				costByApiKey[log.apiKeyId] =
					(costByApiKey[log.apiKeyId] || 0) + log.cost;
			}
		});

		return {
			totalRequests,
			successfulRequests,
			failedRequests,
			totalCost,
			requestsByApiKey,
			requestsByModel,
			costByApiKey,
		};
	}

	// Prepare data for the table
	useEffect(() => {
		if (statistics) {
			const data: TableData[] = [
				{ metric: "Total Requests", value: statistics.totalRequests },
				{ metric: "Successful Requests", value: statistics.successfulRequests },
				{ metric: "Failed Requests", value: statistics.failedRequests },
				{ metric: "Total Cost", value: `$${statistics.totalCost.toFixed(2)}` },
				...Object.entries(statistics.requestsByApiKey).map(
					([apiKey, count]) => ({
						metric: `Requests by API Key ${apiKey}`,
						value: count,
					}),
				),
				...Object.entries(statistics.costByApiKey).map(([apiKey, cost]) => ({
					metric: `Cost by API Key ${apiKey}`,
					value: `$${cost.toFixed(2)}`,
				})),
				...Object.entries(statistics.requestsByModel).map(
					([modelId, count]) => ({
						metric: `Requests by Model ${modelId}`,
						value: count,
					}),
				),
			];
			setTableData(data);
		}
	}, [statistics]);

	// Function to handle sorting
	const onSort = (key: keyof TableData) => {
		let direction = "ascending";
		if (sortConfig.key === key && sortConfig.direction === "ascending") {
			direction = "descending";
		}
		setSortConfig({ key, direction });
	};

	// Sort data based on sortConfig
	const sortedTableData = React.useMemo(() => {
		if (!sortConfig.key) return tableData;

		return [...tableData].sort((a, b) => {
			if (a[sortConfig.key!] < b[sortConfig.key!]) {
				return sortConfig.direction === "ascending" ? -1 : 1;
			}
			if (a[sortConfig.key!] > b[sortConfig.key!]) {
				return sortConfig.direction === "ascending" ? 1 : -1;
			}
			return 0;
		});
	}, [tableData, sortConfig]);

	return (
		<Card className="bg-card">
			<CardHeader>
				<CardTitle>API Usage</CardTitle>
				<CardDescription>
					Your API call volume over the last month
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ResponsiveContainer width="100%" height={300}>
					<AreaChart data={data}>
						<defs>
							<linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="5%"
									stopColor="rgb(59, 130, 246)"
									stopOpacity={0.8}
								/>
								<stop offset="95%" stopColor="rgb(0, 0, 0)" stopOpacity={0.1} />
							</linearGradient>
						</defs>
						<XAxis
							dataKey="name"
							stroke="hsl(var(--muted-foreground))"
							fontSize={12}
							tickLine={false}
							axisLine={false}
						/>
						<YAxis
							stroke="hsl(var(--muted-foreground))"
							fontSize={12}
							tickLine={false}
							axisLine={false}
							tickFormatter={(value) => `${value / 1000}k`}
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: "hsl(var(--popover))",
								border: "none",
								borderRadius: "6px",
								fontSize: "12px",
							}}
						/>
						<Area
							type="monotone"
							dataKey="usage"
							stroke="rgb(59, 130, 246)"
							fill="url(#colorUsage)"
						/>
					</AreaChart>
				</ResponsiveContainer>
			</CardContent>
			{/* Statistics Table */}
			{statistics && (
				<CardContent>
					<Table>
						<TableCaption>API Usage Statistics (Last 30 Days)</TableCaption>
						<TableHeader>
							<TableRow>
								<TableHead>
									<Button
										variant="ghost"
										onClick={() => onSort("metric")}
										className="justify-start"
									>
										Metric
										{sortConfig.key === "metric" && (
											<ArrowUpDown className="ml-2 h-4 w-4" />
										)}
									</Button>
								</TableHead>
								<TableHead>
									<Button
										variant="ghost"
										onClick={() => onSort("value")}
										className="justify-end"
									>
										Value
										{sortConfig.key === "value" && (
											<ArrowUpDown className="ml-2 h-4 w-4" />
										)}
									</Button>
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{sortedTableData.map((data, index) => (
								<TableRow key={index}>
									<TableCell className="font-medium">{data.metric}</TableCell>
									<TableCell>
										{typeof data.value === "number"
											? data.value
											: data.value.toString()}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			)}
		</Card>
	);
}
