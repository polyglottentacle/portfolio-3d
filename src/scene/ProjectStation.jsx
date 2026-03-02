// FIX vs Gemini:
// 1. Text imported from @react-three/drei (it was forgotten)
// 2. No new THREE.Vector3() created inside useFrame (pre-allocated)
// 3. Proximity glow ring on ground (visual cue for player)
// 4. geometry NOT passed as JSX prop — it's a string type, geometries built here

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';

// Pre-allocated target for scale lerp
const _scaleTarget = new THREE.Vector3();

function StationGeometry({ type, color }) {
  const mat = (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={0.4}
      metalness={0.5}
      roughness={0.2}
    />
  );

  switch (type) {
    case 'box':          return <><boxGeometry args={[1.1, 1.1, 1.1]} />{mat}</>;
    case 'octahedron':   return <><octahedronGeometry args={[0.75]} />{mat}</>;
    case 'torusKnot':    return <><torusKnotGeometry args={[0.45, 0.16, 80, 8]} />{mat}</>;
    case 'cone':         return <><coneGeometry args={[0.65, 1.1, 16]} />{mat}</>;
    case 'dodecahedron': return <><dodecahedronGeometry args={[0.68]} />{mat}</>;
    default:             return <><sphereGeometry args={[0.7, 16, 16]} />{mat}</>;
  }
}

export function ProjectStation({ position, color, geometryType, project, isNear, onClick }) {
  const meshRef = useRef();
  const ringRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    // FIX: reuse pre-allocated vector, don't create new one every frame
    const target = isNear || hovered ? 1.3 : 1.0;
    _scaleTarget.setScalar(target);
    meshRef.current.scale.lerp(_scaleTarget, 0.08);

    // Emissive intensity based on state
    if (meshRef.current.material) {
      meshRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
        meshRef.current.material.emissiveIntensity,
        isNear ? 1.2 : hovered ? 0.8 : 0.35,
        0.08,
      );
    }

    // Proximity ring pulse
    if (ringRef.current) {
      const pulse = 0.5 + Math.sin(clock.elapsedTime * 3) * 0.5;
      ringRef.current.material.opacity = isNear ? pulse * 0.4 : 0;
    }
  });

  return (
    <group position={position}>
      {/* Float wraps the main mesh for gentle levitation */}
      <Float
        speed={1.5}
        rotationIntensity={0.4}
        floatIntensity={0.5}
        floatingRange={[-0.1, 0.1]}
      >
        <mesh
          ref={meshRef}
          onClick={(e) => { e.stopPropagation(); onClick(project); }}
          onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }}
          castShadow
        >
          <StationGeometry type={geometryType} color={color} />
        </mesh>

        {/* Station label above */}
        <Text
          position={[0, 1.4, 0]}
          fontSize={0.28}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
          font={undefined}
        >
          {project.title}
        </Text>
        <Text
          position={[0, 1.0, 0]}
          fontSize={0.16}
          color={color}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.015}
          outlineColor="#000000"
        >
          {project.tag}
        </Text>
      </Float>

      {/* Ground proximity ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[2.2, 2.5, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>

      {/* Always-on subtle floor light */}
      <pointLight
        position={[0, 0.2, 0]}
        color={color}
        intensity={isNear ? 1.5 : 0.6}
        distance={4}
      />
    </group>
  );
}
