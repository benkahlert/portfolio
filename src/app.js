import './style.css';
import * as THREE from 'three';
import CANNON from 'cannon' 
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { gltfLoader } from './loaders';

import {
  configureDeskObject,
  configureWallObject,
  configureMonitorFaceObject,
  configureMonitorObject,
  configurePropsObject,
  configureKeyObject,
  configureMugObject,
  configurePotObject,
  configurePlantObject
} from './object-helpers';
import names from './identifiers';
import { addLights } from './lighting';
import { Images, imageData, addImage, githubUrl, linkedinUrl, resumeUrl } from './images';
import { lerp } from './helpers';
import CannonDebugger from 'cannon-es-debugger';

import * as dat from 'dat.gui';
const debugObject = {};
export const gui = new dat.GUI();
// gui.hide();


/**
 * 
 * 
 * 
 * This part is loads of set up
 * 
 * 
 * 
 */

/**
 * Canvas & scene
 */
const canvas = document.querySelector('canvas.webgl');
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
// controls.dragToLook = true

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

/*
 * Raycaster
 */
const raycaster = new THREE.Raycaster();
const mouse = {
  pointer: new THREE.Vector2(),
  lastPointer: new THREE.Vector2(),
  position: new THREE.Vector2(),
};

/**
 * 
 * 
 * 
 * Start of actual code
 * 
 * 
 * 
 */

/*
 * Variables for keeping track of meshes and interacting with them
 */
const images = []; // Array for image meshs
let imagesMouseOver = []; // Array for raycaster intersect results

const keys = []; // Array for keyboard key meshs
let keysMouseOver = []; // Array for raycaster intersect results
const keyData = {} // Used to keep track of key positions so that they can animate correctly

let mug = null;
let draggableMeshs = [];
let draggableMeshIntersects = [];

/*
 * Event listeners
 */
let draggingMesh = undefined;

document.addEventListener('mousemove', (event) => {
  // Mouse pointer calculations
  mouse.lastPointer = new THREE.Vector2(mouse.pointer.x, mouse.pointer.y);
  mouse.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
  mouse.position.x = event.clientX / sizes.width;
  mouse.position.y = event.clientY / sizes.height;
  const diff = new THREE.Vector2(mouse.pointer.x - mouse.lastPointer.x, mouse.pointer.y - mouse.lastPointer.y);

  // Raycaster checks
  raycaster.setFromCamera(mouse.pointer, camera);
  imagesMouseOver = raycaster.intersectObjects(images, false);
  keysMouseOver = raycaster.intersectObjects(keys, false);
  draggableMeshIntersects = raycaster.intersectObjects(draggableMeshs, false);

  if (draggingMesh) {
    const horizontalMultiplier = 3000;
    const verticalMultiplier = 1500;
    const maxForce = 1.2;

    const horizontalForce = diff.x * horizontalMultiplier;
    const verticalForce = diff.y * verticalMultiplier;
    const horizontalMagnitude = Math.min(Math.abs(diff.x * horizontalMultiplier), maxForce);
    const verticalMagnitude = Math.min(Math.abs(diff.y * verticalMultiplier), maxForce / 1.5);

    mugBody.applyForce(new CANNON.Vec3(horizontalMagnitude * Math.sign(horizontalForce), (verticalMagnitude + (horizontalMagnitude * .25)) * Math.sign(verticalForce), 0), mugBody.position);
  }
});

document.addEventListener('mousedown', () => {
  // If mouse is over an image when clicked
  if (imagesMouseOver.length > 0) {
    const imageMouseOver = imagesMouseOver[0].object.name;

    if (imageMouseOver === Images.Github) {
      window.open(githubUrl, '_blank')
    } else if (imageMouseOver === Images.LinkedIn) {
      window.open(linkedinUrl, '_blank')
    } else if (imageMouseOver === Images.Resume) {
      window.open(resumeUrl, '_blank')
    }
  }

  if (draggableMeshIntersects.length > 0) {
    draggingMesh = draggableMeshIntersects[0];
  }
});

