// JellyfishScene.tsx
import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

// Remove the ThreeElements declaration since the types are already defined

type GLTFResult = {
  nodes: { [key: string]: THREE.Mesh };
  materials: { [key: string]: THREE.Material };
  animations: THREE.AnimationClip[];
  scene: THREE.Group;
};

function JellyfishModel() {
  const Group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/jellyfish.glb') as unknown as GLTFResult;
  const { actions } = useAnimations(animations, Group);

  useEffect(() => {
    Object.values(actions).forEach(action => {
      if (action) {
        action.reset().play();
        action.setLoop(THREE.LoopRepeat, Infinity);
      }
    });
  }, [actions]);

  useFrame((state) => {
    if (Group.current) {
      Group.current.rotation.y += 0.001;
      Group.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <Group ref={Group}>
      <Primitive object={scene} />
    </Group>
  );
}

function Environment() {
  const { scene } = useThree();

  useEffect(() => {
    scene.fog = new THREE.Fog(0x000000, 5, 15);
  }, [scene]);

  return (
    <>
      <AmbientLight intensity={0.4} />
      <PointLight position={[10, 10, 10]} intensity={0.6} color="#4F9BFF" />
      <PointLight position={[-10, -10, -10]} intensity={0.4} color="#4F9BFF" />
    </>
  );
}

const JellyfishScene: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ 
          position: [0, 0, 5],
          fov: 45,
          near: 0.1,
          far: 1000
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <JellyfishModel />
          <Environment />
          <OrbitControls 
            enablePan={false}
            enableZoom={false}
            autoRotate
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 1.8}
            minPolarAngle={Math.PI / 2.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default JellyfishScene;

// Preload the model
useGLTF.preload('/jellyfish.glb');