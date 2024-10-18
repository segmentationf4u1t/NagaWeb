import { BackgroundBeams } from "@/components/ui/background-beams";

import Hero from "@/components/home/Hero";
import FeaturesTwo from "@/components/home/Feattwo";
import { MarqueeVertical } from "@/components/home/MarqueeVer";

export default function Home() {
	return (
		<>
			<div className="absolute inset-0 z-[-1]">
				<BackgroundBeams />
			</div>

			<Hero />

			<div className="container relative">
				<div className="hidden md:block">
					<MarqueeVertical />
				</div>
				<FeaturesTwo />
			</div>
		</>
	);
}
