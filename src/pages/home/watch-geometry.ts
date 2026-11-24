export function bubblePositions(count: number, step: number, compact = false) {
  const row = step * Math.sqrt(3) / 2;
  if (count === 2) return [{ x: 0, y: 0 }, { x: 0, y: -step }];
  if (count === 3) {
    return [
      { x: 0, y: 0 },
      { x: -step / 2, y: -row },
      { x: step / 2, y: row },
    ];
  }
  if (count === 4) {
    return [
      { x: 0, y: 0 },
      { x: 0, y: -step },
      { x: -step / 2, y: row },
      { x: step / 2, y: row },
    ];
  }
  const points = [{ x: 0, y: 0 }];
  if (compact) {
    for (let level = 1; points.length < count; level++) {
      for (const sign of [-1, 1]) {
        for (const x of level % 2 ? [-step / 2, step / 2] : [0]) {
          if (points.length < count) points.push({ x, y: sign * level * row });
        }
      }
    }
    return points;
  }
  const directions = [[-1, 1], [-1, 0], [0, -1], [1, -1], [1, 0], [0, 1]];
  for (let ring = 1; points.length < count; ring++) {
    let q = ring;
    let r = 0;
    for (const [dq, dr] of directions) {
      for (let side = 0; side < ring && points.length < count; side++) {
        points.push({ x: step * (q + r / 2), y: step * Math.sqrt(3) / 2 * r });
        q += dq;
        r += dr;
      }
    }
  }
  return points;
}

export function horizontalPositions(count: number, step: number, height: number, size: number) {
  const row = step * Math.sqrt(3) / 2;
  const threeRows = height >= row * 2 + size * 1.2 + 28;
  const points = [{ x: 0, y: 0 }];
  for (let column = 1; points.length < count; column++) {
    for (const side of [1, -1]) {
      if (points.length >= count) break;
      if (!threeRows) {
        points.push({ x: side * column * step, y: 0 });
        continue;
      }
      for (const y of [0, -row, row]) {
        if (points.length < count) points.push({ x: side * (column - (y === 0 ? 0 : 0.5)) * step, y });
      }
    }
  }
  return points;
}

export function scatteredPositions(count: number, step: number) {
  if (count === 0) return [];
  const points = [{ x: 0, y: 0 }];
  for (let index = 1; index < count; index++) {
    let next = { x: Math.max(...points.map(point => point.x)) + step, y: 0 };
    let nearest = Math.hypot(next.x, next.y);
    // Pack against an existing neighbor; vary the angle, not the spacing.
    points.forEach((parent, parentIndex) => {
      for (let angleIndex = 0; angleIndex < 72; angleIndex++) {
        const angle = (angleIndex * 5 + index * 137.508 + parentIndex * 17) * Math.PI / 180;
        const point = { x: parent.x + Math.cos(angle) * step, y: parent.y + Math.sin(angle) * step };
        const distance = Math.hypot(point.x, point.y);
        if (distance >= nearest) continue;
        if (points.some(other => Math.hypot(point.x - other.x, point.y - other.y) < step - 0.001)) continue;
        next = point;
        nearest = distance;
      }
    });
    points.push(next);
  }
  return points;
}

export function edgeScale(x: number, y: number, width: number, height: number, size: number) {
  const clearance = Math.min(width / 2 - Math.abs(x) - 10, height / 2 - Math.abs(y) - 10);
  return Math.max(0, Math.min(1, clearance / (size * 0.6)));
}

export function inwardOrigin(position: number, extent: number, size: number) {
  return Math.max(0, Math.min(1, 0.5 - position / Math.max(size, extent - size)));
}

export function hiddenBubbleDirections(points: { x: number; y: number }[], width: number, height: number, size: number) {
  const groups: Record<"left" | "right" | "above" | "below", number[]> = { left: [], right: [], above: [], below: [] };
  points.forEach((point, index) => {
    if (edgeScale(point.x, point.y, width, height, size) >= 0.65) return;
    const horizontal = Math.abs(point.x) / Math.max(1, width / 2 - size / 2);
    const vertical = Math.abs(point.y) / Math.max(1, height / 2 - size / 2);
    const direction = horizontal > vertical ? point.x < 0 ? "left" : "right" : point.y < 0 ? "above" : "below";
    groups[direction].push(index);
  });
  return groups;
}

