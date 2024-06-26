import * as Icons from "lucide-react";
import type React from "react";
import { Card } from "./ui/card";

type FeatureCardProps = {
	title: string;
	description: string;
	icon: keyof typeof Icons;
};
type IconProps = React.ComponentProps<"svg"> & { size?: number };

const FeatureCard: React.FC<FeatureCardProps> = ({
	title,
	description,
	icon,
}) => {
	const IconComponent = Icons[icon] as React.FC<IconProps>;
	return (
		<Card className="p-6 text-center hover:border-blue-500 transition-colors delay-50">
			<div className="flex justify-center">
				{IconComponent ? <IconComponent size={24} className="mb-4" /> : null}
			</div>
			<h3 className="text-lg font-semibold mb-2">{title}</h3>
			<p className="text-gray-300">{description}</p>
		</Card>
	);
};

const SectionB: React.FC = () => {
	return (
		<div className="grid md:grid-cols-3 gap-4">
			<FeatureCard
				icon="Lock"
				title="Secure and Confidential"
				description="Your data is protected with state-of-the-art security measures. No request history is stored, ensuring your interactions remain private."
			/>
			<FeatureCard
				icon="Zap"
				title="Reliable and Cutting-Edge"
				description="Experience unparalleled stability and performance with NagaAI's advanced infrastructure, delivering reliable access to the latest breakthroughs in artificial intelligence."
			/>
			<FeatureCard
				icon="Rocket"
				title="Be the First to Innovate"
				description="Stay ahead of the curve with priority access to cutting-edge AI technologies. Leverage the latest advancements to drive innovation and gain a competitive edge."
			/>
		</div>
	);
};

export default SectionB;
