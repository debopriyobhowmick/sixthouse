// types/three-jsx.d.ts
import { Object3DNode } from '@react-three/fiber'
import { Group, Mesh, SpotLight, PointLight, AmbientLight, DirectionalLight } from 'three'
import { ThreeElements } from '@react-three/fiber'


declare module '@react-three/fiber' {
  interface ThreeElements {
    group: Object3DNode<Group, typeof Group>
    mesh: Object3DNode<Mesh, typeof Mesh>
    spotLight: Object3DNode<SpotLight, typeof SpotLight>
    pointLight: Object3DNode<PointLight, typeof PointLight>
    ambientLight: Object3DNode<AmbientLight, typeof AmbientLight>
    directionalLight: Object3DNode<DirectionalLight, typeof DirectionalLight>
  }
}