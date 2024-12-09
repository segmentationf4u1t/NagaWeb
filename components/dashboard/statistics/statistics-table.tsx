"use client";

import { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Define the data type for an individual API request log
type ApiLogEntry = {
	requestId: string; // Unique ID for each request
	timestamp: string; // Or Date if you are storing dates
	apiKeyId: string;
	modelId: string; // ID of the model used
	status: number;
	responseTime: number; // in milliseconds, for example
	cost?: number; // Optional, if you want to track cost per request
};

// Mock data - replace this with your actual log data
const mockLogData: ApiLogEntry[] = [
	{
		requestId: "req-001",
		timestamp: "2023-12-29T10:00:00Z",
		apiKeyId: "key1",
		modelId: "model-xyz",
		status: 200,
		responseTime: 150,
		cost: 0.05,
	},
	{
		requestId: "req-002",
		timestamp: "2023-12-29T10:01:00Z",
		apiKeyId: "key2",
		modelId: "model-abc",
		status: 200,
		responseTime: 200,
	},
	{
		requestId: "req-003",
		timestamp: "2023-12-29T10:02:00Z",
		apiKeyId: "key1",
		modelId: "model-xyz",
		status: 500,
		responseTime: 50,
	},
	// ... more log entries
];

// Column definitions for log entries
type LogColumn = {
	key: keyof ApiLogEntry;
	header: string;
	cell?: (value: any) => React.ReactNode;
};

const logColumns: LogColumn[] = [
	{
		key: "requestId",
		header: "Request ID",
	},
	{
		key: "timestamp",
		header: "Timestamp",
	},
	{
		key: "apiKeyId",
		header: "API Key ID",
	},
	{
		key: "modelId",
		header: "Model ID",
	},
	{
		key: "status",
		header: "Status",
		cell: (value: number) => {
			// Example of conditional formatting based on status code
			const color = value >= 200 && value < 300 ? "green" : "red";
			return <span style={{ color }}>{value}</span>;
		},
	},
	{
		key: "responseTime",
		header: "Response Time (ms)",
	},
	{
		key: "cost",
		header: "Cost",
		cell: (value: number) => (value ? `$${value.toFixed(2)}` : "N/A"),
	},
];

export function StatisticsTable() {
	const [data, setData] = useState<ApiLogEntry[]>(mockLogData);
	const [filter, setFilter] = useState<string>("");
	const [sortKey, setSortKey] = useState<keyof ApiLogEntry | null>(null);
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(10); // Default page size

	// Filtered data
	const filteredData = data.filter((item) =>
		item.apiKeyId.toLowerCase().includes(filter.toLowerCase()),
	);

	// Sorted data
	const sortedData = sortKey
		? [...filteredData].sort((a, b) => {
				const aValue = a[sortKey];
				const bValue = b[sortKey];
				if (aValue < bValue) {
					return sortDirection === "asc" ? -1 : 1;
				}
				if (aValue > bValue) {
					return sortDirection === "asc" ? 1 : -1;
				}
				return 0;
			})
		: filteredData;

	// Paginated data
	const startIndex = (currentPage - 1) * pageSize;
	const endIndex = startIndex + pageSize;
	const paginatedData = sortedData.slice(startIndex, endIndex);

	// Handle sorting
	const handleSort = (key: keyof ApiLogEntry) => {
		if (sortKey === key) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortKey(key);
			setSortDirection("asc");
		}
	};

	// Handle page change
	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage);
	};

	return (
		<div>
			<div className="flex items-center py-4">
				<Input
					placeholder="Filter by API key ID..."
					value={filter}
					onChange={(event) => setFilter(event.target.value)}
					className="max-w-sm"
				/>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							{logColumns.map((column) => (
								<TableHead
									key={column.key}
									onClick={() => handleSort(column.key)}
								>
									{column.header}
									{sortKey === column.key && (
										<span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
									)}
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{paginatedData.length > 0 ? (
							paginatedData.map((item) => (
								<TableRow key={item.requestId}>
									{logColumns.map((column) => (
										<TableCell key={column.key}>
											{column.cell
												? column.cell(item[column.key])
												: item[column.key]}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={logColumns.length} className="text-center">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination Controls */}
			<div className="flex items-center justify-between mt-4">
				<div>
					Page {currentPage} of {Math.ceil(sortedData.length / pageSize)}
				</div>
				<div className="flex gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => handlePageChange(currentPage - 1)}
						disabled={currentPage === 1}
					>
						Previous
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => handlePageChange(currentPage + 1)}
						disabled={currentPage === Math.ceil(sortedData.length / pageSize)}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
}
