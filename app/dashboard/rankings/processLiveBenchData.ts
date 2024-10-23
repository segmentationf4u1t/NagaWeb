import { calculateAverage, getGlobalAverage } from "./Averaging";

type ProcessedResults = {
  model: string;
  global_average: number;
  reasoning_average: number;
  coding_average: number;
  mathematics_average: number;
  data_analysis_average: number;
  language_average: number;
  if_average: number;
}

interface Categories {
  reasoning: string[];
  coding: string[];
  mathematics: string[];
  data_analysis: string[];
  language: string[];
  if: string[];
  [key: string]: string[]; // Add index signature
}

export function processLivebenchData(csvContent: string): ProcessedResults[] {
  const categories: Categories = {
    reasoning: ['connections', 'plot_unscrambling', 'spatial', 'zebra_puzzle'],
    coding: ['coding_completion', 'LCB_generation'],
    mathematics: ['math_comp', 'olympiad'],
    data_analysis: ['tablejoin', 'tablereformat'],
    language: ['paraphrase', 'story_generation', 'summarize', 'typos'],
    if: ['AMPS_Hard', 'cta', 'simplify', 'web_of_lies_v2']
  };

  // Initialize checked categories state
  const checkedCategories = Object.keys(categories).reduce((acc, category) => {
    acc[category] = { average: true, allSubcategories: false };
    return acc;
  }, {} as Record<string, { average: boolean, allSubcategories: boolean }>);

  // Parse CSV data
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',');
  
  const results: ProcessedResults[] = [];
  
  // Process each line
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const row = headers.reduce((acc, header, index) => {
      acc[header] = values[index];
      return acc;
    }, {} as Record<string, string>);

    const result: ProcessedResults = {
      model: row.model,
      reasoning_average: Number(calculateAverage(row, categories.reasoning)),
      coding_average: Number(calculateAverage(row, categories.coding)),
      mathematics_average: Number(calculateAverage(row, categories.mathematics)),
      data_analysis_average: Number(calculateAverage(row, categories.data_analysis)),
      language_average: Number(calculateAverage(row, categories.language)),
      if_average: Number(calculateAverage(row, categories.if)),
      global_average: 0
    };

    result.global_average = Number(getGlobalAverage(row, checkedCategories, categories));
    results.push(result);
  }

  return results.sort((a, b) => b.global_average - a.global_average);
}
