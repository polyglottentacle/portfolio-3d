// Mission Control heads-up display overlay
import { useState, useEffect } from 'react';

function BlinkingDot() {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setOn((v) => !v), 600);
    return () => clearInterval(id);
  }, []);
  return <span className={`inline-block w-2 h-2 rounded-full bg-[#00E5FF] mr-2 ${on ? 'opacity-100' : 'opacity-20'}`} />;
}

export function HUD({ t, lang, onLangChange, stats }) {
  return (
    <>
      {/* Top-left: station title */}
      <div className="fixed top-5 left-5 z-20 select-none pointer-events-none">
        <div className="text-[#00E5FF] text-xs font-mono tracking-[0.25em] uppercase mb-1">
          <BlinkingDot />
          SYSTEM ONLINE
        </div>
        <h1 className="text-3xl font-black tracking-[-1px] uppercase text-white leading-none">
          {t.stationTitle}
        </h1>
        <div className="text-xs text-gray-400 font-mono mt-1 tracking-widest">
          {t.stationSub}
        </div>
      </div>

      {/* Top-right: language switcher */}
      <div className="fixed top-5 right-5 z-20 flex gap-1 bg-black/80 border border-[#00E5FF]/40 backdrop-blur-sm p-2">
        {['en', 'nl', 'it'].map((l) => (
          <button
            key={l}
            onClick={() => onLangChange(l)}
            className={`px-3 py-1 text-xs uppercase font-black tracking-widest transition-all
              ${lang === l
                ? 'bg-[#00E5FF] text-black'
                : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Bottom-left: controls hint */}
      <div className="fixed bottom-5 left-5 z-20 select-none pointer-events-none">
        <div className="text-gray-500 text-[11px] font-mono">{t.controls}</div>
      </div>

      {/* Bottom-right: stats */}
      <div className="fixed bottom-5 right-5 z-20 flex gap-3 select-none pointer-events-none">
        {stats.map((s) => (
          <div key={s.label} className="text-center bg-black/60 border border-white/10 px-3 py-2 backdrop-blur-sm">
            <div className="text-lg font-black text-white leading-none">{s.value}</div>
            <div className="text-[9px] text-gray-500 font-mono uppercase tracking-widest">{s.label}</div>
          </div>
        ))}
      </div>
    </>
  );
}
