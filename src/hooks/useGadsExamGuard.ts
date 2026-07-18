import { useCallback, useEffect, useRef, useState } from "react";
import {
  GADS_MAJOR_VIOLATIONS,
  type GadsViolation,
  type GadsViolationType,
} from "@/lib/gads-types";

// Exam-mode proctoring for the Google Ads assessment - a fork of
// useExamGuard.ts (generic platform) extended with the additional signals
// this spec asks for: select-all, best-effort Print Screen / refresh-attempt
// detection, network online/offline, window resize, and best-effort
// multi-monitor detection. Same philosophy as the original: everything here
// is a deterrent + evidence trail, not a hard guarantee (nothing in a
// browser is). Major signals feed the warning ladder that ends in
// forced auto-submit; minor signals are blocked/logged without interrupting
// the exam.

const MAJOR_DEDUPE_MS = 1500;
const RESIZE_DEDUPE_MS = 2000;
const DEVTOOLS_POLL_MS = 2000;
const DEVTOOLS_DELTA_PX = 200;

export interface GadsExamGuardState {
  violations: GadsViolation[];
  majorCount: number;
  lastMajor: { type: GadsViolationType; count: number } | null;
}

export function useGadsExamGuard(active: boolean) {
  const [state, setState] = useState<GadsExamGuardState>({
    violations: [],
    majorCount: 0,
    lastMajor: null,
  });
  const lastMajorAtRef = useRef(0);
  const lastResizeAtRef = useRef(0);
  const devtoolsOpenRef = useRef(false);
  const lastWindowSizeRef = useRef({ w: 0, h: 0 });

  const record = useCallback((type: GadsViolationType, detail?: string) => {
    const isMajor = GADS_MAJOR_VIOLATIONS.has(type);
    const now = Date.now();
    if (isMajor) {
      if (now - lastMajorAtRef.current < MAJOR_DEDUPE_MS) return;
      lastMajorAtRef.current = now;
    }
    setState((prev) => {
      const violation: GadsViolation = { type, at: new Date(now).toISOString(), detail };
      const majorCount = prev.majorCount + (isMajor ? 1 : 0);
      return {
        violations: [...prev.violations, violation].slice(-500),
        majorCount,
        lastMajor: isMajor ? { type, count: majorCount } : prev.lastMajor,
      };
    });
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
    const onSelectStart = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "TEXTAREA" || target.tagName === "INPUT")) return;
      e.preventDefault();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const mod = e.ctrlKey || e.metaKey;

      if (key === "printscreen") {
        record("print_screen_suspected");
        return;
      }
      if (key === "f5" || (mod && key === "r")) {
        e.preventDefault();
        record("refresh_attempt");
        return;
      }
      if (mod && key === "a") {
        e.preventDefault();
        record("select_all_attempt");
        return;
      }

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
    };

    const onNetworkOnline = () => record("network_online");
    const onNetworkOffline = () => record("network_offline");

    const onResize = () => {
      const now = Date.now();
      const { innerWidth: w, innerHeight: h } = window;
      const prev = lastWindowSizeRef.current;
      lastWindowSizeRef.current = { w, h };
      if (prev.w === 0 || (prev.w === w && prev.h === h)) return;
      if (now - lastResizeAtRef.current < RESIZE_DEDUPE_MS) return;
      lastResizeAtRef.current = now;
      record("window_resize", `${w}x${h}`);
    };

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

    // Best-effort, one-shot: multi-monitor detection needs the Window
    // Management API (Chromium-only as of writing). Never blocks on
    // absence - just records whether the check itself was possible.
    if ("isExtended" in window.screen) {
      if ((window.screen as Screen & { isExtended?: boolean }).isExtended) {
        record("multi_monitor_detected");
      }
    } else {
      record("multi_monitor_unsupported");
    }

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
    window.addEventListener("online", onNetworkOnline);
    window.addEventListener("offline", onNetworkOffline);
    window.addEventListener("resize", onResize);

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
      window.removeEventListener("online", onNetworkOnline);
      window.removeEventListener("offline", onNetworkOffline);
      window.removeEventListener("resize", onResize);
    };
  }, [active, record]);

  return state;
}
