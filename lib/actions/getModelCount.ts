'use server'

import { Endpoints } from "@/conf/cfg";
import { unstable_cache } from 'next/cache';
import type { Model } from '@/types/models';
// Cache the model count for 2 hours
const getCachedModelCount = unstable_cache(
  async () => {
    try {
      const response = await fetch(`${Endpoints.NAGA_BASE_URL}models`);
      const data = await response.json();
      return data.data.filter((model: Model) => model.object === "model").length;
    } catch (error) {
      console.error("Failed to fetch model count:", error);
      return 0;
    }
  },
  ['model-count'], // cache key
  {
    revalidate: 7200, // 2 hours in seconds
    tags: ['model-count']
  }
);

export async function getModelCount(): Promise<number> {
  return getCachedModelCount();
}