export function courseExpansion(points: { x: number; y: number }[], selected: number, size: number, width: number, height: number) {
  const small = Math.max(80, Math.round(size * 0.7));
  const parent = points[selected];
  if (!parent) return { points, resources: [], origin: { x: 0, y: 0 }, small };
  const radius = size / 2 + small / 2 + 14;
  const candidates: { x: number; y: number; score: number }[] = [];
  // A stable phase varies each course's orbit without random jumps on rerender.
  for (const distance of [radius, radius + 8]) {
    for (let step = 0; step < 72; step++) {
      const angle = (step * 5 + selected * 137.508) * Math.PI / 180;
      const point = { x: parent.x + Math.cos(angle) * distance, y: parent.y + Math.sin(angle) * distance };
      const edge = Math.min(width / 2 - Math.abs(point.x), height / 2 - Math.abs(point.y));
      if (edge < small * 0.6 + 12) continue;
      const penetration = points.reduce((sum, other, i) => i === selected ? sum : sum + Math.max(0, (size + small) / 2 + 10 - Math.hypot(point.x - other.x, point.y - other.y)), 0);
      candidates.push({ ...point, score: -penetration * 2 + (Math.cos(angle) * parent.x + Math.sin(angle) * parent.y) * 0.04 - (distance - radius) * 0.8 });
    }
  }
  const pairs: { resources: { x: number; y: number }[]; score: number }[] = [];
  candidates.forEach((first, i) => candidates.slice(i + 1).forEach(second => {
    const separation = Math.hypot(first.x - second.x, first.y - second.y);
    if (separation < small + 14) return;
    const score = first.score + second.score + Math.min(separation, radius * 1.7) * 0.08;
    pairs.push({ resources: [first, second], score });
  }));
  pairs.sort((a, b) => b.score - a.score);
  const solve = (resources: { x: number; y: number }[]) => {
    const pushed = points.map(point => ({ ...point }));
    const moved = new Set<number>();
    const shift = (index: number, dx: number, dy: number) => {
      if (index === selected) return;
      const limitX = Math.max(Math.abs(points[index].x), width / 2 - size / 2 - 10);
      const limitY = Math.max(Math.abs(points[index].y), height / 2 - size / 2 - 10);
      pushed[index].x = Math.max(-limitX, Math.min(limitX, pushed[index].x + dx));
      pushed[index].y = Math.max(-limitY, Math.min(limitY, pushed[index].y + dy));
      moved.add(index);
    };
    for (let pass = 0; pass < 100; pass++) {
      let overlap = 0;
      pushed.forEach((point, index) => {
        if (index === selected) return;
        resources.forEach(resource => {
          const dx = point.x - resource.x, dy = point.y - resource.y;
          const distance = Math.hypot(dx, dy);
          const penetration = (size + small) / 2 + 10 - distance;
          if (penetration > 0.05) {
            overlap = Math.max(overlap, penetration);
            shift(index, dx / (distance || 1) * penetration, dy / (distance || 1) * penetration);
          }
        });
      });
      pushed.forEach((first, i) => pushed.slice(i + 1).forEach((second, offset) => {
        const j = i + offset + 1;
        if (!moved.has(i) && !moved.has(j)) return;
        const dx = second.x - first.x, dy = second.y - first.y;
        const distance = Math.hypot(dx, dy);
        const penetration = size + 10 - distance;
        if (penetration <= 0.05) return;
        overlap = Math.max(overlap, penetration);
        const moveFirst = i !== selected && (moved.has(j) || j === selected);
        const moveSecond = j !== selected && (moved.has(i) || i === selected);
        const share = moveFirst && moveSecond ? 0.5 : 1;
        if (moveFirst) shift(i, -dx / (distance || 1) * penetration * share, -dy / (distance || 1) * penetration * share);
        if (moveSecond) shift(j, dx / (distance || 1) * penetration * share, dy / (distance || 1) * penetration * share);
      }));
      if (overlap < 0.1) break;
    }
    const circles = [...pushed.map(point => ({ ...point, size })), ...resources.map(point => ({ ...point, size: small }))];
    let overlap = 0;
    circles.forEach((first, i) => circles.slice(i + 1).forEach(second => {
      overlap = Math.max(overlap, (first.size + second.size) / 2 + 8 - Math.hypot(first.x - second.x, first.y - second.y));
    }));
    const distances = pushed.map((point, i) => Math.hypot(point.x - points[i].x, point.y - points[i].y));
    const affected = distances.filter(distance => distance > 0.1).length;
    return { points: pushed, overlap, affected, cost: affected * size + distances.reduce((sum, distance) => sum + distance, 0) };
  };
  let result = { points, resources: [] as { x: number; y: number }[], origin: parent, small };
  let leastOverlap = Infinity;
  let leastCost = Infinity;
  for (const [index, pair] of pairs.slice(0, 400).entries()) {
    const solution = solve(pair.resources);
    if (solution.overlap < leastOverlap - 0.1 || (solution.overlap < 0.1 && solution.cost < leastCost)) {
      leastOverlap = solution.overlap;
      leastCost = solution.cost;
      result = { points: solution.points, resources: pair.resources, origin: parent, small };
    }
    if (leastOverlap < 0.1 && (solution.affected <= 3 || index >= 40)) break;
  }
  return result;
}
