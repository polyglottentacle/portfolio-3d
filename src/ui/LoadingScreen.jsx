// Mission Control loading screen — shown while Three.js assets initialize
import { useEffect, useState } from 'react';

const LINES = [
  '> INITIALIZING MISSION CONTROL...',
  '> LOADING 3D SPATIAL ENGINE...',
  '> CONNECTING TO AUTOMATION GRID...',
  '> DEPLOYING HOLOGRAPHIC STATIONS...',
  '> ALL SYSTEMS OPERATIONAL',
];

export function LoadingScreen({ onReady }) {
  const [lineIndex, setLineIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current++;
      setLineIndex(current);
      setProgress(Math.round((current / LINES.length) * 100));
      if (current >= LINES.length - 1) {
        clearInterval(interval);
        setTimeout(() => setDone(true), 400);
        setTimeout(() => setFading(true), 900);
        setTimeout(() => onReady(), 1400);
      }
    }, 280);
    return () => clearInterval(interval);
  }, [onReady]);

  if (fading && done) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center
                  transition-opacity duration-500 ${fading ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* Scanlines */}
      <div className="scanlines" />

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#00E5FF]" />
      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#00E5FF]" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#00E5FF]" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#00E5FF]" />

      {/* Main content */}
      <div className="text-center px-6 max-w-lg w-full">
        {/* Logo */}
        <div className="text-[#00E5FF] text-xs font-mono tracking-[0.4em] uppercase mb-2">
          EMANUELE_G
        </div>
        <h1 className="text-5xl font-black uppercase tracking-tight text-white mb-1">
          MISSION
        </h1>
        <h1 className="text-5xl font-black uppercase tracking-tight text-white mb-8">
          CONTROL
        </h1>

        {/* Terminal log */}
        <div className="bg-black border border-[#00E5FF]/30 p-4 mb-6 text-left font-mono text-xs min-h-[8rem]">
          {LINES.slice(0, lineIndex + 1).map((line, i) => (
            <div
              key={i}
              className={`mb-1 ${i === lineIndex ? 'text-[#00E5FF]' : 'text-gray-600'}`}
            >
              {line}
              {i === lineIndex && !done && (
                <span className="animate-pulse ml-1">█</span>
              )}
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-900 border border-[#00E5FF]/20 overflow-hidden">
          <div
            className="h-full bg-[#00E5FF] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-[#00E5FF] text-xs font-mono mt-2">
          {progress}% — {done ? 'READY' : 'LOADING'}
        </div>
      </div>

      {/* Bottom tagline */}
      <div className="absolute bottom-8 text-gray-700 text-xs font-mono tracking-widest">
        AUTOMATION RANGER · LELYSTAD · 2026
      </div>
    </div>
  );
}
