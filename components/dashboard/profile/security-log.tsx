"use client";

import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Hash, Eye, EyeOff } from "lucide-react";

const securityLogs = [
	{
		id: 1,
		date: "2023-06-01",
		time: "14:30",
		ip: "192.168.1.1",
		location: "New York, USA",
		status: "Success",
	},
	{
		id: 2,
		date: "2023-05-30",
		time: "09:15",
		ip: "10.0.0.1",
		location: "London, UK",
		status: "Failed",
	},
	{
		id: 3,
		date: "2023-05-28",
		time: "22:45",
		ip: "172.16.0.1",
		location: "Tokyo, Japan",
		status: "Success",
	},
	{
		id: 4,
		date: "2023-05-26",
		time: "11:00",
		ip: "192.168.0.1",
		location: "Sydney, Australia",
		status: "Success",
	},
	{
		id: 5,
		date: "2023-05-24",
		time: "16:20",
		ip: "10.10.0.1",
		location: "Paris, France",
		status: "Failed",
	},
];

export default function SecurityLog() {
	const [visibleIPs, setVisibleIPs] = useState<{ [key: number]: boolean }>({});

	const toggleIPVisibility = (id: number) => {
		setVisibleIPs((prev) => ({ ...prev, [id]: !prev[id] }));
	};

	return (
		<Card className="bg-card">
			<CardHeader>
				<CardTitle>Security Log</CardTitle>
				<CardDescription>Your last 5 login attempts</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[50px]">Hash</TableHead>
							<TableHead>Date & Time</TableHead>
							<TableHead>IP Address</TableHead>
							<TableHead>Location</TableHead>
							<TableHead>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{securityLogs.map((log) => (
							<TableRow key={log.id}>
								<TableCell>
									<Hash className="text-muted-foreground" size={20} />
								</TableCell>
								<TableCell>
									{log.date} {log.time}
								</TableCell>
								<TableCell>
									<div className="flex items-center space-x-2">
										<span className={visibleIPs[log.id] ? "" : "blur-sm"}>
											{log.ip}
										</span>
										<button
											onClick={() => toggleIPVisibility(log.id)}
											className="text-muted-foreground hover:text-foreground"
										>
											{visibleIPs[log.id] ? (
												<EyeOff size={16} />
											) : (
												<Eye size={16} />
											)}
										</button>
									</div>
								</TableCell>
								<TableCell>{log.location}</TableCell>
								<TableCell>
									<span
										className={`px-2 py-1 rounded-full text-xs ${
											log.status === "Success"
												? "bg-green-500/20 text-green-700"
												: "bg-red-500/20 text-red-700"
										}`}
									>
										{log.status}
									</span>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
