import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function JellyfishModel() {
  const { scene, animations } = useGLTF('/sixthouse/jellyfish.glb');
  
  // Apply white material to all meshes
  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(mat => {
            if ((mat as any).color) {
              (mat as any).color = new THREE.Color(0xffffff);
            }
          });
        } else {
          if ((mesh.material as any).color) {
            (mesh.material as any).color = new THREE.Color(0xffffff);
          }
        }
      }
    }
  });

  return (
    <primitive 
      object={scene} 
      position={[0, 0, 0]}
      scale={[1, 1, 1]}
    />
  );
}

function Environment() {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} />
    </>
  );
}

const JellyfishScene: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-white">Loading jellyfish...</p>
        </div>
      }>
        <Canvas
          camera={{ 
            position: [0, 0, 5],
            fov: 45
          }}
        >
          <color attach="background" args={['#111122']} />
          <JellyfishModel />
          <Environment />
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
          />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default JellyfishScene;

// Clear cache and preload
useGLTF.preload('/sixthouse/jellyfish.glb');