document.addEventListener('mouseup', () => {
  draggingMesh = undefined;
});

/* 
 * Loading functions
 */
const loadDeskScene = () => {
  gltfLoader.load('./desk_scene.glb', gltf => {
    gltf.scene.traverse(child => {
      // Desk
      if (child.name.includes(names.desk)) {
        // Wall
        if (child.name.includes(names.wall)) {
          configureWallObject(child);
        }
        configureDeskObject(child);
      } else if (child.name.includes(names.monitor)) {
        // Monitor
        if (child.name === names.monitorFace)
          configureMonitorFaceObject(child);
        else
          configureMonitorObject(child);
      } else {
        // Props
        configurePropsObject(child);
      }
  
      // Keys
      if (child.name.includes(names.key) && !child.name.includes(names.keyboardBase)) {
        configureKeyObject(child, keys, keyData);
      }
    });
  
    scene.add(gltf.scene);
  });
};

const loadProps = () => {
  gltfLoader.load('./desk_physics_objects.glb', gltf => {
    const additions = [];
    gltf.scene.traverse(child => {
      if (child.name === names.plant) {
        additions.push(child);
        configurePlantObject(child);
      } else if (child.name === names.pot) {
        additions.push(child);
        configurePotObject(child);
      } else if (child.name === names.mug) {
        configureMugObject(child);
        mug = child;
        additions.push(child);
      }
    });
  
    additions.forEach(addition => {
      scene.add(addition);
      draggableMeshs.push(addition);
    });
  });
}

/*
 * Adding things into the scene
 */
addLights();

/*
 * Add images on the computer monitor
 */
const githubImage = addImage(Images.Github);
images.push(githubImage);
scene.add(githubImage);
const linkedinImage = addImage(Images.LinkedIn);
images.push(linkedinImage);
scene.add(linkedinImage);
const resumeImage = addImage(Images.Resume);
images.push(resumeImage);
scene.add(resumeImage);

/**
 * Loading
 */
loadDeskScene();
loadProps();

/*
 * Physics
 */
const world = new CANNON.World();
const cannonDebugRenderer = new CannonDebugger(scene, world);
world.gravity.set(0, -9.82, 0);
// const defaultMaterial = new CANNON.Material('default')
// const defaultContactMaterial = new CANNON.ContactMaterial(
//     defaultMaterial,
//     defaultMaterial,
//     {
//         friction: 0.2,
//         restitution: 0.01
//     }
// )
// world.addContactMaterial(defaultContactMaterial);

// Mug
// co  nst mugShape = new CANNON.Box(new CANNON.Vec3(.1, .1, .1));
const mugShape = new CANNON.Cylinder(.16, .16, .3, 20);
const handleShape = new CANNON.Box(new CANNON.Vec3(.1, .025, .12));
const mugPosition = new CANNON.Vec3(2.8, 1.879, 1.7645);
const mugBody = new CANNON.Body({
  mass: 1,
  position: mugPosition,
  shape: mugShape,
  // material: defaultMaterial
});
mugBody.addShape(handleShape, new CANNON.Vec3(-.175, 0, 0));
mugBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
world.addBody(mugBody);

// Desk
const deskShape = new CANNON.Box(new CANNON.Vec3(2.45, 0.02, 0.95));
const deskBody = new CANNON.Body({
  mass: 0,
  position: new CANNON.Vec3(1.25, .71, 1.6),
  shape: deskShape,
});
// deskBody.material = defaultMaterial;
world.addBody(deskBody);

// Mat
const matShape = new CANNON.Box(new CANNON.Vec3(.99, 0.01, 0.57));
const matBody = new CANNON.Body({
  mass: 0,
  position: new CANNON.Vec3(1.31, .75, 1.8),
  shape: matShape,
});
// deskBody.material = defaultMaterial;
world.addBody(matBody);

