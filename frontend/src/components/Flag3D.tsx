import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Flag3D() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group.current) {
      group.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group ref={group}>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.1, 2, 0.1]} />
        <meshStandardMaterial color="silver" />
      </mesh>
      <mesh position={[0.6, 1.3, 0]}>
        <planeGeometry args={[1.2, 0.8]} />
        <meshStandardMaterial color="#e74c3c" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
