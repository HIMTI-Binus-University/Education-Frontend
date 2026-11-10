import type { JSONContent } from "@tiptap/react";
import { summaryDocuments } from "./summary-documents";

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

export interface Summary {
  id: string;
  title: string;
  courseId: string;
  academicPeriod: string;
  semester: number;
  examType: "Mid Exam" | "Final Exam";
  contributors: Contributor[];
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

export const courses: Course[] = [
  {
    id: "algorithm",
    name: "Algorithm & Programming",
    code: "ALGO",
    semester: 1,
    icon: "code",
    description:
      "Build a foundation in problem-solving, algorithms, and programming.",
  },
  {
    id: "database",
    name: "Database Systems",
    code: "DB",
    semester: 3,
    icon: "database",
    description: "Understand data modelling, relational databases, and SQL.",
  },
  {
    id: "calculus",
    name: "Calculus",
    code: "CALC",
    semester: 1,
    icon: "math",
    description:
      "Work through limits, derivatives, and integrals, one concept at a time.",
  },
  {
    id: "architecture",
    name: "Computer Architecture",
    code: "ARCH",
    semester: 3,
    icon: "box",
    description:
      "Learn how processors, memory, and computer systems work together.",
  },
  {
    id: "networks",
    name: "Computer Networks",
    code: "NET",
    semester: 5,
    icon: "network",
    description:
      "Connect the concepts behind protocols, routing, and reliable communication.",
  },
  {
    id: "operating-systems",
    name: "Operating Systems",
    code: "OS",
    semester: 3,
    icon: "terminal",
    description: "Explore processes, concurrency, and resource management.",
  },
];

export const summaries: Summary[] = [
  {
    id: "dynamic-programming",
    title: "Dynamic Programming",
    courseId: "algorithm",
    academicPeriod: "2026/2027",
    semester: 1,
    examType: "Mid Exam",
    contributors: [
      {
        id: "demo-algorithm-contributor",
        displayName: "[Contributor demo: Algorithm]",
      },
    ],
    content: summaryDocuments["dynamic-programming"],
  },
  {
    id: "database-normalization",
    title: "Database Normalization",
    courseId: "database",
    academicPeriod: "2026/2027",
    semester: 3,
    examType: "Mid Exam",
    contributors: [
      {
        id: "demo-database-contributor",
        displayName: "[Contributor demo: Database]",
      },
    ],
    content: summaryDocuments["database-normalization"],
  },
  {
    id: "architecture-basics",
    title: "Computer Architecture Basics",
    courseId: "architecture",
    academicPeriod: "2026/2027",
    semester: 3,
    examType: "Mid Exam",
    contributors: [
      {
        id: "demo-architecture-contributor",
        displayName: "[Contributor demo: Architecture]",
      },
    ],
    content: summaryDocuments["architecture-basics"],
  },
  {
    id: "derivatives",
    title: "Limits & Derivatives",
    courseId: "calculus",
    academicPeriod: "2026/2027",
    semester: 1,
    examType: "Mid Exam",
    contributors: [
      {
        id: "demo-calculus-contributor",
        displayName: "[Contributor demo: Calculus]",
      },
      {
        id: "demo-calculus-reviewer",
        displayName: "[Contributor demo: Reviewer]",
      },
    ],
    content: summaryDocuments.derivatives,
  },
];

export const events: AcademicEvent[] = [
  {
    id: "algorithm-study-club",
    title: "Algorithm Study Club",
    type: "Study Club",
    courseId: "algorithm",
    startsAt: "2026-11-02T19:00:00+07:00",
    endsAt: "2026-11-02T20:30:00+07:00",
    location: "Online",
    description:
      "Demo session: work through dynamic programming examples and discuss how to identify subproblems.",
  },
  {
    id: "database-study-club",
    title: "Database Systems Study Club",
    type: "Study Club",
    courseId: "database",
    startsAt: "2026-11-04T19:00:00+07:00",
    endsAt: "2026-11-04T20:30:00+07:00",
    location: "HIMTI Room (demo)",
    description:
      "Demo session: revisit functional dependencies and practise decomposing relations.",
  },
  {
    id: "architecture-responsi",
    title: "Computer Architecture Responsi",
    type: "Responsi",
    courseId: "architecture",
    startsAt: "2026-11-07T19:00:00+07:00",
    endsAt: "2026-11-07T21:00:00+07:00",
    location: "Online",
    description:
      "Demo Responsi session covering the instruction cycle, memory hierarchy, and execution-time problems.",
  },
];

export const demoAcademicContext = "Demo period: 2026/2027 · Mid Exam";

export function findSummaries(
  items: Summary[],
  search: string,
  courseId: string,
) {
  const term = search.trim().toLocaleLowerCase();
  return items.filter(
    (item) =>
      (!courseId || item.courseId === courseId) &&
      item.title.toLocaleLowerCase().includes(term),
  );
}

export function findCourses(items: Course[], search: string) {
  const term = search.trim().toLocaleLowerCase();
  return items.filter(
    (course) =>
      course.name.toLocaleLowerCase().includes(term) ||
      course.code.toLocaleLowerCase().includes(term),
  );
}

export function youtubeEmbedUrl(raw?: string): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:") return null;
    const host = url.hostname.toLowerCase();
    const id =
      host === "youtu.be"
        ? url.pathname.slice(1)
        : ["youtube.com", "www.youtube.com", "m.youtube.com"].includes(host)
          ? url.pathname === "/watch"
            ? url.searchParams.get("v")
            : url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)$/)?.[1]
          : null;
    return id && /^[\w-]{11}$/.test(id)
      ? `https://www.youtube-nocookie.com/embed/${id}`
      : null;
  } catch {
    return null;
  }
}

export function safeExternalUrl(raw?: string): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return ["https:", "http:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}