// const positionFolder = gui.addFolder('position');
// positionFolder.add(matBody.position, 'x');
// positionFolder.add(matBody.position, 'y');
// positionFolder.add(matBody.position, 'z');

// const scaleFolder = gui.addFolder('scale');
// scaleFolder.add(matShape.halfExtents, 'x');
// scaleFolder.add(matShape.halfExtents, 'y');
// scaleFolder.add(matShape.halfExtents, 'z');

// Keyboard
const keyboardShape = new CANNON.Box(new CANNON.Vec3(.45, 0.04, 0.17));
const keyboardBody = new CANNON.Body({
  mass: 0,
  position: new CANNON.Vec3(.98, .8, 2.075),
  shape: keyboardShape,
});
keyboardBody.quaternion.y = .025;
// deskBody.material = defaultMaterial;
world.addBody(keyboardBody);

// const positionFolder = gui.addFolder('position');
// positionFolder.add(keyboardBody.position, 'x');
// positionFolder.add(keyboardBody.position, 'y');
// positionFolder.add(keyboardBody.position, 'z');

// const rotationFolder = gui.addFolder('rotation');
// rotationFolder.add(keyboardBody.quaternion, 'x');
// rotationFolder.add(keyboardBody.quaternion, 'y');
// rotationFolder.add(keyboardBody.quaternion, 'z');

// const scaleFolder = gui.addFolder('scale');
// scaleFolder.add(keyboardShape.halfExtents, 'x');
// scaleFolder.add(keyboardShape.halfExtents, 'y');
// scaleFolder.add(keyboardShape.halfExtents, 'z');

// Trackpad
const trackpadShape = new CANNON.Box(new CANNON.Vec3(.27, 0.023, 0.27));
const trackpadBody = new CANNON.Body({
  mass: 0,
  position: new CANNON.Vec3(1.9, .785, 2.05),
  shape: trackpadShape,
});
trackpadBody.quaternion.y = -.05;
// deskBody.material = defaultMaterial;
world.addBody(trackpadBody);

// const positionFolder = gui.addFolder('position');
// positionFolder.add(trackpadBody.position, 'x');
// positionFolder.add(trackpadBody.position, 'y');
// positionFolder.add(trackpadBody.position, 'z');

// const rotationFolder = gui.addFolder('rotation');
// rotationFolder.add(trackpadBody.quaternion, 'x');
// rotationFolder.add(trackpadBody.quaternion, 'y');
// rotationFolder.add(trackpadBody.quaternion, 'z');

// const scaleFolder = gui.addFolder('scale');
// scaleFolder.add(trackpadShape.halfExtents, 'x');
// scaleFolder.add(trackpadShape.halfExtents, 'y');
// scaleFolder.add(trackpadShape.halfExtents, 'z');

// Monitor base
const monitorBaseShape = new CANNON.Cylinder(.3, .3, .05, 20);
const monitorBaseBody = new CANNON.Body({
  mass: 0,
  position: new CANNON.Vec3(1.35, .74, 1),
  shape: monitorBaseShape,
});
monitorBaseBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
// deskBody.material = defaultMaterial;
world.addBody(monitorBaseBody);

// const positionFolder = gui.addFolder('position');
// positionFolder.add(monitorBaseBody.position, 'x');
// positionFolder.add(monitorBaseBody.position, 'y');
// positionFolder.add(monitorBaseBody.position, 'z');

// Monitor stand
const monitorStandShape = new CANNON.Cylinder(.07, .07, .25, 20);
const monitorStandBody = new CANNON.Body({
  mass: 0,
  position: new CANNON.Vec3(1.35, .92, 1.02),
  shape: monitorStandShape,
});
monitorStandBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
// deskBody.material = defaultMaterial;
world.addBody(monitorStandBody);

// const positionFolder = gui.addFolder('position');
// positionFolder.add(monitorStandBody.position, 'x');
// positionFolder.add(monitorStandBody.position, 'y');
// positionFolder.add(monitorStandBody.position, 'z');

