import { useEffect, useRef } from "react";
import { Capacitor } from "@capacitor/core";

const EDGE_THRESHOLD = 20;   // px from left edge to start a swipe
const MIN_SWIPE_X = 80;      // minimum horizontal travel to trigger back

// Routes that are main tabs — swipe-back is disabled on these
const MAIN_TAB_ROUTES = ['/', '/mosques', '/halal-food', '/calendar'];

function isMainTab() {
  return MAIN_TAB_ROUTES.includes(window.location.pathname);
}

export function useSwipeBack() {
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    function onTouchStart(e: TouchEvent) {
      const touch = e.touches[0];
      if (touch.clientX <= EDGE_THRESHOLD && !isMainTab()) {
        startX.current = touch.clientX;
        startY.current = touch.clientY;
      } else {
        startX.current = null;
        startY.current = null;
      }
    }

    function onTouchMove(e: TouchEvent) {
      if (startX.current === null || startY.current === null) return;
      const touch = e.touches[0];
      const dx = touch.clientX - startX.current;
      const dy = touch.clientY - startY.current;
      if (dx < 0 || Math.abs(dy) > Math.abs(dx)) {
        startX.current = null;
        startY.current = null;
      }
    }

    function onTouchEnd(e: TouchEvent) {
      if (startX.current === null || startY.current === null) return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - startX.current;
      const dy = touch.clientY - startY.current;
      const triggered = dx >= MIN_SWIPE_X && Math.abs(dx) > Math.abs(dy);
      startX.current = null;
      startY.current = null;
      if (triggered && !isMainTab()) {
        window.history.back();
      }
    }

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, []);
}
