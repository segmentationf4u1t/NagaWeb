interface Categories {
	reasoning: string[];
	coding: string[];
	mathematics: string[];
	data_analysis: string[];
	language: string[];
	if: string[];
	[key: string]: string[];
}

interface CheckedCategories {
	[key: string]: {
		average: boolean;
		allSubcategories: boolean;
	};
}

export const getGlobalAverageColumns = (
	checkedCategories: CheckedCategories,
	categories: Categories,
) => {
	return Object.entries(checkedCategories).flatMap(([category, checks]) =>
		checks.average
			? categories[category]
			: checks.allSubcategories
				? categories[category]
				: [],
	);
};

export const getGlobalAverage = (
	row: Record<string, string | number>,
	checkedCategories: CheckedCategories,
	categories: Categories,
) => {
	const averages = Object.entries(checkedCategories)
		.flatMap(([category, checks]) =>
			checks.average
				? [calculateAverage(row, categories[category])]
				: checks.allSubcategories
					? [calculateAverage(row, categories[category])]
					: [],
		)
		.filter((val): val is number => typeof val === 'number');  // Filter out '-' strings
	
	const avg = averages.length
		? averages.reduce((a, b) => a + b) / averages.length
		: 0;
	return avg.toFixed(2);
};

export const calculateAverage = (
	row: Record<string, string | number>,
	columns: string[],
) => {
	if (!columns) return '-';
	const validValues = columns
			.map(col => Number.parseFloat(row[col] as string))
			.filter(val => !Number.isNaN(val));
	const average = validValues.length > 0 
			? validValues.reduce((a, b) => a + b, 0) / validValues.length 
			: Number.NaN;
	return Number.isNaN(average) ? '-' : average;
};
