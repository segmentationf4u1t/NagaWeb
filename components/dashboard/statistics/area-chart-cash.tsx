"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

// Example data, replace with your actual API key usage data
const chartData = [
	{ date: "2024-06-01", key1: 222, key2: 150, key3: 100 },
	{ date: "2024-06-02", key1: 97, key2: 180, key3: 120 },
	{ date: "2024-06-03", key1: 167, key2: 120, key3: 80 },
	{ date: "2024-06-04", key1: 234, key2: 90, key3: 150 },
	{ date: "2024-06-05", key1: 345, key2: 200, key3: 180 },
	{ date: "2024-06-06", key1: 456, key2: 250, key3: 200 },
	{ date: "2024-06-07", key1: 567, key2: 300, key3: 220 },
	{ date: "2024-06-08", key1: 678, key2: 350, key3: 250 },
	{ date: "2024-06-09", key1: 789, key2: 400, key3: 280 },
	{ date: "2024-06-10", key1: 890, key2: 450, key3: 300 },
	{ date: "2024-06-11", key1: 901, key2: 500, key3: 320 },
	{ date: "2024-06-12", key1: 812, key2: 550, key3: 350 },
	{ date: "2024-06-13", key1: 723, key2: 600, key3: 380 },
	{ date: "2024-06-14", key1: 634, key2: 550, key3: 400 },
	{ date: "2024-06-15", key1: 545, key2: 500, key3: 420 },
	{ date: "2024-06-16", key1: 456, key2: 450, key3: 400 },
	{ date: "2024-06-17", key1: 367, key2: 400, key3: 380 },
	{ date: "2024-06-18", key1: 278, key2: 350, key3: 350 },
	{ date: "2024-06-19", key1: 189, key2: 300, key3: 320 },
	{ date: "2024-06-20", key1: 290, key2: 250, key3: 300 },
	{ date: "2024-06-21", key1: 301, key2: 200, key3: 280 },
	{ date: "2024-06-22", key1: 412, key2: 150, key3: 250 },
	{ date: "2024-06-23", key1: 523, key2: 200, key3: 220 },
	{ date: "2024-06-24", key1: 634, key2: 250, key3: 200 },
	{ date: "2024-06-25", key1: 745, key2: 300, key3: 180 },
	{ date: "2024-06-26", key1: 856, key2: 350, key3: 150 },
	{ date: "2024-06-27", key1: 967, key2: 400, key3: 120 },
	{ date: "2024-06-28", key1: 878, key2: 450, key3: 100 },
	{ date: "2024-06-29", key1: 789, key2: 500, key3: 80 },
	{ date: "2024-06-30", key1: 690, key2: 450, key3: 100 },
];

const chartConfig = {
	key1: {
		label: "API Key 1",
		color: "hsl(var(--chart-1))",
	},
	key2: {
		label: "API Key 2",
		color: "hsl(var(--chart-2))",
	},
	key3: {
		label: "API Key 3",
		color: "hsl(var(--chart-3))",
	},
} satisfies ChartConfig;

export function AreaChartInteractiveCash() {
	const [timeRange, setTimeRange] = React.useState("30d");

	const filteredData = chartData.filter((item) => {
		const date = new Date(item.date);
		const referenceDate = new Date("2024-06-30");
		let daysToSubtract = 30;
		if (timeRange === "7d") {
			daysToSubtract = 7;
		}
		const startDate = new Date(referenceDate);
		startDate.setDate(startDate.getDate() - daysToSubtract);
		return date >= startDate;
	});

	return (
		<Card>
			<CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
				<div className="grid flex-1 gap-1 text-center sm:text-left">
					<CardTitle>API Key Spending</CardTitle>
					<CardDescription>
						Showing API key spending in credits for the last{" "}
						{timeRange === "7d" ? "7" : "30"} days
					</CardDescription>
				</div>
				<Select value={timeRange} onValueChange={setTimeRange}>
					<SelectTrigger
						className="w-[160px] rounded-lg sm:ml-auto"
						aria-label="Select a value"
					>
						<SelectValue placeholder="Last 30 days" />
					</SelectTrigger>
					<SelectContent className="rounded-xl">
						<SelectItem value="30d" className="rounded-lg">
							Last 30 days
						</SelectItem>
						<SelectItem value="7d" className="rounded-lg">
							Last 7 days
						</SelectItem>
					</SelectContent>
				</Select>
			</CardHeader>
			<CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
				<ChartContainer
					config={chartConfig}
					className="aspect-auto h-[250px] w-full"
				>
					<AreaChart data={filteredData}>
						<defs>
							<linearGradient id="fillKey1" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="5%"
									stopColor="var(--color-key1)"
									stopOpacity={0.8}
								/>
								<stop
									offset="95%"
									stopColor="var(--color-key1)"
									stopOpacity={0.1}
								/>
							</linearGradient>
							<linearGradient id="fillKey2" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="5%"
									stopColor="var(--color-key2)"
									stopOpacity={0.8}
								/>
								<stop
									offset="95%"
									stopColor="var(--color-key2)"
									stopOpacity={0.1}
								/>
							</linearGradient>
							<linearGradient id="fillKey3" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="5%"
									stopColor="var(--color-key3)"
									stopOpacity={0.8}
								/>
								<stop
									offset="95%"
									stopColor="var(--color-key3)"
									stopOpacity={0.1}
								/>
							</linearGradient>
						</defs>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="date"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							minTickGap={32}
							tickFormatter={(value) => {
								const date = new Date(value);
								return date.toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
								});
							}}
						/>
						<ChartTooltip
							cursor={false}
							content={
								<ChartTooltipContent
									labelFormatter={(value) => {
										return new Date(value).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
										});
									}}
									indicator="dot"
								/>
							}
						/>
						<Area
							dataKey="key1"
							type="natural"
							fill="url(#fillKey1)"
							stroke="var(--color-key1)"
							stackId="a"
						/>
						<Area
							dataKey="key2"
							type="natural"
							fill="url(#fillKey2)"
							stroke="var(--color-key2)"
							stackId="a"
						/>
						<Area
							dataKey="key3"
							type="natural"
							fill="url(#fillKey3)"
							stroke="var(--color-key3)"
							stackId="a"
						/>
						<ChartLegend content={<ChartLegendContent />} />
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
