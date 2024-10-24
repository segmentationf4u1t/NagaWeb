import {
	Link,
	Home,

	Badge,

	BarChartBig,
	FileAxis3D,
	FileQuestion,
} from "lucide-react";

export default function DashboardNavigationLinks() {
	return (
		<>
			<div className="flex-1">
				<nav className="grid items-start px-2 text-sm font-medium lg:px-4">
					<Link
						href="#"
						className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
					>
						<Home className="h-4 w-4" />
						Dashboard
					</Link>
					<Link
						href="#"
						className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
					>
						{" "}
						<FileAxis3D className="h-4 w-4" />
						Models
						<Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
							6
						</Badge>
					</Link>
					<Link
						href="#"
						className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
					>
						<FileQuestion className="h-4 w-4" />
						Docs{" "}
					</Link>

					<Link
						href="#"
						className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
					>
						<BarChartBig className="h-4 w-4" />
						{/* <AreaChart className="h-4 w-4" /> */}
						Profile Analytics
					</Link>
				</nav>
			</div>
		</>
	);
}
