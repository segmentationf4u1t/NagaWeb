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
import { MoreVertical, LogOut, User } from "lucide-react";
import { signOut } from "@/auth";
import { handleSignOut } from "@/lib/actions/auth";

interface UserProfileProps {
	name?: string;
	tier?: string;
	avatarUrl?: string;
}

export default function UserBar({
	name,
	tier ,
	avatarUrl,
}: UserProfileProps) {
	const initials = name
		? name
				.split(" ")
				.map((n) => n[0])
				.join("")
		: "??";

	return (
		<div className="flex items-center justify-between w-full rounded-lg shadow-sm p-2">
			<div className="flex items-center space-x-3 overflow-hidden">
				<Avatar className="w-10 h-10 flex-shrink-0">
					<AvatarImage src={avatarUrl} alt={name || "User"} />
					<AvatarFallback>{initials}</AvatarFallback>
				</Avatar>
				<div className="min-w-0">
					<p className="text-sm font-medium leading-none text-foreground truncate">
						{name || "Unknown User"}
					</p>
					<p className="text-xs text-muted-foreground truncate">
						{tier || "Unknown Tier"}
					</p>
				</div>
			</div>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className="text-muted-foreground flex-shrink-0"
					>
						<MoreVertical className="h-4 w-4" />
						<span className="sr-only">Open menu</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>My Account</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem>
						<User className="mr-2 h-4 w-4" />
						<span>Profile</span>
					</DropdownMenuItem>
					<form action={handleSignOut}>
						<DropdownMenuItem
							className="text-red-600 focus:text-red-600"
							asChild
						>
							<button type="submit" className="w-full flex items-center">
								<LogOut className="mr-2 h-4 w-4" />
								<span>Log out</span>
							</button>
						</DropdownMenuItem>
					</form>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
