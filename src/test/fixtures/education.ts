import type { Course, Summary, AcademicEvent } from "../../data/education";
import { summaryDocuments } from "./summary-documents";

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
  { id: "discrete-math", name: "Discrete Mathematics", code: "DMATH", semester: 1, icon: "math", description: "Demo course covering logic, sets, graphs, and counting." },
  { id: "linear-algebra", name: "Linear Algebra", code: "LINALG", semester: 1, icon: "math", description: "Demo course covering vectors, matrices, and linear transformations." },
  { id: "data-structures", name: "Data Structures", code: "DS", semester: 3, icon: "code", description: "Demo course covering lists, trees, hash tables, and algorithm analysis." },
  { id: "object-oriented", name: "Object-Oriented Programming", code: "OOP", semester: 3, icon: "code", description: "Demo course covering objects, interfaces, and reusable program design." },
  { id: "statistics", name: "Probability & Statistics", code: "STAT", semester: 3, icon: "math", description: "Demo course covering probability, distributions, and statistical inference." },
  { id: "software-engineering", name: "Software Engineering", code: "SE", semester: 5, icon: "box", description: "Demo course covering requirements, testing, and software delivery." },
  { id: "web-programming", name: "Web Programming", code: "WEB", semester: 5, icon: "code", description: "Demo course covering browser applications, HTTP, and web development." },
  { id: "human-computer", name: "Human–Computer Interaction", code: "HCI", semester: 5, icon: "box", description: "Demo course covering interface design, usability, and accessibility." },
  { id: "artificial-intelligence", name: "Artificial Intelligence", code: "AI", semester: 5, icon: "network", description: "Demo course covering search, reasoning, and intelligent systems." },
  { id: "information-security", name: "Information Security", code: "SEC", semester: 5, icon: "terminal", description: "Demo course covering threats, cryptography, and secure systems." },
  { id: "distributed-systems", name: "Distributed Systems", code: "DIST", semester: 5, icon: "network", description: "Demo course covering coordination, replication, and fault tolerance." },
  { id: "computer-graphics", name: "Computer Graphics", code: "CG", semester: 5, icon: "box", description: "Demo course covering geometry, rendering, and visual computing." },
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
