// FIX vs Gemini: called ONCE at top level (Scene), not duplicated in each child.
// A ref-based approach avoids stale closure issues inside useFrame.
import { useEffect, useRef } from 'react';

export function useKeyboard() {
  const keysRef = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  useEffect(() => {
    const down = (e) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp':    keysRef.current.forward  = true; break;
        case 'KeyS': case 'ArrowDown':  keysRef.current.backward = true; break;
        case 'KeyA': case 'ArrowLeft':  keysRef.current.left     = true; break;
        case 'KeyD': case 'ArrowRight': keysRef.current.right    = true; break;
      }
    };
    const up = (e) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp':    keysRef.current.forward  = false; break;
        case 'KeyS': case 'ArrowDown':  keysRef.current.backward = false; break;
        case 'KeyA': case 'ArrowLeft':  keysRef.current.left     = false; break;
        case 'KeyD': case 'ArrowRight': keysRef.current.right    = false; break;
      }
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  return keysRef;
}
