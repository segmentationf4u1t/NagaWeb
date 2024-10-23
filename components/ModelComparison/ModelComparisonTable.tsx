"use client";
import { useState, useMemo, useCallback } from "react";
import { ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from '@/constants';
import { calculateAverage, sortData } from '@/lib/cUtils';
import type { ProcessedResults, SortConfig } from '@/types/types';

interface Props {
  rawData: ProcessedResults[];
}

const COLUMNS = [
  { key: 'model', label: 'Model' },
  { key: 'global_average', label: 'Global Average' },
  { key: 'reasoning_average', label: 'Reasoning' },
  { key: 'coding_average', label: 'Coding' },
  { key: 'mathematics_average', label: 'Mathematics' },
  { key: 'data_analysis_average', label: 'Data Analysis' },
  { key: 'language_average', label: 'Language' },
  { key: 'if_average', label: 'IF' },
] as const;

export default function ModelComparisonTable({ rawData }: Props) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'global_average',
    direction: 'desc'
  });

  const processedData = useMemo(() => {
    return rawData.map(row => ({
      ...row,
      reasoning_average: calculateAverage(row, CATEGORIES.reasoning),
      coding_average: calculateAverage(row, CATEGORIES.coding),
      mathematics_average: calculateAverage(row, CATEGORIES.mathematics),
      data_analysis_average: calculateAverage(row, CATEGORIES.data_analysis),
      language_average: calculateAverage(row, CATEGORIES.language),
      if_average: calculateAverage(row, CATEGORIES.if),
      global_average: calculateAverage(row, Object.values(CATEGORIES).flat())
    }));
  }, [rawData]);

  const sortedData = useMemo(() => 
    sortData(processedData, sortConfig),
    [processedData, sortConfig]
  );

  const handleSort = useCallback((key: keyof ProcessedResults) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {COLUMNS.map(({ key, label }) => (
              <TableHead key={key} className="whitespace-nowrap">
                <Button
                  variant="ghost"
                  onClick={() => handleSort(key as keyof ProcessedResults)}
                  className="h-8 p-0 font-bold hover:bg-transparent"
                >
                  {label}
                  <ArrowUpDown 
                    className={`ml-2 h-4 w-4 ${
                      sortConfig.key === key 
                        ? 'opacity-100' 
                        : 'opacity-20'
                    } ${
                      sortConfig.key === key && sortConfig.direction === 'asc' 
                        ? 'rotate-180' 
                        : ''
                    }`}
                  />
                </Button>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((row) => (
            <TableRow key={row.model}>
              {COLUMNS.map(({ key }) => (
                <TableCell key={key}>
                  {typeof row[key] === 'number' 
                    ? (row[key] as number).toFixed(2) 
                    : row[key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
