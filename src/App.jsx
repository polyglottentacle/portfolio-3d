import { useState, useMemo, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { content, stats } from './data/content';
import { Experience } from './scene/Experience';
import { HUD } from './ui/HUD';
import { ProjectPanel } from './ui/ProjectPanel';
import { ProjectModal } from './ui/ProjectModal';
import { Instructions } from './ui/Instructions';
import { MobileControls } from './ui/MobileControls';
import { LoadingScreen } from './ui/LoadingScreen';
import { useMobileControls } from './hooks/useMobileControls';

export default function App() {
  const [lang, setLang] = useState('en');
  const [panelProject, setPanelProject] = useState(null);
  const [modalProject, setModalProject] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const mobileRef = useMobileControls();

  const t = content[lang];
  const projects = useMemo(() => t.projects, [t]);

  const handleNearProject = useCallback((nearId) => {
    if (!nearId) { setPanelProject(null); return; }
    const proj = t.projects.find((p) => p.id === nearId);
    if (proj) setPanelProject(proj);
  }, [t.projects]);

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">

      {/* Loading screen — shown until Three.js is ready */}
      {!loaded && <LoadingScreen onReady={() => setLoaded(true)} />}

      {/* 3D Canvas — always mounted, loads in background */}
      <Canvas
        shadows
        camera={{ position: [0, 5, 12], fov: 55, near: 0.1, far: 300 }}
        gl={{ antialias: true, pixelRatio: Math.min(window.devicePixelRatio, 2) }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <Experience
          projects={projects}
          onProjectSelect={setModalProject}
          onNearProject={handleNearProject}
          mobileRef={mobileRef}
        />
      </Canvas>

      {/* Scanlines */}
      <div className="scanlines" aria-hidden="true" />

      {/* Only show UI after loading */}
      {loaded && (
        <>
          <HUD t={t.ui} lang={lang} onLangChange={setLang} stats={stats} />
          <Instructions />
          <ProjectPanel
            project={panelProject}
            lang={lang}
            onOpen={setModalProject}
            onClose={() => setPanelProject(null)}
          />
          {modalProject && (
            <ProjectModal
              project={modalProject}
              t={t.ui}
              onClose={() => setModalProject(null)}
            />
          )}
          <MobileControls mobileRef={mobileRef} />
        </>
      )}
    </div>
  );
}
