// Full-screen modal with brutaliste design (ported from existing portfolio)
import { useEffect } from 'react';
import { projectColors } from '../data/content';

export function ProjectModal({ project, t, onClose }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!project) return null;
  const color = projectColors[project.id];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto border-4 border-black bg-white
                   shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]"
        style={{ boxShadow: `12px 12px 0px 0px ${color}` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Color header strip */}
        <div className="p-8" style={{ backgroundColor: color }}>
          <div className="inline-block bg-white text-black border-2 border-black text-xs font-black uppercase px-3 py-1 mb-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            {project.tag}
          </div>
          <h2 className="text-4xl font-black uppercase text-black leading-tight">
            {project.title}
          </h2>
          <div className="text-sm font-black uppercase tracking-widest text-black/70 mt-1">
            {project.role}
          </div>
        </div>

        {/* Body */}
        <div className="p-8 bg-white text-black">
          <div className="border-4 border-black p-6 mb-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="font-black text-base uppercase mb-2">// System Architecture:</div>
            <p className="font-bold text-base leading-relaxed">{project.details}</p>
          </div>

          {/* YouTube link button */}
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 mb-6 border-4 border-black font-black uppercase
                         text-white text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                         hover:translate-x-1 hover:-translate-y-1 transition-transform"
              style={{ backgroundColor: color }}
            >
              ▶ {t.watchVideo}
            </a>
          )}

          {/* Close */}
          <button
            onClick={onClose}
            className="w-full py-4 border-4 border-black bg-black text-white font-black uppercase
                       tracking-widest text-sm hover:bg-white hover:text-black transition-all
                       shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]"
          >
            {t.close}
          </button>
        </div>

        {/* X button */}
        <button
          onClick={onClose}
          className="absolute -top-5 -right-5 w-10 h-10 bg-white border-4 border-black font-black text-lg
                     flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                     hover:bg-red-500 hover:text-white transition-colors z-10"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
