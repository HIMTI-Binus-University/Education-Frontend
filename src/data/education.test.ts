import { describe, expect, it } from "vitest";
import { resolveCourseIcon } from "./education";

describe("automatic course icons", () => {
  it.each([
    ["Database Systems", "CS101", "database"],
    ["BASIS DATA", "CS102", "database"],
    ["Calculus", "CS103", "math"],
    ["Aljabar Linear", "CS104", "math"],
    ["Pemrograman Berorientasi Objek", "CS105", "code"],
    ["Algorithm & Programming", "CS106", "code"],
    ["Jaringan Komputer", "CS107", "network"],
    ["Distributed Systems", "CS108", "network"],
    ["Sistem Operasi", "CS109", "terminal"],
    ["Computer Architecture", "CS110", "box"],
    ["Web Programming", "DB", "code"],
    ["Unknown course", "dbms", "database"],
    ["Unknown course", "CALC", "math"],
    ["Unknown course", "ALGO", "code"],
    ["Unknown course", "OS", "terminal"],
    ["Computer-Networks", "CS111", "network"],
    ["Jaringan   Komputer", "CS112", "network"],
    ["History", "HIST", "book"],
    ["Personal Development", "PERSONAL", "book"],
  ])("infers %s / %s as %s without an override", (name, code, icon) => {
    expect(resolveCourseIcon({ name, code })).toBe(icon);
  });

  it("preserves backend overrides, including explicit book", () => {
    expect(resolveCourseIcon({ name: "Database", code: "DB", icon: "network" })).toBe("network");
    expect(resolveCourseIcon({ name: "Database", code: "DB", icon: "book" })).toBe("book");
  });
});
