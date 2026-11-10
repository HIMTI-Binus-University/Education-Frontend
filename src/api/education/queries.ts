import { useQuery } from "@tanstack/react-query";
import {
  courses,
  summaries,
  events,
  type Course,
  type Summary,
  type AcademicEvent,
} from "../../data/demo";

export interface EducationData {
  courses: Course[];
  summaries: Summary[];
  events: AcademicEvent[];
}

// Fixtures are public-only demo data. Replace this query after public API contracts are approved.
export function useEducationData() {
  return useQuery<EducationData>({
    queryKey: ["education", "demo"],
    queryFn: async () => ({ courses, summaries, events }),
    staleTime: Infinity,
  });
}
