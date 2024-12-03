import { auth } from "@/auth";
import DashboardNavigationServer from "@/components/dashboard/DashboardNavigationServer";
import SignIn from "@/components/sign-in";
import { Toaster } from "@/components/ui/toaster";
import { headers } from "next/headers";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const headerList = await headers();
	const session = await auth.api.getSession({
		headers: headerList, // you need to pass the headers object.
	});

	if (!session) {
		return <SignIn />;
	}

	return (
		<div className="min-h-screen flex">
			{/* Sidebar */}
			<aside className="w-[220px] lg:w-[280px] hidden md:flex flex-col border-r bg-muted/40">
				<div className="flex-1 overflow-y-auto">
					<DashboardNavigationServer />
				</div>
				<div className="p-2" />
			</aside>

			{/* Main content */}
			<main className="flex-1 flex flex-col overflow-hidden">
				<div className="flex-1 overflow-y-auto">{children}</div>
			</main>
			<Toaster />
		</div>
	);
}
