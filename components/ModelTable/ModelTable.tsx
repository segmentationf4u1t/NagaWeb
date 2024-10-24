// ModelTable.tsx
import { useRef, } from "react";

export interface Pricing {
	per_input_token?: number;
	per_output_token?: number;
	per_image?: number;
	per_token?: number;
	per_second?: number;
	per_character?: number;
}

export interface TierData {
	[key: string]: string | number | undefined;
	free?: string;
	"tier-1"?: string;
	"tier-2"?: string;
	"tier-3"?: string;
}

export interface Model {
	id: string;
	modelType: string;
	pricing: Pricing | null;
	tiersData: TierData | null;
	points_to?: string;
}

interface ModelTableProps {
	data: Model[];
}

const ModelTable: React.FC<ModelTableProps> = ({ data }) => {
	const tableRef = useRef<HTMLDivElement>(null);
	const DECIMAL_PLACES = 8;

	return (
		<div className="flex flex-col h-full">
			<div ref={tableRef} className="flex-grow overflow-auto">
				<table className="w-full divide-y divide-neutral-200">
					<thead className="bg-muted/20 sticky top-0">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
								ID
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
								Type
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
								Cost
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
								Free Limit
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
								Tier-1 Limit
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
								Tier-2 Limit
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
								Tier-3 Limit
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
								Tier-4 Limit
							</th>
						</tr>
					</thead>
					<tbody className="bg-neutral-950 divide-y divide-neutral-800">
						{data.map((model) => (
							<tr key={model.id}>
								<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-200">
									{model.id}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
									{model.modelType}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
									{model.pricing ? (
										<div>
											{model.modelType.toLowerCase() === 'image' && model.pricing.per_image && (
												<div>Per Image: ${Number(model.pricing.per_image).toFixed(DECIMAL_PLACES)}</div>
											)}
											{(model.modelType.toLowerCase() === 'text' || model.modelType.toLowerCase() === 'multimodal') && (
												<>
													{model.pricing.per_input_token && (
														<div>Per Input Token: ${Number(model.pricing.per_input_token).toFixed(DECIMAL_PLACES)}</div>
													)}
													{model.pricing.per_output_token && (
														<div>Per Putput Token: ${Number(model.pricing.per_output_token).toFixed(DECIMAL_PLACES)}</div>
													)}
												</>
											)}
											{model.modelType.toLowerCase() === 'embedding' && model.pricing.per_token && (
												<div>per token: ${Number(model.pricing.per_token).toFixed(DECIMAL_PLACES)}</div>
											)}
											{model.modelType.toLowerCase() === 'audio' && (
												<>
													{model.pricing.per_second && (
														<div>Per Second: ${Number(model.pricing.per_second).toFixed(DECIMAL_PLACES)}</div>
													)}
													{model.pricing.per_character && Number.isNaN(Number(model.pricing.per_character)) === false && (
														<div>Per Character: ${Number(model.pricing.per_character).toFixed(DECIMAL_PLACES)}</div>
													)}
												</>
											)}
										</div>
									) : (
										"N/A"
									)}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
									{model.tiersData?.free || "N/A"}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500 font-bold">
									{model.tiersData?.["tier-1"] || "N/A"}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-purple-500 font-bold">
									{model.tiersData?.["tier-2"] || "N/A"}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-rose-500 font-bold">
									{model.tiersData?.["tier-3"] || "N/A"}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-rose-600 font-bold">
									{model.tiersData?.["tier-4"] || "N/A"}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default ModelTable;
