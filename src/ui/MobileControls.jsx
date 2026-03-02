// Virtual joystick for mobile/touch devices
// Writes directly into mobileRef (same shape as useKeyboard keysRef)
import { useRef, useCallback, useEffect } from 'react';

const DEAD_ZONE = 15;

export function MobileControls({ mobileRef }) {
  const padRef = useRef(null);
  const stickRef = useRef(null);
  const touchId = useRef(null);
  const origin = useRef({ x: 0, y: 0 });

  const reset = useCallback(() => {
    touchId.current = null;
    mobileRef.current.forward = false;
    mobileRef.current.backward = false;
    mobileRef.current.left = false;
    mobileRef.current.right = false;
    if (stickRef.current) {
      stickRef.current.style.transform = 'translate(-50%, -50%)';
    }
  }, [mobileRef]);

  const onTouchStart = useCallback((e) => {
    if (touchId.current !== null) return;
    const t = e.changedTouches[0];
    touchId.current = t.identifier;
    origin.current = { x: t.clientX, y: t.clientY };
  }, []);

  const onTouchMove = useCallback((e) => {
    if (touchId.current === null) return;
    let touch = null;
    for (const t of e.changedTouches) {
      if (t.identifier === touchId.current) { touch = t; break; }
    }
    if (!touch) return;

    const dx = touch.clientX - origin.current.x;
    const dy = touch.clientY - origin.current.y;

    // Clamp stick visual position
    const maxR = 35;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const clamped = dist > maxR ? maxR / dist : 1;
    if (stickRef.current) {
      stickRef.current.style.transform =
        `translate(calc(-50% + ${dx * clamped}px), calc(-50% + ${dy * clamped}px))`;
    }

    mobileRef.current.forward  = dy < -DEAD_ZONE;
    mobileRef.current.backward = dy >  DEAD_ZONE;
    mobileRef.current.left     = dx < -DEAD_ZONE;
    mobileRef.current.right    = dx >  DEAD_ZONE;
  }, [mobileRef]);

  const onTouchEnd = useCallback((e) => {
    for (const t of e.changedTouches) {
      if (t.identifier === touchId.current) { reset(); break; }
    }
  }, [reset]);

  useEffect(() => {
    const el = padRef.current;
    if (!el) return;
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove,  { passive: true });
    el.addEventListener('touchend', onTouchEnd);
    el.addEventListener('touchcancel', reset);
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchcancel', reset);
    };
  }, [onTouchStart, onTouchMove, onTouchEnd, reset]);

  return (
    <div className="fixed bottom-16 left-8 z-20 md:hidden select-none touch-none">
      <div
        ref={padRef}
        className="relative w-28 h-28 rounded-full border-2 border-[#00E5FF]/50 bg-black/40 backdrop-blur-sm"
      >
        <div
          ref={stickRef}
          className="absolute top-1/2 left-1/2 w-12 h-12 rounded-full bg-[#00E5FF]/70 border-2 border-[#00E5FF]"
          style={{ transform: 'translate(-50%, -50%)' }}
        />
      </div>
    </div>
  );
}
