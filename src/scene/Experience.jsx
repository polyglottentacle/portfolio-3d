// Main 3D scene orchestrator.
// FIX: useKeyboard called ONCE here, ref passed down — no duplicate listeners.

import { useCallback, useRef, useState } from 'react';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Drone } from './Drone';
import { Ground } from './Ground';
import { Nebula } from './Nebula';
import { Effects } from './Effects';
import { ProjectStation } from './ProjectStation';
import { useKeyboard } from '../hooks/useKeyboard';
import { stationPositions, projectColors } from '../data/content';

const PROXIMITY_THRESHOLD = 3.2;

// Pre-allocated for distance computation
const _a = new THREE.Vector2();
const _b = new THREE.Vector2();

export function Experience({ projects, onProjectSelect, onNearProject, mobileRef }) {
  const keysRef = useKeyboard();
  const [nearProjectId, setNearProjectId] = useState(null);
  const prevNearRef = useRef(null);

  // Called by Drone on every frame with its x/z position
  const handleDronePosition = useCallback((x, z) => {
    _a.set(x, z);
    let closest = null;
    let closestDist = Infinity;

    for (const st of stationPositions) {
      _b.set(st.pos[0], st.pos[2]);
      const d = _a.distanceTo(_b);
      if (d < closestDist) {
        closestDist = d;
        closest = st.id;
      }
    }

    const nearId = closestDist < PROXIMITY_THRESHOLD ? closest : null;
    setNearProjectId(nearId);

    // Notify parent only when proximity changes (avoid calling every frame)
    if (nearId !== prevNearRef.current) {
      prevNearRef.current = nearId;
      onNearProject(nearId);
    }
  }, [onNearProject]);

  // Map project id → project data object
  const projectMap = {};
  for (const p of projects) projectMap[p.id] = p;

  return (
    <>
      {/* Ambient & directional light */}
      <ambientLight intensity={0.15} />
      <directionalLight position={[10, 15, 5]} intensity={0.6} castShadow />

      {/* Colored fill lights for atmosphere */}
      <pointLight position={[0, 8, 0]} color="#001133" intensity={2} distance={30} />
      <pointLight position={[-12, 4, -12]} color="#00E5FF" intensity={0.4} distance={20} />
      <pointLight position={[12, 4, 12]}  color="#B05BFF" intensity={0.3} distance={20} />

      {/* Deep space background */}
      <Stars radius={80} depth={60} count={3000} factor={3} saturation={0} fade speed={0.3} />

      {/* Nebula atmosphere */}
      <Nebula />

      {/* Platform */}
      <Ground />

      {/* Drone - keysRef passed in, NOT re-created here */}
      <Drone
        keysRef={keysRef}
        mobileRef={mobileRef}
        onPositionChange={handleDronePosition}
      />

      {/* Post-processing effects (Bloom, Vignette, ChromaticAberration) */}
      <Effects />

      {/* 5 Project stations */}
      {stationPositions.map((st) => {
        const proj = projectMap[st.id];
        if (!proj) return null;
        return (
          <ProjectStation
            key={st.id}
            position={[st.pos[0], 1.0, st.pos[2]]}
            color={projectColors[st.id]}
            geometryType={st.geometryType}
            project={proj}
            isNear={nearProjectId === st.id}
            onClick={onProjectSelect}
          />
        );
      })}
    </>
  );
}
