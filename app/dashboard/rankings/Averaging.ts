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
  categories: Categories
) => {
    return Object.entries(checkedCategories).flatMap(([category, checks]) =>
        checks.average ? categories[category] :
            checks.allSubcategories ? categories[category] : []
    );
};

export const getGlobalAverage = (
  row: Record<string, string | number>,
  checkedCategories: CheckedCategories,
  categories: Categories
) => {
    const averages = Object.entries(checkedCategories).flatMap(([category, checks]) =>
        checks.average ? [calculateAverage(row, categories[category])] : 
            checks.allSubcategories ? [calculateAverage(row, categories[category])] : []
    );
    const avg = averages.length ? averages.reduce((a, b) => a + b) / averages.length : 0;
    return avg.toFixed(2);
};

export const calculateAverage = (row: Record<string, string | number>, columns: string[]) => {
    if (!columns || columns.length === 0) return 0;
    const validValues = columns
        .map(col => typeof row[col] === 'string' ? Number(row[col]) : row[col])
        .filter(val => !Number.isNaN(val as number)) as number[];
    return validValues.length > 0 ? validValues.reduce((a, b) => a + b, 0) / validValues.length : 0;
};