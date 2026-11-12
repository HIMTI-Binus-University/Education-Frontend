import { forwardRef, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  AnimatePresence, animate, motion, useDragControls, useMotionValue, useMotionValueEvent,
  useIsPresent, useReducedMotion, useTransform, type MotionValue,
} from "motion/react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Move, RotateCcw } from "lucide-react";
import { scatteredPositions, courseExpansion, edgeScale, hiddenBubbleDirections, inwardOrigin } from "./watch-geometry";
import { watchTransition } from "./watch-motion";

export interface WatchItem {
  id: string;
  label: string;
  content: ReactNode;
  tone: number;
  onClick?: () => void;
  to?: string;
  selected?: boolean;
  parentId?: string;
}

function WatchBubble({ item, position, origin, faded = false, size, bounds, panX, panY, focusId, fixed }: {
  item: WatchItem;
  position: { x: number; y: number };
  origin?: { x: number; y: number };
  faded?: boolean;
  size: number;
  bounds: { width: number; height: number };
  panX: MotionValue<number>;
  panY: MotionValue<number>;
  focusId?: string;
  fixed?: boolean;
}) {
  const reduced = useReducedMotion();
  const present = useIsPresent();
  const control = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const localX = useMotionValue(position.x);
  const localY = useMotionValue(position.y);
  const x = useTransform(() => localX.get() + panX.get());
  const y = useTransform(() => localY.get() + panY.get());
  const scale = useTransform(() => edgeScale(x.get(), y.get(), bounds.width, bounds.height, size));
  const originX = useTransform(() => inwardOrigin(x.get(), bounds.width, size));
  const originY = useTransform(() => inwardOrigin(y.get(), bounds.height, size));

  useLayoutEffect(() => {
    if (focusId === item.id) control.current?.focus({ preventScroll: true });
  }, [focusId, item.id]);

  const content = (
    <motion.span className="watch-bubble-visual" style={{ scale, originX, originY }}>
      <motion.div
        className={`watch-bubble-surface bubble-tone-${item.tone}`}
        layoutId={item.id === "search" ? "search-shape" : undefined}
        style={{ borderRadius: size / 2 }}
        transition={reduced ? { duration: 0 } : watchTransition}
      />
      <span className="watch-bubble-content">{item.content}</span>
    </motion.span>
  );
  const centerOnFocus = () => {
    if (fixed || focusId === item.id || !control.current?.matches(":focus-visible")) return;
    const targetX = -position.x;
    const targetY = -position.y;
    if (reduced) { panX.jump(targetX); panY.jump(targetY); }
    else {
      animate(panX, targetX, watchTransition);
      animate(panY, targetY, watchTransition);
    }
  };
  return (
    <motion.div
      className={`watch-bubble${item.parentId ? " watch-resource-bubble" : ""}${item.selected ? " is-selected" : ""}`}
      data-bubble-id={item.id}
      aria-hidden={!present}
      inert={!present}
      style={{ x: localX, y: localY, width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2, zIndex: item.parentId ? 2 : 3 }}
      initial={reduced || item.id === "search" ? false : origin ? { x: origin.x, y: origin.y, scale: 0.35 } : item.id !== "back" ? { opacity: 0, scale: 0.9 } : false}
      animate={{ x: position.x, y: position.y, scale: 1, opacity: faded ? 0.74 : 1 }}
      whileHover={{ opacity: 1 }}
      whileFocus={{ opacity: 1 }}
      exit={origin ? { x: origin.x, y: origin.y, scale: 0.2, opacity: 0, transition: { ...watchTransition, duration: reduced ? 0 : 0.24, delay: 0 } } : undefined}
      transition={reduced ? { duration: 0 } : { ...watchTransition, delay: item.parentId ? 0.1 : 0 }}
    >
      {item.to ? (
        <Link ref={(node) => { control.current = node; }} to={item.to} className="learning-bubble" aria-label={item.label} draggable={false} onFocus={centerOnFocus}>
          {content}
        </Link>
      ) : (
        <button ref={(node) => { control.current = node; }} className="learning-bubble" aria-label={item.label} aria-pressed={item.id.startsWith("course-") ? Boolean(item.selected) : undefined} data-mode={item.id} onPointerDown={(event) => {
          // Blurring Search would collapse its list and move Back before pointerup.
          if (fixed && item.id === "back") event.preventDefault();
        }} onClick={item.onClick} onFocus={centerOnFocus}>
          {content}
        </button>
      )}
    </motion.div>
  );
}

