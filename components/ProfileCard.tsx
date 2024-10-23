import {
	Card,
	CardHeader,
	CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { signOut } from "@/auth";
import { auth } from "@/auth"

// Add types for the icon props
interface IconProps extends React.SVGProps<SVGSVGElement> {
	className?: string;
}

export default async function ProfileCard() {
	const session = await auth();
	
	if (session) {
		return (
			<Card className="w-full max-w-md mx-auto">
				<CardHeader className="flex items-center gap-4 p-6">
						<Avatar className="h-16 w-16">
							<AvatarImage 
								src={session.user?.image || undefined} 
								alt={`${session.user?.name}'s avatar`}
							/>
							<AvatarFallback>JD</AvatarFallback>
						</Avatar>
						<div className="space-y-1">
							<h3 className="text-lg font-semibold text-rose-500 text-center">
								{session.user?.name}
							</h3>
							<p className="text-gray-500 dark:text-gray-400 text-sm text-center">
								Dev
							</p>
						</div>
				</CardHeader>

				<CardFooter className="flex items-center justify-between p-6 border-t dark:border-gray-800">
					<div className="flex items-center gap-2 text-sm font-medium">
						<CalendarDaysIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
						<span className="text-gray-500 dark:text-gray-400">
							Joined in 2023
						</span>
					</div>
					<div className="flex items-center gap-2 text-sm font-medium">
						<LocateIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
						<span className="text-gray-500 dark:text-purple-500">Tier 2</span>
					</div>
				</CardFooter>
				<form action={async () => {
					'use server'
					await signOut();
				}}>
					<button 
						type="submit"
						className="w-full p-2 text-white bg-rose-500 hover:bg-rose-600"
					>
						Logout
					</button>
				</form>
			</Card>
		);
	}

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardHeader className="flex items-center gap-4 p-6">
				<Avatar className="h-16 w-16">
					{/* <AvatarImage src={session.user?.image} /> */}
					<AvatarFallback>JD</AvatarFallback>
				</Avatar>
				<div className="space-y-1">
					<h3 className="text-lg font-semibold text-rose-500 text-center">
						{/* {session.user?.name} */}
					</h3>
					<p className="text-gray-500 dark:text-gray-400 text-sm text-center">
						Dev
					</p>
				</div>
			</CardHeader>

			<CardFooter className="flex items-center justify-between p-6 border-t dark:border-gray-800">
				<div className="flex items-center gap-2 text-sm font-medium">
					<CalendarDaysIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
					<span className="text-gray-500 dark:text-gray-400">
						Joined in 2023
					</span>
				</div>
				<div className="flex items-center gap-2 text-sm font-medium">
					<LocateIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
					<span className="text-purple-500 dark:text-purple-500">Tier 2</span>
				</div>
			</CardFooter>
		</Card>
	);
}

function CalendarDaysIcon(props: IconProps) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<title>Calendar Days Icon</title>
			<path d="M8 2v4" />
			<path d="M16 2v4" />
			<rect width="18" height="18" x="3" y="4" rx="2" />
			<path d="M3 10h18" />
			<path d="M8 14h.01" />
			<path d="M12 14h.01" />
			<path d="M16 14h.01" />
			<path d="M8 18h.01" />
			<path d="M12 18h.01" />
			<path d="M16 18h.01" />
		</svg>
	);
}

function LocateIcon(props: IconProps) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<title>Location Icon</title>
			<line x1="2" x2="5" y1="12" y2="12" />
			<line x1="19" x2="22" y1="12" y2="12" />
			<line x1="12" x2="12" y1="2" y2="5" />
			<line x1="12" x2="12" y1="19" y2="22" />
			<circle cx="12" cy="12" r="7" />
		</svg>
	);
}
