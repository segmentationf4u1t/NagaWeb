import { memo } from 'react';
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProcessedResults, SortConfig } from '@/types/types';

interface TableHeaderProps {
  column: keyof ProcessedResults;
  label: string;
  sortConfig: SortConfig;
  onSort: (key: keyof ProcessedResults) => void;
}

export const TableHeader = memo(function TableHeader({ 
  column, 
  label, 
  sortConfig, 
  onSort 
}: TableHeaderProps) {
  const isActive = sortConfig.key === column;
  
  return (
    <th className="px-6 py-3 text-left text-sm">
      <Button
        variant="ghost"
        onClick={() => onSort(column)}
        className="font-medium text-neutral-700 dark:text-neutral-300 p-0 h-auto hover:bg-transparent"
      >
        {label}
        <ArrowUpDown 
          className={`ml-2 h-4 w-4 inline ${
            isActive ? '' : 'opacity-20'
          } ${
            isActive && sortConfig.direction === 'asc' ? 'transform rotate-180' : ''
          }`}
        />
      </Button>
    </th>
  );
});