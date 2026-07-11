import { useEffect, useRef, useState } from "react";

/** Counts down from `seconds`, calling `onExpire` once when it hits zero. */
export function useQuestionTimer(seconds: number, onExpire: () => void) {
  const [secondsLeft, setSecondsLeft] = useState(seconds);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    setSecondsLeft(seconds);
    const start = Date.now();
    const id = setInterval(() => {
      const remaining = seconds - Math.floor((Date.now() - start) / 1000);
      if (remaining <= 0) {
        setSecondsLeft(0);
        clearInterval(id);
        onExpireRef.current();
      } else {
        setSecondsLeft(remaining);
      }
    }, 250);
    return () => clearInterval(id);
  }, [seconds]);

  return secondsLeft;
}
