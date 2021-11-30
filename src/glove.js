import * as THREE from 'three';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';

import { scene, camera, effectComposer } from './app';
import { textureLoader, gltfLoader } from './loaders';

// Gradient texture
const gradientTexture = textureLoader.load('/textures/gradient/3.jpg');
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.generateMipmaps = false;

// Material
const gloveMaterial = new THREE.MeshToonMaterial({
  color: 0xffffff,
  gradientMap: gradientTexture,
});

// Glove data
const meshes = [];
export let gloveAnimationMixer = undefined;
let action = undefined;

// Animation properties
const animationDuration = 0.035;
const animationTimeScale = 3;

export const loadGlove = () => {
  // Model
  gltfLoader.load('./glove.glb', (gltf) => {
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        setUpGloveMesh(child);
      }
    });

    scene.add(gltf.scene);

    const gloveAnimation = gltf.animations[0];
    action = gloveAnimationMixer.clipAction(gloveAnimation);
    action.clampWhenFinished = true;
    action.setDuration(animationDuration);
    action.setLoop(THREE.LoopOnce);
    setUpOutlinePass(scene, camera);
  });
};

const setUpGloveMesh = (mesh) => {
  mesh.geometry.computeVertexNormals();
  mesh.material = gloveMaterial;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  // TODO: Make this based off name. Might be different once glove objects are merged in blender
  if (!gloveAnimationMixer) {
    gloveAnimationMixer = new THREE.AnimationMixer(mesh);
  }
  meshes.push(mesh);
};

const setUpAnimationActionForward = () => {
  action.timeScale = animationTimeScale;
  action.time = 0;
};

const setUpAnimationActionBackward = () => {
  if (action.time === 0) {
    action.time = animationDuration;
  }
  action.timeScale = -animationTimeScale;
};

const outlineColor = 0x000000;
const outlineThickness = 2;
const edgeStrength = 2;

const setUpOutlinePass = () => {
  // TODO: Change the outline pass resolution
  const outlinePass = new OutlinePass(
    new THREE.Vector2(1920, 1080),
    scene,
    camera,
    meshes
  );
  outlinePass.visibleEdgeColor = new THREE.Color(outlineColor);
  outlinePass.edgeThickness = outlineThickness;
  outlinePass.overlayMaterial.blending = THREE.CustomBlending;
  outlinePass.edgeStrength = edgeStrength;
  effectComposer.addPass(outlinePass);
};

/**
 * Event listeners
 */
let shouldOpenHand = true;

window.addEventListener('mousedown', () => {
  if (action && shouldOpenHand) {
    console.log('play');
    action.paused = false;
    shouldOpenHand = false;
    setUpAnimationActionForward();
    action.play();
  }
});

window.addEventListener('mouseup', () => {
  if (action && !shouldOpenHand) {
    action.paused = false;
    shouldOpenHand = true;
    setUpAnimationActionBackward();
    action.play();
  }
});
