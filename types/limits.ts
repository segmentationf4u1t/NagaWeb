export interface Limit {
	id: string;
	object: string;
	tiers: LimitTier;
}
interface LimitTier {
	[tierName: string]: [number, string][];
}
