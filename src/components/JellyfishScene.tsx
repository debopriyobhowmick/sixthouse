// JellyfishScene.tsx
import React, { Suspense, useEffect, useRef, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import type { Props as CanvasProps } from '@react-three/fiber';

type GLTFResult = {
  nodes: { [key: string]: THREE.Mesh };
  materials: { [key: string]: THREE.Material };
  animations: THREE.AnimationClip[];
  scene: THREE.Group;
};

function JellyfishModel() {
  const group = useRef<THREE.Group>(null);
  const [modelError, setModelError] = useState<string | null>(null);
  
  // Move hooks outside of try-catch
  const { scene, animations } = useGLTF('/sixthouse/jellyfish.glb') as unknown as GLTFResult;
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    try {
      console.log('Model loaded successfully');
      console.log('Animations available:', animations.length);
      
      Object.values(actions).forEach(action => {
        if (action) {
          action.reset().play();
          action.setLoop(THREE.LoopRepeat, Infinity);
        }
      });
    } catch (err) {
      console.error('Error setting up animations:', err);
      setModelError(err instanceof Error ? err.message : 'Unknown error in animations');
    }
  }, [actions, animations]);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y += 0.001;
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  if (modelError) {
    return null;
  }

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}

function Environment() {
  const { scene } = useThree();

  useEffect(() => {
    scene.fog = new THREE.Fog(0x000000, 5, 15);
  }, [scene]);

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.6} color="#4F9BFF" />
      <pointLight position={[-10, -10, -10]} intensity={0.4} color="#4F9BFF" />
    </>
  );
}

function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-white/60 bg-black/20 px-6 py-3 rounded-lg backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <div className="animate-spin h-4 w-4 border-2 border-white/60 rounded-full border-t-transparent"></div>
          <p>Loading 3D Scene...</p>
        </div>
      </div>
    </div>
  );
}

function ErrorDisplay({ message }: { message: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-white/60 bg-black/20 px-6 py-3 rounded-lg backdrop-blur-sm">
        <p className="text-lg">Failed to load 3D scene</p>
        <p className="text-sm opacity-75 mt-1">{message}</p>
      </div>
    </div>
  );
}

const JellyfishScene: React.FC = () => {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Please refresh the page to try again');

  const onCanvasError: CanvasProps['onError'] = useCallback((error : any) => {
    console.error('Canvas error:', error);
    setHasError(true);
    setErrorMessage(error.message || 'Canvas error occurred');
  }, []);

  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
      setHasError(true);
      setErrorMessage(event.error?.message || 'An unexpected error occurred');
    };

    window.addEventListener('error', handleGlobalError);
    return () => window.removeEventListener('error', handleGlobalError);
  }, []);

  if (hasError) {
    return <ErrorDisplay message={errorMessage} />;
  }

  return (
    <div className="absolute inset-0 z-0">
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          camera={{ 
            position: [0, 0, 5],
            fov: 45,
            near: 0.1,
            far: 1000
          }}
          style={{ background: 'transparent' }}
          onError={onCanvasError}
        >
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
        </Canvas>
      </Suspense>
    </div>
  );
};

export default JellyfishScene;

// Preload with error handling
useGLTF.preload('/sixthouse/jellyfish.glb');