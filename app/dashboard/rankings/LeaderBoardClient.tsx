"use client";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { BookmarkCheck } from "lucide-react";
import React, { useState } from "react";

interface LeaderboardClientProps {
	initialData: LeaderboardData;
}

export default function LeaderboardClient({
	initialData,
}: LeaderboardClientProps) {
	const [data, setData] = useState<LeaderboardData>(initialData);
	const [selectedCategory, setSelectedCategory] =
		useState<keyof LeaderboardData>("Coding");

	const categories: (keyof LeaderboardData)[] = [
		"Coding",
		"Math",
		"Instruction_Following",
		"Spanish",
	];

	return (
		<div className="p-2">
			<h1 className="text-3xl font-bold mb-6">
				Large Language Model Leaderboard
			</h1>
			<div className="mb-4">
				<Select
					value={selectedCategory}
					onValueChange={(value) =>
						setSelectedCategory(value as keyof LeaderboardData)
					}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Select category" />
					</SelectTrigger>
					<SelectContent>
						{categories.map((category) => (
							<SelectItem key={category} value={category}>
								{category.replace("_", " ")}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[40%]">Model</TableHead>
						<TableHead className="w-[30%]">Score</TableHead>
						<TableHead className="w-[30%]">Confidence Interval</TableHead>
						<TableHead className="w-[10%]">Available?</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data[selectedCategory].map((item) => (
						<TableRow key={item.Model}>
							<TableCell className="font-medium">{item.Model}</TableCell>
							<TableCell>{item.Score}</TableCell>
							<TableCell>{item["Confidence Interval"]}</TableCell>
							<TableCell className="float-right text-green-700">
								<BookmarkCheck />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
