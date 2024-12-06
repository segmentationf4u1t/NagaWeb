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
import {
	Bitcoin,
	EclipseIcon as Ethereum,
	DollarSign,
	CheckCircle2,
	XCircle,
} from "lucide-react";

interface Transaction {
	id: string;
	date: string;
	amount: number;
	currency: "BTC" | "ETH" | "USD";
	status: "success" | "failed";
}

const transactions: Transaction[] = [
	{
		id: "1",
		date: "2023-06-01",
		amount: 0.5,
		currency: "BTC",
		status: "success",
	},
	{
		id: "3",
		date: "2023-05-25",
		amount: 100,
		currency: "USD",
		status: "success",
	},
	{
		id: "5",
		date: "2023-05-15",
		amount: 1.5,
		currency: "ETH",
		status: "failed",
	},
];

const getCurrencyIcon = (currency: "BTC" | "ETH" | "USD") => {
	switch (currency) {
		case "BTC":
			return <Bitcoin className="h-4 w-4" />;
		case "ETH":
			return <Ethereum className="h-4 w-4" />;
		case "USD":
			return <DollarSign className="h-4 w-4" />;
	}
};

export default function PaymentHistory() {
	return (
		<Card className="bg-card">
			<CardHeader>
				<CardTitle>Payment History</CardTitle>
				<CardDescription>Your payments to our service</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Date</TableHead>
							<TableHead>Amount</TableHead>
							<TableHead>Currency</TableHead>
							<TableHead>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{transactions.map((transaction) => (
							<TableRow key={transaction.id}>
								<TableCell>{transaction.date}</TableCell>
								<TableCell>{transaction.amount}</TableCell>
								<TableCell>
									<div className="flex items-center space-x-2">
										{getCurrencyIcon(transaction.currency)}
										<span>{transaction.currency}</span>
									</div>
								</TableCell>
								<TableCell>
									<div className="flex items-center space-x-2">
										{transaction.status === "success" ? (
											<CheckCircle2 className="h-4 w-4 text-green-500" />
										) : (
											<XCircle className="h-4 w-4 text-red-500" />
										)}
										<span
											className={
												transaction.status === "success"
													? "text-green-500"
													: "text-red-500"
											}
										>
											{transaction.status}
										</span>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
