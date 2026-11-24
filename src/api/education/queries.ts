import { useQuery } from "@tanstack/react-query";
import { fetchCatalog, fetchSummary, PublicApiError } from "./client";
export type { EducationData } from "./client";

export const educationKey = ["education", "catalog"] as const;
export const summaryKey = (id: string) => ["education", "summary", id] as const;
const retry = (count: number, error: Error) => count < 1 && !(error instanceof PublicApiError && (!error.status || error.status < 500));

export function useEducationData() {
  return useQuery({
    queryKey: educationKey,
    queryFn: ({ signal }) => fetchCatalog(signal),
    staleTime: 60000,
    refetchOnWindowFocus: true,
    retry,
  });
}

export function useSummary(id?: string) {
  return useQuery({
    queryKey: summaryKey(id ?? ""),
    queryFn: ({ signal }) => fetchSummary(id ?? "", signal),
    staleTime: 60000,
    refetchOnWindowFocus: true,
    retry,
  });
}
