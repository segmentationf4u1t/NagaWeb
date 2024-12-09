import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function DashboardSkeleton() {
	return (
		<div className="flex bg-background text-foreground">
			{/* Sidebar */}
			<div className="hidden w-10 border-r border-border p-1.5 lg:flex lg:flex-col lg:justify-between">
				<div className="space-y-3">
					<Skeleton className="h-5 w-5 rounded-md" />
					{[...Array(3)].map((_, i) => (
						<Skeleton key={i} className="h-5 w-5 rounded-md" />
					))}
				</div>
				<Skeleton className="h-5 w-5 rounded-full" />
			</div>

			{/* Main content */}
			<div className="flex-1 overflow-auto p-2">
				{/* Header */}
				<header className="mb-2 flex items-center justify-between">
					<Skeleton className="h-4 w-16" />
					<Skeleton className="h-4 w-4 rounded-full" />
				</header>

				{/* Dashboard content */}
				<main className="space-y-2">
					{/* Summary cards */}
					<div className="grid gap-2 sm:grid-cols-2">
						{[...Array(4)].map((_, i) => (
							<Card key={i} className="p-2">
								<CardContent className="flex items-center justify-between p-0">
									<Skeleton className="h-3 w-12" />
									<Skeleton className="h-4 w-8" />
								</CardContent>
							</Card>
						))}
					</div>

					{/* Chart */}
					<Card className="p-2">
						<CardContent className="space-y-2 p-0">
							<Skeleton className="h-3 w-16" />
							<Skeleton className="h-[80px] w-full" />
						</CardContent>
					</Card>

					{/* Table */}
					<Card className="p-2">
						<CardContent className="space-y-2 p-0">
							<Skeleton className="h-3 w-16" />
							{[...Array(3)].map((_, i) => (
								<div key={i} className="flex items-center gap-2">
									<Skeleton className="h-5 w-5 rounded-full" />
									<div className="flex-1">
										<Skeleton className="h-2 w-full" />
									</div>
									<Skeleton className="h-3 w-6" />
								</div>
							))}
						</CardContent>
					</Card>
				</main>
			</div>
		</div>
	);
}