const SearchScene = forwardRef<HTMLDivElement, { children: ReactNode }>(function SearchScene({ children }, ref) {
  const present = useIsPresent();
  const reduced = useReducedMotion();
  return <motion.div ref={ref} className="watch-search-scene" aria-hidden={!present} inert={!present} exit={{ opacity: 1 }} transition={reduced ? { duration: 0 } : watchTransition}>{children}</motion.div>;
});

function SearchBack({ item, offset }: { item: WatchItem; offset: number }) {
  const reduced = useReducedMotion();
  const present = useIsPresent();
  return <motion.div className="watch-back-anchor" aria-hidden={!present} inert={!present}
    initial={reduced ? false : { x: offset, scale: 0.65, opacity: 0 }}
    animate={{ x: 0, scale: 1, opacity: 1 }}
    exit={{ x: reduced ? 0 : offset, scale: reduced ? 1 : 0.65, opacity: 0, transition: { ...watchTransition, duration: reduced ? 0 : 0.32, delay: 0 } }}
    transition={reduced ? { duration: 0 } : { ...watchTransition, duration: 0.48, delay: 0.16 }}>
    <button className="learning-bubble" aria-label={item.label} onPointerDown={event => event.preventDefault()} onClick={item.onClick}>
      <span className="watch-bubble-visual"><span className="watch-bubble-surface bubble-tone-0" style={{ borderRadius: "50%" }} /><span className="watch-bubble-content">{item.content}</span></span>
    </button>
  </motion.div>;
}

function EdgeHints({ points, items, size, bounds, panX, panY, onNavigate }: {
  points: { x: number; y: number }[];
  items: WatchItem[];
  size: number;
  bounds: { width: number; height: number };
  panX: MotionValue<number>;
  panY: MotionValue<number>;
  onNavigate: (index: number) => void;
}) {
  const [pan, setPan] = useState(() => ({ x: panX.get(), y: panY.get() }));
  useMotionValueEvent(panX, "change", value => setPan({ x: value, y: panY.get() }));
  useMotionValueEvent(panY, "change", value => setPan({ x: panX.get(), y: value }));
  const groups = hiddenBubbleDirections(points.map(point => ({ x: point.x + pan.x, y: point.y + pan.y })), bounds.width, bounds.height, size);
  const icons = { left: ArrowLeft, right: ArrowRight, above: ArrowUp, below: ArrowDown };
  return <div className="watch-edge-hints" aria-label="Courses beyond the visible area">
    {(Object.keys(groups) as (keyof typeof groups)[]).map(direction => {
      const indices = groups[direction].filter(index => items[index]?.id.startsWith("course-"));
      if (!indices.length) return null;
      const closest = indices.reduce((best, index) => Math.hypot(points[index].x + pan.x, points[index].y + pan.y) < Math.hypot(points[best].x + pan.x, points[best].y + pan.y) ? index : best);
      const Icon = icons[direction];
      return <button key={direction} className={`watch-edge-hint is-${direction}`} aria-label={`Show ${indices.length} ${indices.length === 1 ? "course" : "courses"} ${direction}`} title={indices.map(index => items[index].label).join(", ")} onClick={() => onNavigate(closest)}><Icon size={16} aria-hidden="true" /><span>{indices.length}</span></button>;
    })}
  </div>;
}

