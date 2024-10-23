import type { ProcessedResults, SortConfig } from '@/types/types';
// Update the function signature to accept readonly arrays
export const calculateAverage = (
    row: ProcessedResults | Record<string, number>, 
    columns: readonly string[]
  ) => {
    if (!columns?.length) return 0;
    const validValues = columns
      .map(col => typeof row[col] === 'string' ? Number.parseFloat(row[col] as string) : row[col] as number)
      .filter(val => !Number.isNaN(val));
    return validValues.length > 0 
      ? Number((validValues.reduce((a, b) => a + b, 0) / validValues.length).toFixed(2))
      : 0;
  };
  
  
  export const sortData = (data: ProcessedResults[], sortConfig: SortConfig) => {
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      const aNum = typeof aValue === 'string' ? Number.parseFloat(aValue) : aValue;
      const bNum = typeof bValue === 'string' ? Number.parseFloat(bValue) : bValue;
      
      return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
    });
  };