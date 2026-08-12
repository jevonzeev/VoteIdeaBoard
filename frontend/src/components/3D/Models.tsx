import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';

// Pre-load GLTF assets
useGLTF.preload('/models/idea_flag.glb');
useGLTF.preload('/models/winners_cup.glb');
useGLTF.preload('/models/loser_Skull.glb');
useGLTF.preload('/models/vote_coin.glb');
useGLTF.preload('/assets/vote_button.glb');

// Reusable Rotating Wrapper with auto-centering
function RotatingModel({ 
  url, 
  scale = 1, 
  position = [0, 0, 0], 
  rotationSpeed = 0.015 
}: { 
  url: string; 
  scale?: number; 
  position?: [number, number, number]; 
  rotationSpeed?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(url);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <Center>
        <primitive object={scene.clone()} scale={scale} />
      </Center>
    </group>
  );
}

// Custom wrapper supporting specific glow sizes and color profiles
function ModelContainer({ 
  children, 
  size = 80, 
  glowColor = 'rgba(16,185,129,0.6)', 
  glowInset = '-8px' 
}: { 
  children: React.ReactNode; 
  size?: number; 
  glowColor?: string; 
  glowInset?: string;
}) {
  return (
    <div 
      style={{ 
        position: 'relative', 
        width: `${size}px`, 
        height: `${size}px`, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        overflow: 'visible'
      }}
    >
      {/* Background Glow Aura */}
      <div 
        style={{
          position: 'absolute',
          inset: glowInset,
          background: `radial-gradient(circle, ${glowColor} 0%, rgba(0,0,0,0) 70%)`,
          borderRadius: '50%',
          filter: 'blur(8px)',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', overflow: 'visible' }}>
        {children}
      </div>
    </div>
  );
}

// 1. Waving Flag / Idea Flag Canvas
export function WavingFlagCanvas() {
  return (
    <ModelContainer size={76} glowColor="rgba(16,185,129,0.6)" glowInset="-8px">
      <Canvas camera={{ position: [0, 0, 3.0], fov: 45 }} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        <ambientLight intensity={3.5} />
        <directionalLight position={[2, 4, 3]} intensity={5.0} />
        <RotatingModel url="/models/idea_flag.glb" scale={1.2} rotationSpeed={0.02} />
      </Canvas>
    </ModelContainer>
  );
}

// 2. Winner Cup Component (#1 Rank) - Optimized studio lighting for rich metallic gold & fine-tuned size
export function WinnerCupCanvas() {
  return (
    <ModelContainer size={84} glowColor="rgba(234,179,8,0.7)" glowInset="-6px">
      <Canvas camera={{ position: [0, 0, 3.2], fov: 45 }} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        <ambientLight intensity={4.5} color="#fffbeb" />
        <directionalLight position={[3, 5, 4]} intensity={6.5} color="#fef3c7" />
        <directionalLight position={[-3, -3, -2]} intensity={2.5} color="#d97706" />
        <RotatingModel url="/models/winners_cup.glb" scale={0.84} rotationSpeed={0.018} />
      </Canvas>
    </ModelContainer>
  );
}

// 3. Anatomical Skull Component (Last Rank) - Optimized brightness with a tighter red glow
export function SkullCanvas() {
  return (
    <ModelContainer size={84} glowColor="rgba(239,68,68,0.7)" glowInset="-2px">
      <Canvas camera={{ position: [0, 0, 3.5], fov: 45 }} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        <ambientLight intensity={4.5} />
        <directionalLight position={[2, 4, 3]} intensity={6.0} />
        <RotatingModel url="/models/loser_Skull.glb" scale={2.3} rotationSpeed={0.015} />
      </Canvas>
    </ModelContainer>
  );
}

// 4. Vote Coin Component
export function VoteCoinCanvas() {
  return (
    <ModelContainer size={76} glowColor="rgba(16,185,129,0.6)" glowInset="-8px">
      <Canvas camera={{ position: [0, 0, 3.0], fov: 45 }} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        <ambientLight intensity={3.5} />
        <directionalLight position={[2, 4, 3]} intensity={5.0} />
        <RotatingModel url="/models/vote_coin.glb" scale={1.3} rotationSpeed={0.025} />
      </Canvas>
    </ModelContainer>
  );
}

// 5. Interactive 3D Button Component
export function ThreeDButton({ onClick }: { onClick: () => void }) {
  return (
    <div 
      className="btn-3d-wrapper" 
      onClick={onClick}
      style={{
        position: 'relative',
        width: '130px',
        height: '40px',
        cursor: 'pointer',
      }}
    >
      <button
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: '#000',
          border: 'none',
          borderRadius: '10px',
          fontWeight: 800,
          fontSize: '0.85rem',
          cursor: 'pointer',
          boxShadow: '0px 4px 0px #047857, 0px 6px 10px rgba(0,0,0,0.3)',
          transition: 'transform 0.1s, box-shadow 0.1s',
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'translateY(3px)';
          e.currentTarget.style.boxShadow = '0px 1px 0px #047857';
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'translateY(0px)';
          e.currentTarget.style.boxShadow = '0px 4px 0px #047857, 0px 6px 10px rgba(0,0,0,0.3)';
        }}
      >
        + New idea
      </button>
    </div>
  );
}