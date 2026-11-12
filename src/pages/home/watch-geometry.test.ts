import { describe, expect, it } from "vitest";
import { bubblePositions, horizontalPositions, scatteredPositions, courseExpansion, edgeScale, hiddenBubbleDirections, inwardOrigin } from "./watch-geometry";

describe("watch geometry", () => {
  it("keeps partially hidden and off-screen courses discoverable in one direction each", () => {
    const groups = hiddenBubbleDirections([{ x: 0, y: 0 }, { x: -500, y: 0 }, { x: 500, y: 0 }, { x: 0, y: -500 }, { x: 0, y: 500 }, { x: 140, y: 120 }], 320, 400, 112);
    expect(groups).toEqual({ left: [1], right: [2, 5], above: [3], below: [4] });
    expect(Object.values(groups).flat()).toHaveLength(5);
    expect(hiddenBubbleDirections([{ x: 0, y: 0 }], 320, 400, 112)).toEqual({ left: [], right: [], above: [], below: [] });
  });
  it("packs offset circles tightly without rows, overlap, or per-render reshuffling", () => {
    for (const count of [7, 19, 43]) {
      const points = scatteredPositions(count, 130);
      expect(points).toEqual(scatteredPositions(count, 130));
      expect(points).toHaveLength(count);
      expect(points[0]).toEqual({ x: 0, y: 0 });
      expect(new Set(points.map(point => Math.round(point.y))).size).toBeGreaterThan(count * 0.8);
      const extentX = Math.max(...points.map(p => p.x)) - Math.min(...points.map(p => p.x));
      const extentY = Math.max(...points.map(p => p.y)) - Math.min(...points.map(p => p.y));
      expect(extentX / extentY).toBeGreaterThan(0.8);
      expect(extentX / extentY).toBeLessThan(1.25);
      points.forEach((a, i) => points.slice(i + 1).forEach(b => expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThanOrEqual(129.999)));
      points.forEach((point, i) => {
        if (i > 0) expect(Math.min(...points.slice(0, i).map(other => Math.hypot(point.x - other.x, point.y - other.y)))).toBeCloseTo(130, 2);
      });
    }
  });
  it("adds courses sideways without increasing the vertical footprint", () => {
    for (const height of [240, 380, 540]) {
      const size = 112;
      const first = horizontalPositions(7, size + 18, height, size);
      const many = horizontalPositions(43, size + 18, height, size);
      expect(many.slice(0, 7)).toEqual(first);
      expect(many[0]).toEqual({ x: 0, y: 0 });
      expect(Math.max(...many.map(p => Math.abs(p.y)))).toBe(Math.max(...first.map(p => Math.abs(p.y))));
      expect(Math.max(...many.map(p => Math.abs(p.x)))).toBeGreaterThan(Math.max(...first.map(p => Math.abs(p.x))));
      many.forEach((a, i) => many.slice(i + 1).forEach(b => expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThanOrEqual(size + 17.9)));
      many.forEach(p => expect(Math.abs(p.y) + size / 2).toBeLessThan(height / 2));
    }
  });
  it("fits larger resources with local collision pushes and no global shrinking", () => {
    for (const width of [288, 358, 608, 1080]) {
      const size = Math.min(160, Math.max(112, (width - 64) / 2.5));
      for (const count of [2, 3, 4, 5, 7, 9, 19]) {
        const base = bubblePositions(count, size + 18, width < size * 3 + 60 || (count > 7 && width < size * 5 + 100));
        const height = Math.max(420, Math.ceil((Math.max(...base.map(p => Math.abs(p.y))) + size * 0.6 + 14) * 2));
        const original = structuredClone(base);
        base.slice(1).forEach((parent, i) => {
          const expanded = courseExpansion(base, i + 1, size, width, height);
          expect(base).toEqual(original);
          expect(expanded.origin).toEqual(parent);
          expect(expanded.points[i + 1]).toEqual(parent);
          expect(expanded.resources, JSON.stringify({ width, count, selected: i + 1, size, height })).toHaveLength(2);
          expect(expanded).toEqual(courseExpansion(base, i + 1, size, width, height));
          expect(expanded.small).toBeLessThan(size);
          expect(expanded.small).toBeGreaterThanOrEqual(80);
          const circles = [...expanded.points.map(p => ({ ...p, size })), ...expanded.resources.map(p => ({ ...p, size: expanded.small }))];
          circles.forEach((a, j) => circles.slice(j + 1).forEach(b => {
            expect(Math.hypot(a.x - b.x, a.y - b.y), JSON.stringify({ width, count, selected: i + 1, a, b })).toBeGreaterThanOrEqual((a.size + b.size) / 2 + 1);
          }));
          expanded.resources.forEach(p => {
            expect(Math.hypot(p.x - parent.x, p.y - parent.y) - (size + expanded.small) / 2).toBeLessThanOrEqual(22.001);
            expect(Math.abs(p.x) + expanded.small / 2).toBeLessThan(width / 2);
            expect(Math.abs(p.y) + expanded.small / 2).toBeLessThan(height / 2);
            expect(edgeScale(p.x, p.y, width, height, expanded.small)).toBe(1);
          });
        });
      }
    }
  });
  it("anchors edge shrink toward the inner field rather than the clipped edge", () => {
    expect(inwardOrigin(0, 640, 160)).toBe(0.5);
    expect(inwardOrigin(300, 640, 160)).toBe(0);
    expect(inwardOrigin(-300, 640, 160)).toBe(1);
    for (const position of [60, 150, 240]) {
      expect(inwardOrigin(position, 640, 160)).toBeLessThan(0.5);
      expect(inwardOrigin(-position, 640, 160)).toBeGreaterThan(0.5);
      expect(inwardOrigin(position, 640, 160) + inwardOrigin(-position, 640, 160)).toBeCloseTo(1);
    }
  });
  it("keeps hexagonal centers at least one full step apart", () => {
    for (const count of [1, 2, 3, 4, 5, 7, 8, 19, 30]) {
      for (const compact of [false, true]) {
        const points = bubblePositions(count, 130, compact);
        expect(points).toHaveLength(count);
        expect(points[0]).toEqual({ x: 0, y: 0 });
        points.forEach((a, i) => points.slice(i + 1).forEach((b) => {
          expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThanOrEqual(129.999);
        }));
      }
    }
  });
  it("keeps all initial course choices full size on compact and wide screens", () => {
    for (const width of [288, 358, 608, 1080]) {
      const size = Math.min(160, Math.max(112, (width - 64) / 2.5));
      for (const count of [3, 4, 7]) {
        const points = bubblePositions(count, size + 18, width < size * 3 + 60);
        const height = Math.max(420, Math.ceil((Math.max(...points.map((p) => Math.abs(p.y))) + size * 0.6 + 14) * 2));
        points.forEach((point) => expect(edgeScale(point.x, point.y, width, height, size)).toBe(1));
      }
    }
  });
  it("shrinks continuously at every edge and never expands circles into each other", () => {
    expect(edgeScale(0, 0, 320, 420, 112)).toBe(1);
    for (const axis of ["x", "y"] as const) {
      const size = axis === "x" ? 320 : 420;
      const values = [0, 0.4, 0.75, 0.9, 1, 1.2].map((progress) => edgeScale(
        axis === "x" ? size / 2 * progress : 0,
        axis === "y" ? size / 2 * progress : 0, 320, 420, 112,
      ));
      expect(values).toEqual([...values].sort((a, b) => b - a));
      expect(values.at(-1)).toBe(0);
    }
    expect(edgeScale(120, 0, 320, 420, 112)).toBeLessThan(edgeScale(60, 0, 320, 420, 112));
    expect(edgeScale(-120, 0, 320, 420, 112)).toBe(edgeScale(120, 0, 320, 420, 112));
  });
});
