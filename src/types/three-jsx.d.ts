// three-jsx.d.ts
import { ThreeElements } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

type ThreeJSX = {
  orbitControls: JSX.IntrinsicElements['div'] & Parameters<typeof OrbitControls>[0];
  primitive: JSX.IntrinsicElements['div'] & { object: THREE.Object3D };
  group: JSX.IntrinsicElements['div'] & { ref?: React.RefObject<THREE.Group> };
  mesh: JSX.IntrinsicElements['div'] & {
    geometry?: THREE.BufferGeometry;
    material?: THREE.Material;
  };
  spotLight: JSX.IntrinsicElements['div'] & THREE.SpotLightParameters;
  ambientLight: JSX.IntrinsicElements['div'] & THREE.AmbientLightParameters;
  pointLight: JSX.IntrinsicElements['div'] & THREE.PointLightParameters;
  meshPhysicalMaterial: JSX.IntrinsicElements['div'] & THREE.MeshPhysicalMaterialParameters;
  meshStandardMaterial: JSX.IntrinsicElements['div'] & THREE.MeshStandardMaterialParameters;
  directionalLight: JSX.IntrinsicElements['div'] & THREE.DirectionalLightParameters;
};

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements, ThreeJSX {}
  }
}