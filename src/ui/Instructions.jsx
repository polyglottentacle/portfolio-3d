// Onboarding overlay — fades out after 6 seconds
import { useState, useEffect } from 'react';

export function Instructions() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fade = setTimeout(() => setFading(true), 5000);
    const hide = setTimeout(() => setVisible(false), 6200);
    return () => { clearTimeout(fade); clearTimeout(hide); };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-40 flex flex-col items-center justify-center pointer-events-none
                  transition-opacity duration-1000 ${fading ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className="bg-black/70 border border-[#00E5FF]/60 backdrop-blur-sm px-10 py-8 text-center max-w-sm mx-4">
        <div className="text-[#00E5FF] font-black text-lg uppercase tracking-widest mb-4">
          🚀 MISSION CONTROL
        </div>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            ['W / ↑', 'Forward'],
            ['S / ↓', 'Backward'],
            ['A / ←', 'Left'],
            ['D / →', 'Right'],
          ].map(([key, label]) => (
            <div key={key} className="flex items-center gap-2">
              <kbd className="bg-white text-black text-xs font-black px-2 py-1 border border-black">
                {key}
              </kbd>
              <span className="text-gray-300 text-xs">{label}</span>
            </div>
          ))}
        </div>
        <p className="text-gray-400 text-xs">
          Navigate to glowing stations · Click to explore projects
        </p>
      </div>
    </div>
  );
}
