// JellyfishScene.tsx
import React, { Suspense, useEffect, useRef, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

type GLTFResult = {
  nodes: { [key: string]: THREE.Mesh };
  materials: { [key: string]: THREE.Material };
  animations: THREE.AnimationClip[];
  scene: THREE.Group;
};

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-white/60 bg-black/20 px-6 py-3 rounded-lg backdrop-blur-sm">
        <p className="text-lg">Failed to load 3D scene</p>
        <p className="text-sm opacity-75 mt-1">{message}</p>
      </div>
    </div>
  );
};

const LoadingFallback: React.FC = () => {
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
};

function JellyfishModel() {
  const group = useRef<THREE.Group>(null);
  const [modelError, setModelError] = useState<string | null>(null);
  
  const { scene, animations } = useGLTF('/sixthouse/jellyfish.glb') as  unknown as GLTFResult;
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (group.current) {
      group.current.scale.set(0.15, 0.15, 0.15);
      group.current.position.set(0, 0, 0);
    }
  }, []);

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
      group.current.rotation.y += 0.0005;
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
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
    scene.fog = new THREE.Fog(0x000000, 8, 20);
  }, [scene]);

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#4F9BFF" />
      <pointLight position={[-5, -5, -5]} intensity={0.3} color="#4F9BFF" />
    </>
  );
}

const JellyfishScene: React.FC = () => {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Please refresh the page to try again');

  // Use ThreeEvent type for Canvas error handling
  const handleCanvasError = useCallback((error: Event) => {
    console.error('Canvas error:', error);
    setHasError(true);
    if (error instanceof Error) {
      setErrorMessage(error.message);
    } else {
      setErrorMessage('An error occurred in the 3D scene');
    }
  }, []);

  useEffect(() => {
    const handleGlobalError = (event: Event) => {
      console.error('Global error:', event);
      setHasError(true);
      if (event instanceof ErrorEvent) {
        setErrorMessage(event.message);
      } else {
        setErrorMessage('An unexpected error occurred');
      }
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
            position: [0, 0, 2],
            fov: 50,
            near: 0.1,
            far: 1000
          }}
          style={{ background: 'transparent' }}
          onError={handleCanvasError}
        >
          <JellyfishModel />
          <Environment />
          <OrbitControls 
            enabled 
            enableDamping={false}
            rotateSpeed={0.3}
            autoRotate={true}
            autoRotateSpeed={0.3}
            maxPolarAngle={Math.PI / 1.8}
            minPolarAngle={Math.PI / 2.5}
          />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default JellyfishScene;

useGLTF.preload('/sixthouse/jellyfish.glb');