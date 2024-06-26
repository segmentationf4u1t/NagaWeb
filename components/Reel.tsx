import ModelCompanies from "./Companies";
import { Card } from "./ui/card";
const Reel = () => {
	return (
		<Card className="hover:border-blue-500 transition-colors delay-50 my-4">
			<div className="text-center">
				<h1 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
					Secure. Stable. Dependable.
				</h1>
				<p className="mb-2">
					We are effectively delivering models crafted by those titans of the
					industry.
				</p>

				<ModelCompanies
					images={[
						"OpenAi.svg",
						"meta.svg",
						"antrophic.svg",
						"stabilityai.svg",
						"google.svg",
						"Logo_Sberbank.svg",
					]}
				/>
			</div>
		</Card>
	);
};
export default Reel;
