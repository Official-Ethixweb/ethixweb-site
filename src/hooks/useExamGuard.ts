import { useCallback, useEffect, useRef, useState } from "react";
import { MAJOR_VIOLATIONS, type Violation, type ViolationType } from "@/lib/assessment-types";

// Exam-mode proctoring. Everything here is a deterrent + evidence trail, not
// a hard guarantee (nothing in a browser is): major signals (fullscreen exit,
// tab switch, focus loss, devtools) feed the warning ladder that ends in
// auto-submit; minor signals (copy/paste/right-click/shortcuts) are blocked,
// logged, and shown to HR without interrupting the exam.

/** One real-world action (e.g. alt-tab) fires blur + visibilitychange +
 * fullscreenchange together - collapse majors inside this window into one. */
const MAJOR_DEDUPE_MS = 1500;
const DEVTOOLS_POLL_MS = 2000;
const DEVTOOLS_DELTA_PX = 200;

export interface ExamGuardState {
  violations: Violation[];
  majorCount: number;
  /** Bumps on every new major violation - drives the warning overlay. */
  lastMajor: { type: ViolationType; count: number } | null;
}

export function useExamGuard(active: boolean) {
  const [state, setState] = useState<ExamGuardState>({
    violations: [],
    majorCount: 0,
    lastMajor: null,
  });
  const lastMajorAtRef = useRef(0);
  const devtoolsOpenRef = useRef(false);

  const record = useCallback((type: ViolationType, detail?: string) => {
    const isMajor = MAJOR_VIOLATIONS.has(type);
    const now = Date.now();
    if (isMajor) {
      if (now - lastMajorAtRef.current < MAJOR_DEDUPE_MS) return;
      lastMajorAtRef.current = now;
    }
    setState((prev) => {
      const violation: Violation = { type, at: new Date(now).toISOString(), detail };
      const majorCount = prev.majorCount + (isMajor ? 1 : 0);
      return {
        violations: [...prev.violations, violation].slice(-300),
        majorCount,
        lastMajor: isMajor ? { type, count: majorCount } : prev.lastMajor,
      };
    });
  }, []);

  /** Seeds violations restored from the server after a refresh. */
  const hydrate = useCallback((violations: Violation[]) => {
    const majorCount = violations.filter((v) => MAJOR_VIOLATIONS.has(v.type)).length;
    setState({ violations, majorCount, lastMajor: null });
  }, []);

  useEffect(() => {
    if (!active) return;

    const onFullscreenChange = () => {
      if (!document.fullscreenElement) record("fullscreen_exit");
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") record("tab_hidden");
    };
    const onBlur = () => record("window_blur");

    const onContextMenu = (e: Event) => {
      e.preventDefault();
      record("context_menu");
    };
    const onCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      record("copy_attempt");
    };
    const onCut = (e: ClipboardEvent) => {
      e.preventDefault();
      record("cut_attempt");
    };
    const onPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      record("paste_attempt");
    };
    const onDragStart = (e: Event) => e.preventDefault();
    // Selection is also disabled via CSS (select-none); this catches
    // programmatic/edge paths. Inputs stay selectable so typing works.
    const onSelectStart = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "TEXTAREA" || target.tagName === "INPUT")) return;
      e.preventDefault();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const mod = e.ctrlKey || e.metaKey;
      const blocked =
        e.key === "F12" ||
        (mod && e.shiftKey && ["i", "j", "c", "k"].includes(key)) ||
        (mod && ["u", "s", "p"].includes(key));
      if (blocked) {
        e.preventDefault();
        record(
          "shortcut_blocked",
          `${e.ctrlKey ? "Ctrl+" : e.metaKey ? "Meta+" : ""}${e.shiftKey ? "Shift+" : ""}${e.key}`,
        );
      }
      // Copy/cut/paste chords fall through to the clipboard events above,
      // which both block and log them. Plain typing, arrows, and Tab are
      // untouched - accessibility beats paranoia.
    };

    // Heuristic only: a large gap between outer and inner window size while
    // fullscreen usually means a docked devtools pane. Logged as "suspected".
    const devtoolsTimer = window.setInterval(() => {
      const gapW = window.outerWidth - window.innerWidth;
      const gapH = window.outerHeight - window.innerHeight;
      const open = gapW > DEVTOOLS_DELTA_PX || gapH > DEVTOOLS_DELTA_PX + 50;
      if (open && !devtoolsOpenRef.current) {
        devtoolsOpenRef.current = true;
        record("devtools_suspected", `window gap ${gapW}x${gapH}px`);
      } else if (!open) {
        devtoolsOpenRef.current = false;
      }
    }, DEVTOOLS_POLL_MS);

    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onBlur);
    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("copy", onCopy);
    document.addEventListener("cut", onCut);
    document.addEventListener("paste", onPaste);
    document.addEventListener("dragstart", onDragStart);
    document.addEventListener("selectstart", onSelectStart);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearInterval(devtoolsTimer);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("copy", onCopy);
      document.removeEventListener("cut", onCut);
      document.removeEventListener("paste", onPaste);
      document.removeEventListener("dragstart", onDragStart);
      document.removeEventListener("selectstart", onSelectStart);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [active, record]);

  return { ...state, hydrate };
}
