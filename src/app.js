import './style.css';
import * as THREE from 'three';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

import { loadGlove, gloveAnimationMixer } from './glove';
import { addLights } from './lighting';
import { gltfLoader, textureLoader } from './loaders';

import * as dat from 'dat.gui';
const debugObject = {};
export const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
export const scene = new THREE.Scene();

/**
 * Sizes
 */
export const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
export const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(1.5, 1.8, 4.5);
camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), -.125);
scene.add(camera);

// Controls
const controls = new FlyControls(camera, canvas);
controls.movementSpeed = 0;
controls.rollSpeed = 0;

/**
 * Renderer
 */
export const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setClearColor('#7a6654');

/**
 * Post processing
 */
export const effectComposer = new EffectComposer(renderer);
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
effectComposer.setSize(sizes.width, sizes.height);

const renderPass = new RenderPass(scene, camera);
effectComposer.addPass(renderPass);

// Textures
const bakedDeskSceneTexture = textureLoader.load('./textures/deskscene.jpg');
bakedDeskSceneTexture.flipY = false;
bakedDeskSceneTexture.encoding = THREE.sRGBEncoding;

const bakedDeskPropsTexture = textureLoader.load('./textures/deskprops.jpg');
bakedDeskPropsTexture.flipY = false;
bakedDeskPropsTexture.encoding = THREE.sRGBEncoding;

const bakedMonitorTexture = textureLoader.load('./textures/monitor.jpg');
bakedMonitorTexture.flipY = false;
bakedMonitorTexture.encoding = THREE.sRGBEncoding;

const bakedPhysicsObjectsTexture = textureLoader.load('./textures/desk_physics_objects.jpg');
bakedPhysicsObjectsTexture.flipY = false;
bakedPhysicsObjectsTexture.encoding = THREE.sRGBEncoding;

// Materials
const deskSceneBakedMaterial = new THREE.MeshBasicMaterial({ map: bakedDeskSceneTexture });
const deskPropsBakedMaterial = new THREE.MeshBasicMaterial({ map: bakedDeskPropsTexture });
const deskMonitorBakedMaterial = new THREE.MeshBasicMaterial({ map: bakedMonitorTexture });
const deskPhysicsObjectsBakedMaterial = new THREE.MeshBasicMaterial({ map: bakedPhysicsObjectsTexture });
const plantMaterial = new THREE.MeshBasicMaterial({ color: 0x5CA15F, reflectivity: 0 });

const deskSceneString = 'DeskScene';
const monitorString = 'Monitor';
const plantString = 'MovablePlant';

/**
 * Scene
 */
// addLights();
// loadGlove(scene, camera, effectComposer);

gltfLoader.load('./desk_scene.glb', gltf => {
  gltf.scene.traverse(child => {
    if (child.name.includes(deskSceneString)) {
      if (child.name.includes('Wall')) {
        child.scale.x *= 2;
        child.position.z = child.position.z + 1;
      }
      child.material = deskSceneBakedMaterial;
    } else if (child.name.includes(monitorString)) {
      child.material = deskMonitorBakedMaterial;
    } else {
      child.material = deskPropsBakedMaterial;
    }
  });

  scene.add(gltf.scene);
});

gltfLoader.load('./deskphysicsobjects.glb', gltf => {
  gltf.scene.traverse(child => {
    if (child.name === plantString) {
      child.material = plantMaterial;
    } else {
      child.material = deskPhysicsObjectsBakedMaterial;
    }
  });

  scene.add(gltf.scene);
});

// TEMP
debugObject.clearColor = '#7a6654';
gui.addColor(debugObject, 'clearColor').onChange((color) => {
  renderer.setClearColor(debugObject.clearColor);
});

debugObject.x = 0;
debugObject.y = 0;
debugObject.z = 0;

gui.add(debugObject, 'x').onChange(x => {
  camera.position.x = x;
})
gui.add(debugObject, 'y').onChange(y => {
  camera.position.y = y;
})
gui.add(debugObject, 'z').onChange(z => {
  camera.position.z = z;
})

let mousePosition = {
  x: 0,
  y: 0
};

document.onmousemove = (event) => {
  mousePosition.x = event.clientX / sizes.width;
  mousePosition.y = event.clientY / sizes.height;
}

const cameraStartPosition = camera.position;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update(elapsedTime);

  // Render through the effect composer
  effectComposer.render();

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);

  // Update glove animations
  // TODO: Use delta time here
  if (gloveAnimationMixer) {
      gloveAnimationMixer.update(0.01);
  }

  camera.rotation.y = -(mousePosition.x - .5) / 40;
  camera.position.x = 1.5 + (mousePosition.x - .5) / 20;
};

tick();
