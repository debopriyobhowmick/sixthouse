// three-jsx.d.ts
import { ThreeElements } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {
      orbitControls: typeof OrbitControls;
      primitive: { object: THREE.Object3D };
      group: { ref?: React.RefObject<THREE.Group> };
      mesh: { geometry?: THREE.BufferGeometry; material?: THREE.Material };
      spotLight: THREE.SpotLight;
      ambientLight: THREE.AmbientLight;
      pointLight: THREE.PointLight;
      meshPhysicalMaterial: THREE.MeshPhysicalMaterial;
      meshStandardMaterial: THREE.MeshStandardMaterial;
      directionalLight: THREE.DirectionalLight;
    }
  }
}