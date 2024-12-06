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

const data = [
	{ name: "Jan", usage: 4000 },
	{ name: "Feb", usage: 3000 },
	{ name: "Mar", usage: 5000 },
	{ name: "Apr", usage: 4500 },
	{ name: "May", usage: 6000 },
	{ name: "Jun", usage: 5500 },
];

export default function ApiUsageChart() {
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
		</Card>
	);
}
