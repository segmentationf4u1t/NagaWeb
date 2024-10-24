"use client";
import Link from "next/link";
import { auth } from "@/auth";
import {
	Home,
	FileAxis3D,
	FileQuestion,
	BarChartBig,
	Binary,
	FileAxis3DIcon,
	Search,
	HandCoins,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import UserBar from "./userBar";
import { usePathname } from "next/navigation";


type NavLinkProps = {
	href: string;
	children: React.ReactNode;
	icon: React.ElementType;
	disabled?: boolean;
	className?: string;
	isActive?: boolean;
};

const NavLink = ({
	href,
	children,
	icon: Icon,
	disabled = false,
	className,
	isActive = false,
}: NavLinkProps) => {
	const pathname = usePathname();
	const isCurrentPath = pathname === href;

	const linkClass = cn(
		"flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
		{
			"bg-muted text-primary": isCurrentPath && !disabled,
			"text-muted-foreground": !isCurrentPath && !disabled,
			"hover:text-primary": !disabled,
			"opacity-50 cursor-not-allowed": disabled,
		},
		className,
	);

	const content = (
		<>
			<Icon className="h-4 w-4" />
			{children}
		</>
	);

	return disabled ? (
		<span
			className={linkClass}
			title="This feature is currently unavailable for your account"
		>
			{content}
		</span>
	) : (
		<Link href={href} className={linkClass}>
			{content}
		</Link>
	);
};

interface DashboardNavigationProps {
	userName: string;
	userImage: string;
	modelCount: number;
}

export default function DashboardNavigation({ 
	userName, 
	userImage, 
	modelCount 
}: DashboardNavigationProps) {
	return (
		<nav className="grid items-start text-sm font-medium p-2">
			<div className="flex h-14 items-center border-b px-2">
				<UserBar
					name={userName}
					tier="Tier 2"
					avatarUrl={userImage}
				/>
			</div>
			<NavLink href="/dashboard" icon={Home}>
				Dashboard
			</NavLink>
			<NavLink href="/dashboard/models" icon={FileAxis3D}>
				Models
				<Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
					{modelCount}
				</Badge>
			</NavLink>
			<NavLink href="/dashboard/docs" icon={FileQuestion}>
				Docs
			</NavLink>
			<NavLink href="/dashboard/rankings" icon={FileAxis3DIcon}>
				Model Evaluations
			</NavLink>
			<NavLink href="/dashboard/sandbox" icon={Binary}>
				Sandbox
			</NavLink>
			<NavLink href="/dashboard/SearchEngine" icon={Search} disabled>
				Augmented Search
				<Badge
					className="ml-auto flex shrink-0 items-right justify-right"
					variant="outline"
				>
					Alpha
				</Badge>
			</NavLink>
			<NavLink href="/dashboard/profile/analytics" icon={BarChartBig}>
				Profile & Analytics
			</NavLink>
			<NavLink href="/dashboard/profile/analytics" icon={HandCoins}>
				Billing
			</NavLink>
		</nav>
	);
}
