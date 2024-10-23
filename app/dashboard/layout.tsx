import { auth } from "@/auth";

import DashboardNavigation from "@/components/dashboard/DashboardNavigation";
import SignIn from "@/components/sign-in";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();

	if (!session?.user)
		return (
			<>
				<SignIn />
			</>
		);

	return (
		<div className="min-h-screen flex">
			{/* Sidebar */}
			<aside className="w-[220px] lg:w-[280px] hidden md:flex flex-col border-r bg-muted/40">
				<div className="flex-1 overflow-y-auto">
					<DashboardNavigation />
				</div>
				<div className="p-2" />
			</aside>

			{/* Main content */}
			<main className="flex-1 flex flex-col overflow-hidden">
				<div className="flex-1 overflow-y-auto">{children}</div>
			</main>
		</div>
	);
}
