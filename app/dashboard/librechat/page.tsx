import { Card } from "@/components/ui/card";

export default function LibreChat() {
	return (
		<>
			<div className="grid gap-4 grid-cols-1 w-full h-screen">
				<Card>
					<iframe
						title="Chat"
						className="w-full h-full"
						src="https://chat.naga.ac/"
					/>
				</Card>
			</div>
		</>
	);
}
