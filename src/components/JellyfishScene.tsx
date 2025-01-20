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
  
  const { scene, animations } = useGLTF('/sixthouse/jellyfish.glb') as GLTFResult;
  const { actions } = useAnimations(animations, group);

  // Set initial scale
  useEffect(() => {
    if (group.current) {
      // Scale down the model - adjust these values as needed
      group.current.scale.set(0.15, 0.15, 0.15);
      // Initial position
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
      // Slower rotation
      group.current.rotation.y += 0.0005;
      // Gentler floating motion
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
    // Adjusted fog for better visibility
    scene.fog = new THREE.Fog(0x000000, 8, 20);
  }, [scene]);

  return (
    <>
      <ambientLight intensity={0.3} />
      {/* Adjusted light positions and intensities */}
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#4F9BFF" />
      <pointLight position={[-5, -5, -5]} intensity={0.3} color="#4F9BFF" />
    </>
  );
}

// ... (LoadingFallback and ErrorDisplay components remain the same)

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
            position: [0, 0, 2], // Moved camera closer
            fov: 50, // Adjusted field of view
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
            autoRotateSpeed={0.3} // Slowed down rotation
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