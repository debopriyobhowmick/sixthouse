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

// Fallback model for when the main model fails to load
function FallbackModel() {
  return (
    <mesh>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color="#4F9BFF" />
    </mesh>
  );
}

function JellyfishModel() {
  const group = useRef<THREE.Group>(null);
  const [modelError, setModelError] = useState<string | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  
  const modelPath = '/sixthouse/jellyfish.glb';
  
  // Use a try-catch block to handle errors during model loading
  let gltfResult: GLTFResult | null = null;
  let actions: ReturnType<typeof useAnimations>['actions'] | null = null;
  
  try {
    // Log attempt to load
    console.log(`Loading model from: ${modelPath}`);
    
    const result = useGLTF(modelPath) as unknown as GLTFResult;
    gltfResult = result;
    
    if (result && group.current) {
      // Log model details for debugging
      console.log('Model structure:', {
        hasScene: !!result.scene,
        animationCount: result.animations?.length || 0,
        materialCount: Object.keys(result.materials || {}).length,
        nodeCount: Object.keys(result.nodes || {}).length
      });
      
      const animResult = useAnimations(result.animations, group);
      actions = animResult.actions;
      
      // Log successful load
      if (!modelLoaded) {
        console.log('Animation actions:', Object.keys(animResult.actions));
        setModelLoaded(true);
      }
    }
  } catch (err) {
    console.error(`Error loading model from ${modelPath}:`, err);
    setModelError(err instanceof Error ? err.message : 'Failed to load model');
    
    // Return fallback model
    return <FallbackModel />;
  }
  
  // Set up model with rotation animation as a fallback if the model loads but animations don't work
  useFrame((state) => {
    if (group.current && (!actions || Object.keys(actions).length === 0)) {
      // Simple rotation animation if the model loads but doesn't have animations
      group.current.rotation.y += 0.005;
    }
  });
  
  // Scale model on first render
  useEffect(() => {
    if (group.current) {
      group.current.scale.set(0.05, 0.05, 0.05);
      console.log('Model scaled');
    }
  }, []);
  
  // Play animations when actions are available
  useEffect(() => {
    if (!actions) return;
    
    try {
      console.log('Attempting to play animations:', Object.keys(actions));
      
      if (Object.keys(actions).length === 0) {
        console.warn('No animation actions found in the model');
      }
      
      Object.values(actions).forEach(action => {
        if (action) {
          action.reset().play();
          console.log('Playing animation:', action.getClip().name);
        }
      });
    } catch (err) {
      console.error('Error playing animation:', err);
      setModelError(err instanceof Error ? err.message : 'Unknown error in animation');
    }
  }, [actions]);
  
  // Display error if model fails to load
  if (modelError) {
    console.error('Model error:', modelError);
    return <FallbackModel />;
  }
  
  // Render the model if available
  if (gltfResult && gltfResult.scene) {
    return (
      <group ref={group}>
        <primitive object={gltfResult.scene} />
      </group>
    );
  }
  
  // Fallback if something went wrong but no error was thrown
  return <FallbackModel />;
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
        <button 
          className="mt-2 px-3 py-1 bg-blue-900/50 text-blue-200 text-xs rounded hover:bg-blue-800/50"
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}

const JellyfishScene: React.FC = () => {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Please refresh the page to try again');

  // Enhanced error handling for the Canvas
  const onCanvasError: CanvasProps['onError'] = useCallback((error : any) => {
    console.error('Canvas error:', error);
    setHasError(true);
    setErrorMessage(error.message || 'Canvas error occurred');
  }, []);

  // Global error handling
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      // Only capture errors related to the 3D scene
      if (event.message?.includes('three') || 
          event.message?.includes('webgl') || 
          event.message?.includes('gltf') ||
          event.message?.includes('jellyfish')) {
        console.error('3D scene error:', event.error);
        setHasError(true);
        setErrorMessage(event.error?.message || 'An unexpected error occurred in the 3D scene');
      }
    };

    window.addEventListener('error', handleGlobalError);
    
    // Check if WebGL is available
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) {
        console.error('WebGL not supported');
        setHasError(true);
        setErrorMessage('WebGL not supported in your browser. Please try a different browser.');
      } else {
        console.log('WebGL supported');
      }
    } catch (e) {
      console.error('Error checking WebGL support:', e);
    }
    
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
            position: [0, 0, 3],
            fov: 45,
            near: 0.1,
            far: 1000
          }}
          style={{ background: 'transparent' }}
          onError={onCanvasError}
          gl={{ 
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
          }}
        >
          <JellyfishModel />
          <Environment />
          <OrbitControls 
            enabled={false}
          />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default JellyfishScene;

// Clear cache before preloading to avoid stale data
useGLTF.clear('/sixthouse/jellyfish.glb');

// Preload the model
try {
  useGLTF.preload('/sixthouse/jellyfish.glb');
  console.log('Preloaded jellyfish model');
} catch (e) {
  console.warn('Failed to preload model:', e);
}