import type { JSONContent } from "@tiptap/react";
import type { AcademicEvent, Course, Summary, SummaryMetadata } from "../../data/education";

export interface EducationData {
  courses: Course[];
  summaries: SummaryMetadata[];
  events: AcademicEvent[];
}

export class PublicApiError extends Error {
  constructor(message: string, public status?: number) { super(message); }
}

const baseUrl = (import.meta.env.VITE_PUBLIC_API_BASE_URL || "/api/public").replace(/\/+$/, "");
const object = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
const text = (value: unknown): value is string => typeof value === "string";
const identifier = (value: unknown): value is string => text(value) && /^[A-Za-z0-9_-]{1,128}$/.test(value);
const positiveInteger = (value: unknown): value is number => Number.isInteger(value) && Number(value) > 0;
const invalid = (): never => { throw new PublicApiError("Invalid public API response"); };

function course(value: unknown): Course {
  if (!object(value) || !identifier(value.id) || !text(value.name) || !value.name.trim() || !text(value.code) || !value.code.trim() || !positiveInteger(value.semester) || !["code", "database", "math", "box", "network", "terminal"].includes(String(value.icon)) || !text(value.description)) return invalid();
  return { id: value.id, name: value.name, code: value.code, semester: value.semester, icon: value.icon as Course["icon"], description: value.description };
}

function metadata(value: unknown): SummaryMetadata {
  if (!object(value) || !identifier(value.id) || !text(value.title) || !value.title.trim() || !identifier(value.courseId) || !text(value.academicPeriod) || !positiveInteger(value.semester) || !["Mid Exam", "Final Exam"].includes(String(value.examType)) || !Array.isArray(value.contributors)) return invalid();
  const contributors = value.contributors.map(item => {
    if (!object(item) || !identifier(item.id) || !text(item.displayName) || !item.displayName.trim()) return invalid();
    return { id: item.id, displayName: item.displayName };
  });
  unique(contributors);
  return { id: value.id, title: value.title, courseId: value.courseId, academicPeriod: value.academicPeriod, semester: value.semester, examType: value.examType as SummaryMetadata["examType"], contributors };
}

function event(value: unknown): AcademicEvent {
  if (!object(value) || !identifier(value.id) || !text(value.title) || !value.title.trim() || !identifier(value.courseId) || !["Study Club", "Responsi"].includes(String(value.type)) || !text(value.location) || !text(value.description)) return invalid();
  const timestamp = (time: unknown): time is string => text(time) && /(?:Z|[+-]\d{2}:\d{2})$/.test(time) && Number.isFinite(Date.parse(time));
  if (!timestamp(value.startsAt) || !timestamp(value.endsAt) || Date.parse(value.endsAt) <= Date.parse(value.startsAt)) return invalid();
  if (value.quota !== undefined && (!Number.isInteger(value.quota) || Number(value.quota) < 0)) return invalid();
  const links: Partial<Pick<AcademicEvent, "meetingUrl" | "registrationUrl" | "recordingUrl">> = {};
  for (const key of ["meetingUrl", "registrationUrl", "recordingUrl"] as const) {
    if (value[key] === undefined) continue;
    if (!text(value[key])) return invalid();
    try {
      const url = new URL(value[key]);
      if (url.protocol !== "https:" || url.username || url.password) return invalid();
    } catch { return invalid(); }
    links[key] = value[key];
  }
  return { id: value.id, title: value.title, courseId: value.courseId, type: value.type as AcademicEvent["type"], startsAt: value.startsAt, endsAt: value.endsAt, location: value.location, description: value.description, ...links, ...(value.quota === undefined ? {} : { quota: Number(value.quota) }) };
}

function unique(items: { id: string }[]) {
  if (new Set(items.map(item => item.id)).size !== items.length) invalid();
}

export function parseCatalog(value: unknown): EducationData {
  if (!object(value) || !Array.isArray(value.courses) || !Array.isArray(value.summaries) || !Array.isArray(value.events)) return invalid();
  const result = { courses: value.courses.map(course), summaries: value.summaries.map(metadata), events: value.events.map(event) };
  unique(result.courses); unique(result.summaries); unique(result.events);
  if (new Set(result.courses.map(item => item.code.toLowerCase())).size !== result.courses.length) return invalid();
  const byId = new Map(result.courses.map(item => [item.id, item]));
  if (result.summaries.some(item => byId.get(item.courseId)?.semester !== item.semester) || result.events.some(item => !byId.has(item.courseId))) return invalid();
  return result;
}

export function parseSummary(value: unknown, id: string): Summary {
  const result = metadata(value);
  if (!object(value) || result.id !== id || !object(value.content) || value.content.type !== "doc" || !Array.isArray(value.content.content)) return invalid();
  let nodes = 0;
  const nodeTypes = new Set(["doc", "text", "paragraph", "heading", "blockquote", "bulletList", "orderedList", "listItem", "horizontalRule", "hardBreak", "codeBlock", "image", "table", "tableRow", "tableHeader", "tableCell", "inlineMath", "blockMath"]);
  const validate = (node: unknown, depth: number): boolean => {
    if (++nodes > 20000 || depth > 40 || !object(node) || !text(node.type) || !nodeTypes.has(node.type)) return false;
    if (node.text !== undefined && !text(node.text)) return false;
    if (node.attrs !== undefined && !object(node.attrs)) return false;
    if (node.marks !== undefined && (!Array.isArray(node.marks) || !node.marks.every(mark => object(mark) && ["bold", "italic", "strike", "code", "link", "underline"].includes(String(mark.type)) && (mark.attrs === undefined || object(mark.attrs))))) return false;
    if (node.type === "text" && !text(node.text)) return false;
    if (["inlineMath", "blockMath"].includes(node.type) && (!object(node.attrs) || !text(node.attrs.latex))) return false;
    if (node.type === "heading" && (!object(node.attrs) || ![2, 3].includes(Number(node.attrs.level)))) return false;
    return node.content === undefined || (Array.isArray(node.content) && node.content.every(child => validate(child, depth + 1)));
  };
  if (!validate(value.content, 0)) return invalid();
  return { ...result, content: value.content as JSONContent };
}

async function request(path: string, signal: AbortSignal): Promise<unknown> {
  const response = await fetch(`${baseUrl}${path}`, { headers: { Accept: "application/json" }, credentials: "omit", signal: AbortSignal.any([signal, AbortSignal.timeout(15000)]) });
  if (!response.ok) throw new PublicApiError("Public API request failed", response.status);
  if (!/application\/(?:[\w.-]+\+)?json\b/i.test(response.headers.get("content-type") ?? "")) return invalid();
  try { return await response.json(); }
  catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    return invalid();
  }
}

export async function fetchCatalog(signal: AbortSignal) {
  return parseCatalog(await request("/catalog", signal));
}

export async function fetchSummary(id: string, signal: AbortSignal) {
  if (!identifier(id)) return null;
  try { return parseSummary(await request(`/summaries/${encodeURIComponent(id)}`, signal), id); }
  catch (error) {
    if (error instanceof PublicApiError && error.status === 404) return null;
    throw error;
  }
}
