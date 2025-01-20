import { ThreeElements } from '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {
      orbitControls: any;
      primitive: any;
      group: any;
      mesh: any;
      spotLight: any;
      ambientLight: any;
      pointLight: any;
      meshPhysicalMaterial: any;
      meshStandardMaterial: any;
      directionalLight: any;
    }
  }
}