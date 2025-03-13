import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { Group } from 'three';

function JellyfishModel() {
  // Properly type the ref to fix the TypeScript error
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF('/sixthouse/jellyfish.glb');
  const { actions } = useAnimations(animations, group);
  
  // Play animations
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      // Play the first animation found
      actions[Object.keys(actions)[0]]?.play();
      console.log('Playing animation:', Object.keys(actions)[0]);
    } else if (animations && animations.length > 0) {
      console.log('Model has animations but no actions were created');
    } else {
      console.log('No animations found in the model');
    }
  }, [actions, animations]);
  
  // Apply white material to all meshes
  useEffect(() => {
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
  }, [scene]);

  return (
    <group ref={group}>
      <primitive 
        object={scene} 
        position={[0, 0, 0]}
        scale={[0.5, 0.5, 0.5]} // Reduced scale to make the jellyfish smaller
      />
    </group>
  );
}

function Environment() {
  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} />
      <pointLight position={[0, 3, 0]} intensity={1} />
    </>
  );
}

const JellyfishScene: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-white">Loading jellyfish model...</p>
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