import * as THREE from 'three';

import { scene } from './app';

export const addLights = () => {
  const pointOne = new THREE.PointLight(0xffffff, 0.2);
  pointOne.position.set(2, 2, 2);
  scene.add(pointOne);
  
  const pointTwo = new THREE.PointLight(0xffffff, 0.2);
  pointTwo.position.set(-2, 2, -2);
  scene.add(pointTwo);
  
  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambient);
}