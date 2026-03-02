// Slides in from the right when drone is near a station
import { projectColors } from '../data/content';

export function ProjectPanel({ project, lang, onOpen, onClose }) {
  if (!project) return null;
  const color = projectColors[project.id];

  return (
    <div
      className="fixed right-0 top-1/2 -translate-y-1/2 z-30 w-80 max-w-[90vw]
                 animate-slideIn"
    >
      <div
        className="border-l-4 border-t-4 border-b-4 bg-black/90 backdrop-blur-sm p-6"
        style={{ borderColor: color }}
      >
        {/* Tag chip */}
        <div
          className="inline-block text-xs font-black uppercase tracking-widest px-2 py-1 mb-3 border-2 border-black"
          style={{ backgroundColor: color, color: '#000' }}
        >
          {project.tag}
        </div>

        <h2 className="text-2xl font-black uppercase text-white leading-tight mb-1">
          {project.title}
        </h2>
        <div className="text-xs font-bold tracking-widest mb-3" style={{ color }}>
          {project.role}
        </div>
        <p className="text-sm text-gray-300 leading-relaxed mb-5">
          {project.desc}
        </p>

        <button
          onClick={() => onOpen(project)}
          className="w-full py-3 font-black uppercase tracking-widest text-sm transition-all
                     border-2 border-white text-white hover:bg-white hover:text-black"
        >
          UNLOCK MODULE →
        </button>
      </div>
    </div>
  );
}