// Monitor
const monitorShape = new CANNON.Box(new CANNON.Vec3(.85, 0.06, 0.53));
const monitorBody = new CANNON.Body({
  mass: 0,
  position: new CANNON.Vec3(1.35, 1.55, 1.19),
  shape: monitorShape,
});
monitorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
// deskBody.material = defaultMaterial;
world.addBody(monitorBody);

// const positionFolder = gui.addFolder('position');
// positionFolder.add(monitorBody.position, 'x');
// positionFolder.add(monitorBody.position, 'y');
// positionFolder.add(monitorBody.position, 'z');

// const rotationFolder = gui.addFolder('rotation');
// rotationFolder.add(trackpadBody.quaternion, 'x');
// rotationFolder.add(trackpadBody.quaternion, 'y');
// rotationFolder.add(trackpadBody.quaternion, 'z');

// const scaleFolder = gui.addFolder('scale');
// scaleFolder.add(monitorShape.halfExtents, 'x');
// scaleFolder.add(monitorShape.halfExtents, 'y');
// scaleFolder.add(monitorShape.halfExtents, 'z');

// Notebook
const notebookShape = new CANNON.Box(new CANNON.Vec3(-.33, 0.025, 0.47));
const notebookBody = new CANNON.Body({
  mass: 0,
  position: new CANNON.Vec3(-.55, .77, 1.6),
  shape: notebookShape,
});
notebookBody.quaternion.y = .1;
// deskBody.material = defaultMaterial;
world.addBody(notebookBody);

// const positionFolder = gui.addFolder('position');
// positionFolder.add(notebookBody.position, 'x');
// positionFolder.add(notebookBody.position, 'y');
// positionFolder.add(notebookBody.position, 'z');

// const rotationFolder = gui.addFolder('rotation');
// rotationFolder.add(notebookBody.quaternion, 'x');
// rotationFolder.add(notebookBody.quaternion, 'y');
// rotationFolder.add(notebookBody.quaternion, 'z');

// const scaleFolder = gui.addFolder('scale');
// scaleFolder.add(notebookShape.halfExtents, 'x');
// scaleFolder.add(notebookShape.halfExtents, 'y');
// scaleFolder.add(notebookShape.halfExtents, 'z');

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
  cannonDebugRenderer.update();

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);

  // camera.rotation.y = -(mouse.position.x - .5) / 40;
  // camera.position.x = 1.5 + (mouse.position.x - .5) / 20;

  let mouseShouldBePointer = false;

  // Keys
  keys.forEach(key => {
    const keyYPosition = keyData[key.name];
    const keyObjectsMouseIsOver = keysMouseOver.map(keyMouseIsOver => keyMouseIsOver.object);
    const y = keyObjectsMouseIsOver.includes(key) ? keyYPosition - .015 : keyYPosition;
    key.position.y = lerp(key.position.y, y, .15);
  });

  // Images
  images.forEach(image => {
    const imageObejctsMouseIsOver = imagesMouseOver.map(imageMouseOver => imageMouseOver.object);
    const found = imageObejctsMouseIsOver.includes(image);
    const scale = found ? 1.2 : 1;
    const rotation = found ? Math.sin(elapsedTime * 2) * .3 : imageData[image.name].rotation + Math.sin(elapsedTime * .5 + imageData[image.name].offset) * .15;

    image.scale.x = lerp(image.scale.x, scale, .1);
    image.scale.y = lerp(image.scale.y, scale, .1);
    image.rotation.z = lerp(image.rotation.z, rotation, .2);

    if (found)
      mouseShouldBePointer = true
  });

  // Change pointer styling
  if (mouseShouldBePointer)
    document.body.style.cursor = 'pointer';
  else if (document.body.style.cursor === 'pointer')
    document.body.style.cursor = 'auto';
};

tick();
