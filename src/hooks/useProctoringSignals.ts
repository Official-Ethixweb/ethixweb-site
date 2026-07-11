import { useEffect, useRef } from "react";

/**
 * Soft, non-blocking anti-cheat signal for the screening test: counts tab
 * switches and window blurs so the reviewer sees them next to the score, not
 * as an automatic disqualifier (per the screening design - candidates using
 * AI elsewhere isn't fully preventable, and isn't the point; the live
 * interview afterward is the real check). Uses visibilitychange (fires on
 * mobile app-switch too) and blur (covers alt-tab / clicking another window),
 * both passive and unintrusive - nothing here can be noticed by the candidate.
 */
export function useProctoringSignals() {
  const tabSwitchCount = useRef(0);
  const blurCount = useRef(0);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") tabSwitchCount.current += 1;
    };
    const onBlur = () => {
      blurCount.current += 1;
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onBlur);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  return {
    getCounts: () => ({
      tabSwitchCount: tabSwitchCount.current,
      blurCount: blurCount.current,
    }),
  };
}
