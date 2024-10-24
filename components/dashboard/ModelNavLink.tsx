'use client';

import { useGetTotalModelsQuery } from "@/lib/api/modelsApi";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { FileAxis3D } from "lucide-react";
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
	const linkClass = cn(
		"flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
		{
			"bg-muted text-primary": isActive && !disabled,
			"text-muted-foreground": !isActive && !disabled,
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

export default function ModelsNavLink() {
	const { data: modelCount, isLoading } = useGetTotalModelsQuery();

	return (
		<NavLink href="/dashboard/models" icon={FileAxis3D}>
			Models
			<Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
				{isLoading ? '...' : modelCount}
			</Badge>
		</NavLink>
	);
}
