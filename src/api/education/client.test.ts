import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchCatalog, fetchSummary, parseCatalog, parseSummary, PublicApiError } from "./client";
import { courses, summaries, events } from "../../test/fixtures/education";
import { eventDateKey } from "../../utils/date";

afterEach(() => vi.unstubAllGlobals());
const signal = () => new AbortController().signal;
const json = (value: unknown, status = 200) => new Response(JSON.stringify(value), { status, headers: { "Content-Type": "application/json" } });

describe("public education API", () => {
  it("accepts courses without icons and validates optional overrides", () => {
    const withoutIcon = { ...courses[0] };
    delete withoutIcon.icon;
    const parse = (item: unknown) => parseCatalog({ courses: [item], summaries: [], events: [] }).courses[0];
    expect(parse(withoutIcon)).not.toHaveProperty("icon");
    expect(parse({ ...withoutIcon, icon: "book" }).icon).toBe("book");
    expect(parse({ ...withoutIcon, icon: "network" }).icon).toBe("network");
    for (const icon of [null, "", "unrecognized", 0]) expect(() => parse({ ...withoutIcon, icon })).toThrow(PublicApiError);
  });
  it("requests only public metadata and never falls back to fixtures", async () => {
    const fetch = vi.fn().mockResolvedValue(json({ courses: [], summaries: [], events: [] }));
    vi.stubGlobal("fetch", fetch);
    expect(await fetchCatalog(signal())).toEqual({ courses: [], summaries: [], events: [] });
    expect(fetch).toHaveBeenCalledWith("/api/public/catalog", expect.objectContaining({ credentials: "omit", headers: { Accept: "application/json" }, signal: expect.any(AbortSignal) }));
    fetch.mockResolvedValueOnce(json({}, 503));
    await expect(fetchCatalog(signal())).rejects.toMatchObject({ status: 503 });
  });

  it("strips document bodies from the catalog and rejects invalid relations/enums/duplicates", () => {
    const data = parseCatalog({ courses, summaries, events });
    expect(data.summaries[0]).not.toHaveProperty("content");
    expect(() => parseCatalog({ courses: [...courses, courses[0]], summaries, events })).toThrow(PublicApiError);
    expect(() => parseCatalog({ courses: [], summaries, events })).toThrow(PublicApiError);
    expect(() => parseCatalog({ courses: [{ ...courses[0], icon: "unrecognized" }], summaries: [], events: [] })).toThrow(PublicApiError);
    expect(() => parseCatalog({ courses, summaries, events: [{ ...events[0], endsAt: events[0].startsAt }] })).toThrow(PublicApiError);
    expect(() => parseCatalog({ courses, summaries, events: [{ ...events[0], meetingUrl: "javascript:alert(1)" }] })).toThrow(PublicApiError);
  });

  it("separates missing detail from HTTP/network/invalid-body failures", async () => {
    const fetch = vi.fn().mockResolvedValue(json(summaries[0]));
    vi.stubGlobal("fetch", fetch);
    expect(await fetchSummary(summaries[0].id, signal())).toEqual(summaries[0]);
    expect(fetch).toHaveBeenCalledWith(`/api/public/summaries/${summaries[0].id}`, expect.anything());
    fetch.mockResolvedValueOnce(json({}, 404));
    expect(await fetchSummary("missing", signal())).toBeNull();
    fetch.mockResolvedValueOnce(json({}, 403));
    await expect(fetchSummary("restricted", signal())).rejects.toMatchObject({ status: 403 });
    fetch.mockRejectedValueOnce(new TypeError("Network unavailable"));
    await expect(fetchSummary("unavailable", signal())).rejects.toThrow("Network unavailable");
    fetch.mockResolvedValueOnce(new Response("<html>SPA fallback</html>", { headers: { "Content-Type": "text/html" } }));
    await expect(fetchCatalog(signal())).rejects.toThrow(PublicApiError);
    fetch.mockResolvedValueOnce(new Response("{", { headers: { "Content-Type": "application/json" } }));
    await expect(fetchCatalog(signal())).rejects.toThrow(PublicApiError);
  });

  it("rejects mismatched detail IDs and unsupported reader content", () => {
    expect(() => parseSummary(summaries[0], "another-id")).toThrow(PublicApiError);
    expect(() => parseSummary({ ...summaries[0], content: { type: "doc", content: [{ type: "script" }] } }, summaries[0].id)).toThrow(PublicApiError);
    expect(() => parseSummary({ ...summaries[0], content: { type: "doc", content: [{ type: "inlineMath", attrs: { latex: 4 } }] } }, summaries[0].id)).toThrow(PublicApiError);
  });

  it("preserves request cancellation and uses Jakarta calendar dates", async () => {
    const fetch = vi.fn().mockImplementation((_url, options: RequestInit) => {
      expect(options.signal?.aborted).toBe(true);
      return Promise.reject(new DOMException("Cancelled", "AbortError"));
    });
    vi.stubGlobal("fetch", fetch);
    const controller = new AbortController(); controller.abort();
    await expect(fetchCatalog(controller.signal)).rejects.toMatchObject({ name: "AbortError" });
    expect(eventDateKey("2027-01-31T19:00:00Z")).toBe("2027-02-01");
  });
});
