// TODOS: 
// Physics objects
// Implement AWS

import './style.css';
import * as THREE from 'three';
import CANNON from 'cannon' 
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

import {
  bakedDeskMaterial,
  bakedPropsMaterial,
  bakedMonitorMaterial,
  monitorWallpaperMaterial,
  potMaterial,
  plantMaterial,
  mugMaterial,
} from './materials';
import { addLights } from './lighting';
import { gltfLoader, textureLoader } from './loaders';

/*
import * as dat from 'dat.gui';
const debugObject = {};
export const gui = new dat.GUI();
gui.hide();
*/

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

const deskSceneString = 'DeskScene';
const monitorString = 'Monitor';
const plantString = 'MovablePlant';
const potString = 'MovablePot';
const mugString = 'MovableMugObject';

const allMeshs = [];

// Computer images
const computerImagePositions = {
  './images/github.png': { 
    position: new THREE.Vector3(.95, 1.75, 1.25),
    scale: .3,
  },
  './images/linkedin.png': {
    position: new THREE.Vector3(1.75, 1.75, 1.25),
    scale: .3,
  },
  './images/resume.png': {
    position: new THREE.Vector3(1.325, 1.35, 1.25),
    scale: .4,
  },
}

const addComputerImage = (path) => {
  const material = new THREE.MeshLambertMaterial({
    map: textureLoader.load(path),
    alphaTest: .25,
  });
  const scale = computerImagePositions[path].scale;
  const geometry = new THREE.PlaneGeometry(scale, scale);
  const mesh = new THREE.Mesh(geometry, material);
  const position = computerImagePositions[path].position;
  mesh.name = path;
  mesh.position.x = position.x;
  mesh.position.y = position.y;
  mesh.position.z = position.z;
  scene.add(mesh);
  return mesh;
}

addLights();

// Raycaster
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let mousePosition = { x: 0, y: 0 };

function onPointerMove( event ) {
  const oldX = pointer.x;
  const oldY = pointer.y;

  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
  mousePosition.x = event.clientX / sizes.width;
  mousePosition.y = event.clientY / sizes.height;

  const diffX = pointer.x - oldX;
  const diffY = pointer.y - oldY;

  raycaster.setFromCamera( pointer, camera );
  imageMeshIntersects = raycaster.intersectObjects(imageMeshs, false);

  keyMeshIntersects = [];
  keyMeshs.forEach(keyMesh => {
    if (keyMeshs != undefined) {
      const intersection = raycaster.intersectObject(keyMesh, false);
      if (intersection.length > 0)
        keyMeshIntersects.push(intersection[0]);
    }
  });

  draggableMeshIntersects = raycaster.intersectObjects(draggableMeshs, false);

  if (draggingMesh) {
    mugBody.applyForce(new CANNON.Vec3(diffX * 200, diffY * 65, 0), mugBody.position);
  }
}

document.addEventListener('mousemove', onPointerMove);

const imageMeshs = [];
let imageMeshIntersects = [];
imageMeshs.push(addComputerImage('./images/github.png'));
imageMeshs.push(addComputerImage('./images/linkedin.png'));
imageMeshs.push(addComputerImage('./images/resume.png'));

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
}

const imageMap = {
  './images/github.png': {
    rotation: getRandomInt(2) / 10 - .1,
    offset: getRandomInt(100),
  },
  './images/linkedin.png': {
    rotation: getRandomInt(2) / 10 - .1,
    offset: getRandomInt(100),
  },
  './images/resume.png': {
    rotation: getRandomInt(2) / 10 - .1,
    offset: getRandomInt(100),
  },
}

// Clicking
const githubUrl = 'https://github.com/benkahlert';
const linkedinUrl = 'https://www.linkedin.com/in/benjamin-kahlert-0b4709126/';
const resumeUrl = 'https://drive.google.com/file/d/1_IaPj3Qc3xBGi2IRy6fqbKvTXUC3qQWS/view?usp=sharing';

const keyMeshs = [];
let keyMeshIntersects = [];
const keyPositionMap = {};
let draggingMesh = undefined;

document.addEventListener('mousedown', () => {
  // If mouse is over an image when clicked
  if (imageMeshIntersects.length > 0) {
    const imageMesh = imageMeshIntersects[0];
    if (imageMesh.object.name.includes('github')) {
      window.open(githubUrl, '_blank')
    } else if (imageMesh.object.name.includes('linkedin')) {
      window.open(linkedinUrl, '_blank')
    } else if (imageMesh.object.name.includes('resume')) {
      window.open(resumeUrl, '_blank')
    }
  }

  if (draggableMeshIntersects.length > 0) {
    draggingMesh = draggableMeshIntersects[0];
  }
});

document.addEventListener('mouseup', () => {
  draggingMesh = undefined;
})

/**
 * Scene
 */
