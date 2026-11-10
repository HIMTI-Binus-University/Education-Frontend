import { useQuery } from "@tanstack/react-query";
import apiClient from "@/config/api-client";
import { apiPaths } from "@/constants/api";
import { queryKeys } from "@/constants/query-keys";

interface HealthResponse {
  status: "ok";
  uptime: number;
  timestamp: string;
}

function isHealthResponse(data: unknown): data is HealthResponse {
  if (typeof data !== "object" || data === null) return false;

  const response = data as Record<string, unknown>;
  return (
    response.status === "ok" &&
    typeof response.uptime === "number" &&
    typeof response.timestamp === "string"
  );
}

export function useHealth() {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: async () => {
      const { data } = await apiClient.get<unknown>(apiPaths.health);
      if (!isHealthResponse(data)) throw new Error("Unexpected health response");
      return data;
    },
  });
}
