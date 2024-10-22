import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Heatmapapi = () => {
	const today = new Date();
	const data = [];
	for (let i = 0; i < 357; i++) {
		const date = new Date(today.getTime() - (356 - i) * 24 * 60 * 60 * 1000);
		const randomValue = Math.random();
		let count;
		if (randomValue < 0.6) {
			count = 0;
		} else {
			count = Math.floor(Math.random() * 30);
		}
		data.push({ date, count });
	}
	return data;
};

const contributionData = Heatmapapi();

const getColor = (count: number) => {
	if (count === 0) return "bg-neutral-800";
	if (count < 8) return "bg-rose-900";
	if (count < 16) return "bg-rose-800";
	if (count < 24) return "bg-rose-700";
	return "bg-rose-600";
};

const monthLabels = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

export default function Heatmap() {
	const weeks = [];
	for (let i = 0; i < 51; i++) {
		weeks.push(contributionData.slice(i * 7, (i + 1) * 7));
	}
	weeks.push(contributionData.slice(51 * 7));

	return (
		<Card className="w-full max-w-3xl">
			<CardHeader className="pb-2">
				<CardTitle className="text-lg">Api Calls</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col text-xs">
					<div className="flex justify-between mb-1 text-gray-400">
						{monthLabels.map((month, index) => (
							<span key={index}>{month}</span>
						))}
					</div>
					<div className="flex">
						<div className="flex flex-col justify-between pr-1 text-gray-400 pt-[6px]">
							<span>M</span>
							<span className="mt-[6px]">W</span>
							<span className="mt-[6px]">F</span>
						</div>
						<div className="flex-grow">
							<div className="flex gap-[2px]">
								{weeks.map((week, weekIndex) => (
									<div key={weekIndex} className="flex flex-col gap-[2px]">
										{week.map((day, dayIndex) => (
											<div
												key={dayIndex}
												className={`w-2 h-2 ${getColor(day.count)} rounded-full`}
												title={`${day.date.toDateString()}: ${day.count} contributions`}
											/>
										))}
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
				<div className="mt-2 flex items-center justify-end gap-1 text-xs text-gray-400">
					<span>Less</span>
					{[
						"bg-neutral-800",
						"bg-rose-900",
						"bg-rose-800",
						"bg-rose-700",
						"bg-rose-600",
					].map((color, index) => (
						<div key={index} className={`w-2 h-2 ${color} rounded-full`} />
					))}
					<span>More</span>
				</div>
			</CardContent>
		</Card>
	);
}
