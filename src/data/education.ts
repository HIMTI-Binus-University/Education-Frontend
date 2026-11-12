import type { JSONContent } from "@tiptap/react";

export const courseIconNames = ["code", "database", "math", "box", "network", "terminal", "book"] as const;
export type CourseIconName = typeof courseIconNames[number];

export interface Course {
  id: string;
  name: string;
  code: string;
  semester: number;
  icon?: CourseIconName;
  description: string;
}

const courseIconRules: [CourseIconName, RegExp][] = [
  ["database", /\b(databases?|basis data|pangkalan data|sql|db|dbms|rdbms)\b/],
  ["terminal", /\b(operating systems?|sistem operasi|linux|unix|os|information security|keamanan informasi)\b/],
  ["network", /\b(networks?|networking|jaringan|distributed systems?|sistem terdistribusi|net)\b/],
  ["math", /\b(mathematics|math|matematika|calculus|kalkulus|algebra|aljabar|statistics|statistika|statistik|probability|probabilitas|diskrit|calc|stat|linalg|dmath)\b/],
  ["box", /\b(architecture|arsitektur|computer graphics|grafika komputer|software engineering|rekayasa perangkat lunak|arch|cg|se)\b/],
  ["code", /\b(programming|pemrograman|algorithms?|algoritma|data structures?|struktur data|web|coding|oop|algo|ds)\b/],
];

export function resolveCourseIcon(course: Pick<Course, "name" | "code" | "icon">): CourseIconName {
  if (course.icon) return course.icon;
  for (const value of [course.name, course.code]) {
    const normalized = value.toLocaleLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ");
    const match = courseIconRules.find(([, pattern]) => pattern.test(normalized));
    if (match) return match[0];
  }
  return "book";
}

export interface Contributor {
  id: string;
  displayName: string;
}

export interface SummaryMetadata {
  id: string;
  title: string;
  courseId: string;
  academicPeriod: string;
  semester: number;
  examType: "Mid Exam" | "Final Exam";
  contributors: Contributor[];
}

export interface Summary extends SummaryMetadata {
  content: JSONContent;
}

export interface AcademicEvent {
  id: string;
  title: string;
  type: "Study Club" | "Responsi";
  courseId: string;
  startsAt: string;
  endsAt: string;
  location: string;
  description: string;
  meetingUrl?: string;
  registrationUrl?: string;
  quota?: number;
  recordingUrl?: string;
}

export function findSummaries<T extends SummaryMetadata>(items: T[], search: string, courseId: string) {
  const term = search.trim().toLocaleLowerCase();
  return items.filter(item => (!courseId || item.courseId === courseId) && item.title.toLocaleLowerCase().includes(term));
}

export function findCourses(items: Course[], search: string) {
  const term = search.trim().toLocaleLowerCase();
  return items.filter(course => course.name.toLocaleLowerCase().includes(term) || course.code.toLocaleLowerCase().includes(term));
}

export function youtubeEmbedUrl(raw?: string): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:") return null;
    const host = url.hostname.toLowerCase();
    const id = host === "youtu.be" ? url.pathname.slice(1)
      : ["youtube.com", "www.youtube.com", "m.youtube.com"].includes(host)
        ? url.pathname === "/watch" ? url.searchParams.get("v") : url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)$/)?.[1]
        : null;
    return id && /^[\w-]{11}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  } catch { return null; }
}

export function safeExternalUrl(raw?: string): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}
