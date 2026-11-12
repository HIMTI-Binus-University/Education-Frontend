import type { JSONContent } from "@tiptap/react";

export interface Course {
  id: string;
  name: string;
  code: string;
  semester: number;
  icon: "code" | "database" | "math" | "box" | "network" | "terminal";
  description: string;
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
