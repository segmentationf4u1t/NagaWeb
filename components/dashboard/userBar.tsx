"use client";
import { useState } from "react";
import { User, CreditCard, LogOut, Coins } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserData {
	name: string;
	email: string;
	avatarUrl: string;
	subscriptionType: string;
	creditsLeft: number;
	totalCredits: number;
}
interface UserProfileProps {
	name?: string;
	tier?: string;
	avatarUrl?: string;
	creditsLeft: number;
}
export default function UserBar({
	name,
	tier,
	avatarUrl,
	creditsLeft,
}: UserProfileProps) {
	const [open, setOpen] = useState(false);

	const initials = name
		? name
				.split(" ")
				.map((n) => n[0])
				.join("")
		: "??";
	return (
		<div className="relative flex items-center justify-between p-2 bg-sidebar-accent rounded-lg">
			<div className="flex items-center space-x-2">
				<Avatar className="h-8 w-8">
					<AvatarImage src={avatarUrl} alt={name} />
					<AvatarFallback>{initials}</AvatarFallback>
				</Avatar>
				<div>
					<p className="text-sm font-medium leading-none">{name}</p>
					<p className="text-xs text-sidebar-foreground/70">{tier}</p>
				</div>
			</div>
			<div className="flex items-center space-x-2">
				<div className="flex items-center space-x-1">
					<Coins className="h-4 w-4 text-sidebar-foreground/70" />
					<span className="text-xs font-medium">{creditsLeft}</span>
				</div>

				<DropdownMenu open={open} onOpenChange={setOpen}>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<User className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-56">
						<DropdownMenuLabel>My Account</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<User className="mr-2 h-4 w-4" />
							<span>Profile</span>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<CreditCard className="mr-2 h-4 w-4" />
							<span>Billing</span>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<LogOut className="mr-2 h-4 w-4" />
							<span>Log out</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}
