// Exposes a ref that mobile joystick can write to, same shape as useKeyboard
import { useRef } from 'react';

export function useMobileControls() {
  const mobileRef = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });
  return mobileRef;
}
