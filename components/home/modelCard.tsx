import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft } from "lucide-react";

interface ModelCardProps {
	companyName: string;
	modelName: string;
	inputPrice: string;
	perImagePrice: string;
	perTokenPrice: string;
	perCharacterPrice: string;
	outputPrice: string;
	category: string;
	logoUrl: string;
}
    // Start of Selection
    function formatPrice(price: string): string {
		const numPrice = Number(price)
		const k = numPrice * 1000
		//return k
		//return numPrice
		return k.toFixed(10).replace(/\.?0+$/, '');
	}
function getPriceDisplay(
	category: string,
	inputPrice: string,
	perImagePrice: string,
	perTokenPrice: string,
	perCharacterPrice: string,
	outputPrice: string,
) {
	switch (category) {
		case "Text":
		case "Multimodal":
			return (
				<>
					<div className="flex items-center gap-1">
						<ArrowRightLeft className="w-3 h-3 text-neutral-400" />
						<span className="font-medium">${formatPrice(inputPrice)}</span>
						<span className="text-neutral-400">/1K in</span>
					</div>
					<div className="flex items-center gap-1 justify-self-end">
						<ArrowRightLeft className="w-3 h-3 text-neutral-400" />
						<span className="font-medium">${formatPrice(outputPrice)}</span>
						<span className="text-neutral-400">/1K out</span>
					</div>
				</>
			);
		case "Image":
			return (
				<div className="flex items-center gap-1">
					<span className="font-medium">${formatPrice(perImagePrice)}</span>
					<span className="text-neutral-400">/image</span>
				</div>
			);
		case "Embedding":
			return (
				<div className="flex items-center gap-1">
					<span className="font-medium">${formatPrice(perTokenPrice)}</span>
					<span className="text-neutral-400">/token</span>
				</div>
			);
		case "Audio":
			return (
				<div className="flex items-center gap-1">
					<span className="font-medium">${formatPrice(perCharacterPrice)}</span>
					<span className="text-neutral-400">/char</span>
				</div>
			);
		default:
			return null;
	}
}

export default function ModelCard({
	companyName = "AI Corp",
	modelName = "GPT-5000",
	inputPrice = "0",
	perImagePrice = "0",
	perTokenPrice = "0",
	perCharacterPrice = "0",
	outputPrice = "0",
	category = "Text",
	logoUrl = "/placeholder.svg?height=32&width=32",
}: ModelCardProps) {
	
	return (
		<Card className="max-w-85 bg-neutral-900 text-white overflow-hidden">
			<CardContent className="p-3">
				<div className="flex items-center gap-3 mb-2">
					<img
						src={logoUrl}
						alt={companyName}
						className="w-8 h-8 rounded-full"
					/>
					<div className="flex-1 min-w-0">
						<h3 className="font-bold text-sm truncate">{modelName}</h3>
						<p className="text-xs text-neutral-400 truncate">{companyName}</p>
					</div>
					<Badge
						variant="secondary"
						className="bg-neutral-700 text-neutral-200 text-xs"
					>
						{category}
					</Badge>
				</div>
				<div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs mt-2">
					{getPriceDisplay(
						category,
						inputPrice,
						perImagePrice,  // Changed order
						perTokenPrice,  // Changed order
						perCharacterPrice,  // Changed order
						outputPrice
					)}
				</div>
			</CardContent>
		</Card>
	);
}
