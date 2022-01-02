import * as THREE from 'three';

import { scene } from './app';

export const addLights = () => {
  const pointOne = new THREE.PointLight(0xdddddd, .25);
  pointOne.position.set(2, 2, 2);
  scene.add(pointOne);
  
  const pointTwo = new THREE.PointLight(0xdddddd, .25);
  pointTwo.position.set(-2, 2, -2);
  scene.add(pointTwo);

  const pointThree = new THREE.PointLight(0xdddddd, .25);
  pointThree.position.set(1.325, 1.35, 1.5);
  scene.add(pointThree);
  
  const ambient = new THREE.AmbientLight(0xdddddd, 0.3);
  scene.add(ambient);

  const rectAreaLight = new THREE.RectAreaLight(0xffffff, 1.3, 10, 10);
  rectAreaLight.position.set(1.5, 10, 5);
  rectAreaLight.lookAt(new THREE.Vector3(1.35, 1.35, 1.35));
  scene.add(rectAreaLight);
}