export default function WatchField({ items, sceneId, search, status, focusId }: {
  items: WatchItem[];
  sceneId: string;
  search?: ReactNode;
  status?: ReactNode;
  focusId?: string;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState({ width: 640, height: 460 });
  const [availableHeight, setAvailableHeight] = useState(420);
  const [panned, setPanned] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [selectionPan, setSelectionPan] = useState<{ x: number; y: number; sceneId: string }>();
  const moved = useRef(false);
  const reduced = useReducedMotion();
  const controls = useDragControls();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  useMotionValueEvent(x, "change", () => setPanned(Math.abs(x.get()) + Math.abs(y.get()) > 1));
  useMotionValueEvent(y, "change", () => setPanned(Math.abs(x.get()) + Math.abs(y.get()) > 1));

  useLayoutEffect(() => {
    if (!viewport.current || typeof ResizeObserver === "undefined") return;
    let previousWidth = 0;
    const observer = new ResizeObserver(([entry]) => {
      setBounds({ width: entry.contentRect.width, height: entry.contentRect.height });
      if (previousWidth !== entry.contentRect.width) {
        x.jump(0);
        y.jump(0);
        previousWidth = entry.contentRect.width;
      }
    });
    observer.observe(viewport.current);
    return () => observer.disconnect();
  }, [x, y]);
  useLayoutEffect(() => { x.jump(0); y.jump(0); moved.current = false; }, [sceneId, x, y]);

  const size = Math.min(160, Math.max(112, Math.min((bounds.width - 64) / 2.5, (availableHeight - 60) / (1.2 + Math.sqrt(3)))));
  const roots = items.filter((item) => !item.parentId);
  const rootCount = roots.length;
  const selectedIndex = roots.findIndex(item => item.selected);
  const isSearch = Boolean(search);
  const baseHeight = availableHeight;
  const basePositions = useMemo(() => isSearch ? [{ x: 0, y: 0 }] : scatteredPositions(rootCount, size + 18), [isSearch, rootCount, size]);
  const activePan = selectionPan?.sceneId === sceneId ? selectionPan : undefined;
  const panX = selectedIndex >= 0 ? activePan?.x ?? x.get() : 0;
  const panY = selectedIndex >= 0 ? activePan?.y ?? y.get() : 0;
  const expansion = useMemo(() => {
    const result = courseExpansion(basePositions.map(point => ({ x: point.x + panX, y: point.y + panY })), selectedIndex, size, bounds.width, baseHeight);
    return { ...result, points: result.points.map(point => ({ x: point.x - panX, y: point.y - panY })), resources: result.resources.map(point => ({ x: point.x - panX, y: point.y - panY })), origin: { x: result.origin.x - panX, y: result.origin.y - panY } };
  }, [basePositions, selectedIndex, size, bounds.width, baseHeight, panX, panY]);
  const positions = [...expansion.points, ...expansion.resources];
  const limitX = Math.max(bounds.width * 0.55, ...positions.map((point) => Math.abs(point.x)));
  const limitY = Math.max(baseHeight * 0.55, ...positions.map((point) => Math.abs(point.y)));
  useLayoutEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const measure = () => {
      const reserve = window.innerWidth <= 640 ? 110 : 86;
      let top = 0;
      for (let node: HTMLElement | null = element; node; node = node.offsetParent as HTMLElement | null) top += node.offsetTop;
      setAvailableHeight(Math.max(240, Math.floor(window.innerHeight - top - reserve)));
    };
    measure();
    window.addEventListener("resize", measure);
    const observer = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(measure);
    if (element.parentElement) observer?.observe(element.parentElement);
    return () => { window.removeEventListener("resize", measure); observer?.disconnect(); };
  }, [sceneId, rootCount]);
  const reset = () => {
    if (reduced) { x.jump(0); y.jump(0); }
    else {
      animate(x, 0, watchTransition);
      animate(y, 0, watchTransition);
    }
  };

  return (
    <>
      <motion.div ref={viewport} layout="position" initial={false} transition={reduced ? { duration: 0 } : watchTransition} style={{ height: search ? "auto" : baseHeight }} className={`watch-viewport${search ? " is-search" : ""}${dragging ? " is-dragging" : ""}`} role="group" aria-label="Draggable learning launcher" aria-describedby="bubble-help">
        <motion.div className="watch-atmosphere" aria-hidden="true" initial={false} animate={{ height: search ? 160 : "100%", opacity: search ? 1 : 0.7 }} transition={reduced ? { duration: 0 } : watchTransition} />
        <AnimatePresence initial={false} mode="popLayout">
          {search && <SearchScene key="search-panel">{items.filter(item => item.id === "back").map(item => <SearchBack key={item.id} item={item} offset={bounds.width <= 608 ? 76 : bounds.width < 1052 ? 88 : 100} />)}{search}</SearchScene>}
        </AnimatePresence>
        <motion.div
          className="watch-canvas"
          drag={!search}
          dragListener={false}
          dragControls={controls}
          dragConstraints={{ left: -limitX, right: limitX, top: -limitY, bottom: limitY }}
          dragElastic={0.06}
          dragMomentum={!reduced}
          dragTransition={{ power: 0.16, timeConstant: 220, bounceStiffness: 400, bounceDamping: 35 }}
          style={{ x, y, height: search ? undefined : baseHeight, touchAction: search ? "auto" : "none" }}
          onPointerDownCapture={(event) => {
            if (!event.isPrimary || event.button !== 0 || search) return;
            moved.current = false;
            controls.start(event, { distanceThreshold: 8 });
          }}
          onDragStart={() => { moved.current = true; setDragging(true); setSelectionPan(undefined); }}
          onDragEnd={() => setDragging(false)}
          onPointerCancel={() => setDragging(false)}
          onClickCapture={(event) => {
            if (moved.current && event.detail !== 0) { event.preventDefault(); event.stopPropagation(); }
            else if (event.target instanceof Element) {
              const id = event.target.closest("[data-bubble-id]")?.getAttribute("data-bubble-id");
              const index = roots.findIndex(item => item.id === id);
              if (index >= 0 && id?.startsWith("course-")) {
                const centerX = basePositions[index].x + x.get(), centerY = basePositions[index].y + y.get();
                const limitX = Math.max(0, bounds.width / 2 - size * 0.6 - 14), limitY = Math.max(0, baseHeight / 2 - size * 0.6 - 14);
                const targetX = event.detail === 0 ? -basePositions[index].x : x.get() + Math.max(-limitX, Math.min(limitX, centerX)) - centerX;
                const targetY = event.detail === 0 ? -basePositions[index].y : y.get() + Math.max(-limitY, Math.min(limitY, centerY)) - centerY;
                setSelectionPan({ x: targetX, y: targetY, sceneId });
                if (reduced || event.detail === 0) { x.jump(targetX); y.jump(targetY); }
                else { animate(x, targetX, watchTransition); animate(y, targetY, watchTransition); }
              }
            }
          }}
        >
          {items.filter(item => !item.parentId && item.id !== "back").map((item, index) => (
            <WatchBubble key={item.id} item={item} position={expansion.points[index]} faded={selectedIndex >= 0 && !item.selected && item.id !== "search"} size={search ? bounds.width <= 640 ? 64 : 88 : size} bounds={bounds} panX={x} panY={y} focusId={focusId} fixed={Boolean(search)} />
          ))}
          <AnimatePresence>
            {items.filter(item => item.parentId).map((item, index) => expansion.resources[index] && (
              <WatchBubble key={`${item.parentId}-${item.id}`} item={item} position={expansion.resources[index]} origin={expansion.origin} size={expansion.small} bounds={bounds} panX={x} panY={y} focusId={focusId} />
            ))}
          </AnimatePresence>
        </motion.div>
        {!search && <EdgeHints points={expansion.points} items={roots} size={size} bounds={bounds} panX={x} panY={y} onNavigate={index => {
          const point = expansion.points[index];
          if (reduced) { x.jump(-point.x); y.jump(-point.y); }
          else { animate(x, -point.x, watchTransition); animate(y, -point.y, watchTransition); }
          const bubble = Array.from(viewport.current?.querySelectorAll<HTMLElement>("[data-bubble-id]") ?? []).find(element => element.dataset.bubbleId === roots[index].id);
          bubble?.querySelector<HTMLElement>(".learning-bubble")?.focus({ preventScroll: true });
        }} />}
        {status && <div className="watch-status" role="status">{status}</div>}
      </motion.div>
      <div className="bubble-instructions">
        <p id="bubble-help"><Move size={16} aria-hidden="true" /> {search ? "Search any semester, or tap Back." : "Drag in any direction to browse courses."}</p>
        {!search && <button className="bubble-reset" onClick={reset} disabled={!panned}><RotateCcw size={15} aria-hidden="true" /> Recenter</button>}
      </div>
    </>
  );
}
