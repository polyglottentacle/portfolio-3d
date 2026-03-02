import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Rotating grid lines on the ground for the "space station floor" effect
function GridRings() {
  const ringRef = useRef();
  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={ringRef} position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {[3, 5, 7, 9, 11].map((r) => (
        <mesh key={r}>
          <ringGeometry args={[r - 0.02, r, 64]} />
          <meshBasicMaterial color="#00E5FF" transparent opacity={0.08} />
        </mesh>
      ))}
    </group>
  );
}

export function Ground() {
  return (
    <group>
      {/* Main hexagonal platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <cylinderGeometry args={[12, 12, 0.2, 6]} />
        <meshStandardMaterial
          color="#0d0d1a"
          emissive="#0d0d1a"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Neon grid */}
      <gridHelper args={[24, 24, '#1a1a4a', '#1a1a4a']} position={[0, 0.01, 0]} />

      {/* Slow-rotating ring pulse */}
      <GridRings />

      {/* Central docking circle - where drone starts */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[1.8, 2.0, 64]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.5} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <circleGeometry args={[1.8, 64]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.04} />
      </mesh>

      {/* Path lines toward each station (5 directions) */}
      {[0, 72, 144, 216, 288].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const x = Math.sin(rad) * 5;
        const z = Math.cos(rad) * 5;
        return (
          <mesh
            key={i}
            position={[x, 0.02, z]}
            rotation={[-Math.PI / 2, 0, -rad]}
          >
            <planeGeometry args={[0.08, 6]} />
            <meshBasicMaterial color="#FFC900" transparent opacity={0.2} />
          </mesh>
        );
      })}

      {/* Platform edge glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[11.8, 12.0, 6]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}
