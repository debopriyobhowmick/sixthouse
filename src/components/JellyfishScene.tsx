// JellyfishScene.tsx
import React, { Suspense, useEffect, useRef, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations, Stats } from '@react-three/drei';
import * as THREE from 'three';
import type { Props as CanvasProps } from '@react-three/fiber';

type GLTFResult = {
  nodes: { [key: string]: THREE.Mesh };
  materials: { [key: string]: THREE.Material };
  animations: THREE.AnimationClip[];
  scene: THREE.Group;
};

// Visual debug helpers
function DebugHelpers() {
  return (
    <>
      <axesHelper args={[5]} />
      <gridHelper args={[10, 10]} />
    </>
  );
}

function JellyfishModel() {
  const group = useRef<THREE.Group>(null);
  const [modelError, setModelError] = useState<string | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  
  const modelPath = '/sixthouse/jellyfish.glb';
  
  // Always call hooks at the top level
  const gltf = useGLTF(modelPath) as unknown as GLTFResult;
  const { actions, mixer } = useAnimations(gltf.animations, group);
  const { camera } = useThree();
  
  // Set up model with rotation and visibility helpers
  useFrame((state) => {
    if (group.current) {
      // Gentle rotation for visibility
      group.current.rotation.y += 0.005;
      
      // Log position occasionally for debugging
      if (state.clock.elapsedTime % 3 < 0.1 && group.current) {
        console.log('Model position:', {
          x: group.current.position.x,
          y: group.current.position.y,
          z: group.current.position.z,
          visible: group.current.visible
        });
      }
    }
  });
  
  // Enhanced model setup
  useEffect(() => {
    try {
      // Log model details for debugging
      console.log('Model structure:', {
        hasScene: !!gltf.scene,
        animationCount: gltf.animations?.length || 0,
        materialCount: Object.keys(gltf.materials || {}).length,
        nodeCount: Object.keys(gltf.nodes || {}).length
      });
      
      // Position camera to better see the model
      camera.position.set(0, 0, 5);
      camera.lookAt(0, 0, 0);
      
      if (group.current && gltf.scene) {
        // Make sure model is visible
        group.current.visible = true;
        
        // Reset position to origin
        group.current.position.set(0, 0, 0);
        
        // Try different scale to ensure visibility
        group.current.scale.set(1, 1, 1);  // Try a larger scale first
        
        // Brighten materials to ensure visibility
        gltf.scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            
                          // Log material info
            if (mesh.material) {
              if (Array.isArray(mesh.material)) {
                // Handle material array
                mesh.material.forEach((mat, index) => {
                  console.log(`Material array[${index}] found:`, {
                    type: mat.type,
                    color: 'color' in mat ? (mat as any).color?.getHexString() : 'none',
                    opacity: 'opacity' in mat ? (mat as any).opacity : undefined,
                    transparent: 'transparent' in mat ? (mat as any).transparent : undefined
                  });
                });
              } else {
                // Handle single material
                console.log('Material found:', {
                  type: mesh.material.type,
                  color: 'color' in mesh.material ? (mesh.material as any).color?.getHexString() : 'none',
                  opacity: 'opacity' in mesh.material ? (mesh.material as any).opacity : undefined,
                  transparent: 'transparent' in mesh.material ? (mesh.material as any).transparent : undefined
                });
              }
              
              // Ensure material is visible
              if ((mesh.material as any).color) {
                // Make material emissive to be more visible
                (mesh.material as any).emissive = new THREE.Color(0x4444ff);
                (mesh.material as any).emissiveIntensity = 0.5;
              }
              
              // Ensure opacity is visible
              if ((mesh.material as any).opacity !== undefined) {
                (mesh.material as any).opacity = 1.0;
                (mesh.material as any).transparent = true;
              }
            }
          }
        });
        
        console.log('Model prepared for visibility');
      }
      
      setModelLoaded(true);
    } catch (err) {
      console.error(`Error processing model:`, err);
      setModelError(err instanceof Error ? err.message : 'Failed to process model');
    }
  }, [gltf, camera]);
  
  // Play animations when actions are available
  useEffect(() => {
    try {
      console.log('Animation actions available:', Object.keys(actions));
      
      if (Object.keys(actions).length === 0) {
        console.warn('No animation actions found in the model');
      }
      
      Object.values(actions).forEach(action => {
        if (action) {
          action.reset().play();
          console.log('Playing animation:', action.getClip().name);
          
          // Set animation properties for better visibility
          action.setEffectiveTimeScale(0.5); // Slow down the animation
          action.setEffectiveWeight(1.0);    // Full weight
        }
      });
      
      // If we have a mixer but no actions, check clips directly
      if (mixer && Object.keys(actions).length === 0 && gltf.animations.length > 0) {
        console.log('Trying to play animations directly from clips');
        gltf.animations.forEach(clip => {
          const action = mixer.clipAction(clip);
          action.play();
          console.log('Playing clip directly:', clip.name);
        });
      }
    } catch (err) {
      console.error('Error playing animation:', err);
      setModelError(err instanceof Error ? err.message : 'Unknown error in animation');
    }
  }, [actions, mixer, gltf.animations]);
  
  if (modelError) {
    console.error('Model error:', modelError);
    return (
      <>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#4F9BFF" emissive="#0000ff" emissiveIntensity={0.5} />
        </mesh>
        <DebugHelpers />
      </>
    );
  }
  
  return (
    <group ref={group}>
      {gltf.scene ? (
        <>
          <primitive object={gltf.scene} />
          {/* Add a helper sphere to indicate model position */}
          <mesh position={[0, 0, 0]} scale={[0.1, 0.1, 0.1]}>
            <sphereGeometry />
            <meshBasicMaterial color="red" />
          </mesh>
        </>
      ) : (
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#4F9BFF" />
        </mesh>
      )}
      <DebugHelpers />
    </group>
  );
}

