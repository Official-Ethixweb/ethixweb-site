import {
  createElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import { useInView } from "framer-motion";

const DEFAULT_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";

interface ShuffleProps {
  text: string;
  tag?: ElementType;
  className?: string;
  style?: CSSProperties;
  /** seconds per scramble flash */
  duration?: number;
  /** how many scrambled glyphs flash before the real character settles */
  shuffleTimes?: number;
  /** seconds of delay between each character starting its shuffle */
  stagger?: number;
  scrambleCharset?: string;
  triggerOnce?: boolean;
  triggerOnHover?: boolean;
  respectReducedMotion?: boolean;
  onShuffleComplete?: () => void;
}

export function Shuffle({
  text,
  tag: Tag = "span",
  className = "",
  style,
  duration = 0.04,
  shuffleTimes = 3,
  stagger = 0.03,
  scrambleCharset = DEFAULT_CHARSET,
  triggerOnce = true,
  triggerOnHover = true,
  respectReducedMotion = true,
  onShuffleComplete,
}: ShuffleProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: triggerOnce, margin: "-80px" });
  const [display, setDisplay] = useState<string[]>(() => text.split(""));
  const playedRef = useRef(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const play = useCallback(() => {
    const reduced =
      respectReducedMotion &&
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setDisplay(text.split(""));
      onShuffleComplete?.();
      return;
    }

    clearTimers();
    const chars = text.split("");
    const settleCount = chars.filter((c) => c !== " ").length;
    let completed = 0;

    chars.forEach((char, i) => {
      if (char === " ") return;
      const startDelay = i * stagger * 1000;

      for (let step = 0; step < shuffleTimes; step++) {
        const t = setTimeout(
          () => {
            setDisplay((prev) => {
              const next = [...prev];
              next[i] = scrambleCharset.charAt(Math.floor(Math.random() * scrambleCharset.length));
              return next;
            });
          },
          startDelay + step * duration * 1000,
        );
        timeoutsRef.current.push(t);
      }

      const settleT = setTimeout(
        () => {
          setDisplay((prev) => {
            const next = [...prev];
            next[i] = char;
            return next;
          });
          completed += 1;
          if (completed === settleCount) onShuffleComplete?.();
        },
        startDelay + shuffleTimes * duration * 1000,
      );
      timeoutsRef.current.push(settleT);
    });
  }, [
    text,
    shuffleTimes,
    stagger,
    duration,
    scrambleCharset,
    respectReducedMotion,
    onShuffleComplete,
    clearTimers,
  ]);

  useEffect(() => {
    if (inView && !playedRef.current) {
      playedRef.current = true;
      play();
    }
  }, [inView, play]);

  useEffect(() => clearTimers, [clearTimers]);

  const handleMouseEnter = () => {
    if (!triggerOnHover || !playedRef.current) return;
    play();
  };

  const wordGroups = useMemo(() => {
    const groups: number[][] = [];
    let current: number[] = [];
    for (let i = 0; i < text.length; i++) {
      if (text[i] === " ") {
        groups.push(current);
        current = [];
      } else {
        current.push(i);
      }
    }
    groups.push(current);
    return groups;
  }, [text]);

  const children: ReactNode[] = [];
  wordGroups.forEach((indices, wi) => {
    if (wi > 0) children.push(" ");
    children.push(
      <span key={"w-" + wi} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
        {indices.map((i) => (
          <span key={i} style={{ display: "inline-block" }}>
            {display[i]}
          </span>
        ))}
      </span>,
    );
  });

  return createElement(Tag, { ref, className, style, onMouseEnter: handleMouseEnter }, children);
}
