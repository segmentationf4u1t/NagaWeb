import {
	HeartPulse,
	Home,
	LayoutGrid,
	MessageSquare,
	ScrollText,
	Settings2,
} from "lucide-react";
import { Core } from "./cfg";

type LayoutContext = "dashboard" | "landing";

export interface NavItem {
	href: string;
	icon: React.ElementType;
	label: string;
	badge?: string;
	context: LayoutContext[];
}

const navItems: NavItem[] = [
	{ href: "/", icon: Home, label: "Home", context: ["dashboard", "landing"] },
	{
		href: "/dashboard",
		icon: LayoutGrid,
		label: "Playground",
		context: ["dashboard"],
	},
	{
		href: "/dashboard/models",
		icon: Settings2,
		label: "Models",
		context: ["dashboard", "landing"],
	},
	{
		href: "/dashboard/docs",
		icon: ScrollText,
		label: "Docs & Examples",
		context: ["dashboard", "landing"],
	},
	{
		href: Core.discord,
		icon: MessageSquare,
		label: "Discord",
		context: ["dashboard", "landing"],
	},
	{
		href: "https://chat.naga.ac/",
		icon: HeartPulse,
		label: "LibreChat",
		context: ["landing"],
	},
];

export function getNavItems(context: LayoutContext): NavItem[] {
	return navItems.filter((item) => item.context.includes(context));
}