function Environment() {
  const { scene } = useThree();

  useEffect(() => {
    // Remove fog for better visibility during debugging
    scene.fog = null; 
    
    // Set a dark but visible background color
    scene.background = new THREE.Color(0x111122);
  }, [scene]);

  return (
    <>
      <ambientLight intensity={1.0} /> {/* Increased light intensity */}
      <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#aaaaff" />
      <pointLight position={[0, 0, 2]} intensity={1} color="#ffffff" />
    </>
  );
}

const JellyfishScene: React.FC = () => {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Please refresh the page to try again');
  const [showStats, setShowStats] = useState(true); // Show performance stats
  const [showOrbitControls, setShowOrbitControls] = useState(true); // Enable orbit controls for debugging

  // Enhanced error handling for the Canvas
  const onCanvasError: CanvasProps['onError'] = useCallback((error: unknown) => {
    console.error('Canvas error:', error);
    setHasError(true);
    setErrorMessage(error instanceof Error ? error.message : 'Canvas error occurred');
  }, []);

  useEffect(() => {
    console.log('JellyfishScene mounted - starting debug mode');
    
    // Enable debug controls with keyboard
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 's') {
        setShowStats(prev => !prev);
      } else if (event.key === 'o') {
        setShowOrbitControls(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-white/60 bg-black/20 px-6 py-3 rounded-lg backdrop-blur-sm">
          <p className="text-lg">Failed to load 3D scene</p>
          <p className="text-sm opacity-75 mt-1">{errorMessage}</p>
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

  return (
    <div className="absolute inset-0 z-0">
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white/60 bg-black/20 px-6 py-3 rounded-lg backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <div className="animate-spin h-4 w-4 border-2 border-white/60 rounded-full border-t-transparent"></div>
              <p>Loading 3D Scene...</p>
            </div>
          </div>
        </div>
      }>
        <Canvas
          camera={{ 
            position: [0, 0, 5],
            fov: 45,
            near: 0.1,
            far: 1000
          }}
          style={{ background: '#111122' }} // Dark but visible background
          onError={onCanvasError}
          gl={{ 
            antialias: true,
            alpha: false, // Disable alpha for better visibility
            powerPreference: 'high-performance'
          }}
        >
          <color attach="background" args={['#111122']} />
          <JellyfishModel />
          <Environment />
          {showOrbitControls && (
            <OrbitControls 
              enabled={true}
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
            />
          )}
          {showStats && <Stats />}
        </Canvas>
      </Suspense>
      
      {/* Debug Controls UI */}
      <div className="fixed bottom-4 right-4 z-30 flex space-x-2">
        <button 
          className="px-3 py-1 bg-blue-900/50 text-blue-200 text-xs rounded hover:bg-blue-800/50"
          onClick={() => setShowStats(prev => !prev)}
        >
          {showStats ? 'Hide' : 'Show'} Stats
        </button>
        <button 
          className="px-3 py-1 bg-blue-900/50 text-blue-200 text-xs rounded hover:bg-blue-800/50"
          onClick={() => setShowOrbitControls(prev => !prev)}
        >
          {showOrbitControls ? 'Disable' : 'Enable'} Controls
        </button>
      </div>
      
      {/* Instructions */}
      <div className="fixed top-4 left-4 z-30 bg-black/40 text-white/80 px-3 py-2 rounded text-xs">
        <p>Debug Mode Active</p>
        <p className="mt-1">Press 'S' to toggle stats</p>
        <p>Press 'O' to toggle orbit controls</p>
        <p className="mt-1">Use mouse to rotate/zoom if controls enabled</p>
      </div>
    </div>
  );
};

export default JellyfishScene;

// Clear cache before preloading
useGLTF.clear('/sixthouse/jellyfish.glb');

// Preload the model
try {
  useGLTF.preload('/sixthouse/jellyfish.glb');
  console.log('Preloaded jellyfish model');
} catch (e) {
  console.warn('Failed to preload model:', e);
}