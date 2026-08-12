import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface VoteButton3DProps {
  isVoted: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export function VoteButton3D({ isVoted, onClick, disabled }: VoteButton3DProps) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHover] = useState(false);

  useFrame((_state, delta) => {
    if (group.current) {
      const targetScale = hovered && !disabled ? 1.1 : 1.0;
      group.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 10);
    }
  });

  const handleClick = (event: { stopPropagation: () => void }) => {
    event.stopPropagation();
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <group
      ref={group}
      onClick={handleClick}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <mesh>
        <cylinderGeometry args={[1, 1, 0.2, 32]} />
        <meshStandardMaterial color={isVoted ? '#2ecc71' : hovered ? '#4a5568' : '#2d3748'} />
      </mesh>
    </group>
  );
}