gltfLoader.load('./desk_scene.glb', gltf => {
  gltf.scene.traverse(child => {
    if (child.isMesh) {
      allMeshs.push(child);
    }
    
    if (child.name.includes(deskSceneString)) {
      if (child.name.includes('Wall')) {
        child.scale.x *= 2;
        child.position.z = child.position.z + 1;
      }
      child.material = bakedDeskMaterial;
    } else if (child.name.includes(monitorString)) {
      if (child.name === 'MonitorFace') {
        child.material = monitorWallpaperMaterial;
      } else {
        child.material = bakedMonitorMaterial;
      }
    } else {
      child.material = bakedPropsMaterial;
    }

    if (child.name.includes('Key') && !child.name.includes('KeyboardBase')) {
      keyPositionMap[child.name] = new THREE.Vector3(child.position.x, child.position.y, child.position.z);
      keyMeshs.push(child);
      child.material = bakedPropsMaterial;
    }
  });

  scene.add(gltf.scene);
});

let mug = null;
let draggableMeshs = [];
let draggableMeshIntersects = [];

gltfLoader.load('./deskphysicsobjects.glb', gltf => {
  const additions = [];
  gltf.scene.traverse(child => {
    if (child.name === plantString) {
      // child.material = plantMaterial;
      // additions.push(child);
    } else if (child.name === potString) {
      // child.material = potMaterial;
      // additions.push(child);
    } else if (child.name === mugString) {
      child.material = mugMaterial;
      mug = child;
      additions.push(child);
    }
  });

  additions.forEach(addition => {
    scene.add(addition);
    draggableMeshs.push(addition);
    allMeshs.push(addition);
  });
});

/*
 * Physics
 */
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);
const defaultMaterial = new CANNON.Material('default')
const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.2,
        restitution: 0.01
    }
)
world.addContactMaterial(defaultContactMaterial);

// Mug
// const mugShape = new CANNON.Box(new CANNON.Vec3(.1, .1, .1));
const mugShape = new CANNON.Cylinder(.175, .175, .2, 12);
const mugBody = new CANNON.Body({
  mass: 1,
  position: new CANNON.Vec3(2.8, 1.879, 1.7645),
  shape: mugShape,
  material: defaultMaterial
});
mugBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
world.addBody(mugBody);

// Desk
const deskShape = new CANNON.Plane();
const deskBody = new CANNON.Body();
deskBody.mass = 0;
deskBody.addShape(deskShape);
deskBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
deskBody.position.y = .775;
deskBody.material = defaultMaterial;
world.addBody(deskBody);

/**
 * Animate
 */
const lerp = (start, end, amt) => {
  return (1 - amt) * start + amt * end;
}

const clock = new THREE.Clock();
let oldElapsedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime
  oldElapsedTime = elapsedTime

  // Update controls
  controls.update(elapsedTime);

  // Update physics
  world.step(1 / 60, deltaTime, 3);

  if (mug && mugBody) {
    mug.position.copy(mugBody.position);
    mug.quaternion.copy(mugBody.quaternion);
    mug.rotateOnAxis(new CANNON.Vec3(1, 0, 0), Math.PI * 0.5)
  }

  // Render through the effect composer
  effectComposer.render();

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);

  camera.rotation.y = -(mousePosition.x - .5) / 40;
  camera.position.x = 1.5 + (mousePosition.x - .5) / 20;

  let pointer = false;

  // Keys
  keyMeshs.forEach(key => {
    let found = false;
    keyMeshIntersects.forEach(intersect => {
      if (key.name === intersect.object.name) {
        found = true;
        pointer = true;
      }
    });

    if (found) {
      key.position.y = lerp(key.position.y, keyPositionMap[key.name].y - .015, .1);
    } else {
      key.position.y = lerp(key.position.y, keyPositionMap[key.name].y, .2);
    }
  });

  // Images
  imageMeshs.forEach(image => {
    let found = false;
    imageMeshIntersects.forEach(intersect => {
      if (image.name === intersect.object.name) {
        found = true;
        pointer = true;
      }
    });

    if (found) {
      image.scale.x = lerp(image.scale.x, 1.2, .1);
      image.scale.y = lerp(image.scale.y, 1.2, .1);
      image.rotation.z = lerp(image.rotation.z, Math.sin(elapsedTime * 2) * .3, .2);
    } else {
      image.scale.x = lerp(image.scale.x, 1, .2);
      image.scale.y = lerp(image.scale.y, 1, .2);
      image.rotation.z = lerp(image.rotation.z, imageMap[image.name].rotation + Math.sin(elapsedTime * .5 + imageMap[image.name].offset) * .15, .2);
    }
  });

  // Change pointer styling
  if (pointer) {
    document.body.style.cursor = 'pointer';
  } else if (document.body.style.cursor === 'pointer') {
    document.body.style.cursor = 'auto';
  }
};

tick();
