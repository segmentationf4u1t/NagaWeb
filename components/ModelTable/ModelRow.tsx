// ModelRow.tsx
import { FC, memo, useEffect, useRef } from "react";
import { TableCell, TableRow } from "../ui/table";
import type { Model } from "./ModelTable";
import PricingInfo from "./PricingInfo";
import TiersInfo from "./TiersInfo";

interface ModelRowProps {
	model: Model;
	style?: React.CSSProperties;
	setRowHeight: (size: number) => void;
}

const ModelRow: FC<ModelRowProps> = ({ model, style, setRowHeight }) => {
	const { id, modelType, pricing, tiersData } = model;
	const rowRef = useRef<HTMLTableRowElement>(null);

	useEffect(() => {
		if (rowRef.current) {
			setRowHeight(rowRef.current.clientHeight);
		}
	}, [setRowHeight]);

	return (
		<TableRow ref={rowRef} style={style}>
			<TableCell className="font-bold">{id}</TableCell>
			<TableCell>{modelType}</TableCell>
			<TableCell>
				{pricing ? <PricingInfo pricing={pricing} /> : "N/A"}
			</TableCell>
			<TableCell>
				{tiersData ? <TiersInfo tierData={tiersData} tierKey="free" /> : "N/A"}
			</TableCell>
			<TableCell className="text-blue-500 font-bold">
				{tiersData ? <TiersInfo tierData={tiersData} tierKey="tier-1" /> : null}
			</TableCell>
			<TableCell className="text-purple-500 font-bold">
				{tiersData ? <TiersInfo tierData={tiersData} tierKey="tier-2" /> : null}
			</TableCell>
			<TableCell className="text-rose-500 font-bold">
				{tiersData ? <TiersInfo tierData={tiersData} tierKey="tier-3" /> : null}
			</TableCell>
			<TableCell className="text-rose-600 font-bold">
				{tiersData ? <TiersInfo tierData={tiersData} tierKey="tier-4" /> : null}
			</TableCell>
		</TableRow>
	);
};

const areEqual = (prevProps: ModelRowProps, nextProps: ModelRowProps) => {
	return (
		prevProps.model.id === nextProps.model.id &&
		prevProps.model === nextProps.model
	);
};

export default memo(ModelRow, areEqual);
