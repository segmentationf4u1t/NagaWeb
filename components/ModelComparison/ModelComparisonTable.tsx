"use client";
import { useState, useMemo, useCallback } from "react";
import { ArrowUpDown, Search } from "lucide-react";
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
import { motion, AnimatePresence } from "framer-motion";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
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

  const filteredAndSortedData = useMemo(() => {
    const filtered = processedData.filter((row) =>
      row.model.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return sortData(filtered, sortConfig);
  }, [processedData, sortConfig, searchTerm]);

  const handleSort = useCallback((key: keyof ProcessedResults) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <motion.div 
        className="relative"
        initial={false}
      >
        <input
          type="text"
          placeholder="Search models..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsSearching(true);
            setTimeout(() => setIsSearching(false), 100);
          }}
          className="w-full px-4 py-2 pl-10 rounded-lg border border-neutral-700 bg-neutral-900 text-neutral-200 
            focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200
            hover:border-neutral-600"
        />
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 transition-transform duration-100 ${
          isSearching ? 'scale-110' : 'scale-100'
        }`} />
        {searchTerm && (
          <button type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
            onClick={() => setSearchTerm("")}
          >
            ✕
          </button>
        )}
      </motion.div>

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
                    <ArrowUpDown className={`ml-2 h-4 w-4 transition-all duration-200 ${
                      sortConfig.key === key ? 'opacity-100' : 'opacity-20'
                    } ${sortConfig.key === key && sortConfig.direction === 'asc' ? 'rotate-180' : ''}`}
                    />
                  </Button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout" initial={false}>
              {filteredAndSortedData.length > 0 ? (
                filteredAndSortedData.map((row) => (
                  <motion.tr
                    key={row.model}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="transition-colors duration-200 hover:bg-muted/50"
                  >
                    {COLUMNS.map(({ key }) => (
                      <TableCell key={key}>
                        {typeof row[key] === 'number' 
                          ? (row[key] as number).toFixed(2) 
                          : row[key]}
                      </TableCell>
                    ))}
                  </motion.tr>
                ))
              ) : (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                >
                  <TableCell colSpan={COLUMNS.length} className="h-32 text-center">
                    <span className="text-neutral-400">
                      No results found for "{searchTerm}"
                    </span>
                  </TableCell>
                </motion.tr>
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
