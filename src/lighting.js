import * as THREE from 'three';

import { scene } from './app';

export const addLights = () => {
  const pointOne = new THREE.PointLight(0xffffff, 0.2);
  pointOne.position.set(2, 2, 2);
  scene.add(pointOne);
  
  const pointTwo = new THREE.PointLight(0xffffff, 0.2);
  pointTwo.position.set(-2, 2, -2);
  scene.add(pointTwo);

  const pointThree = new THREE.PointLight(0xffffff, 0.2);
  pointThree.position.set(1.325, 1.35, 1.5);
  scene.add(pointThree);
  
  const ambient = new THREE.AmbientLight(0xffffff, 0.35);
  scene.add(ambient);
}