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
  configurePencilObject,
  configureRubicksCubeObject,
  configureNameplateObject,
} from './object-helpers';
import names from './identifiers';
import { addLights } from './lighting';
import { Images, imageData, addImage, githubUrl, linkedinUrl, resumeUrl } from './images';
import { lerp } from './helpers';
import { createWorld, createCannonDebugRenderer, createMugBody, createPencilBody, createKinematicBodies, createRubicksCubeBody } from './physics';


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
controls.movementSpeed = 0.005;
controls.rollSpeed = 0.001;
controls.dragToLook = true;

// controls.movementSpeed = 0;
// controls.rollSpeed = 0;

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

let pencil = new THREE.Group(); // Pencil physics object
let rubicksCube = new THREE.Group(); // Rubicks cube physics object
let nameplate = new THREE.Group(); // Nameplate physics object
let mug = undefined; // Mug physics object

let physicsObjects = []; // Array for physics object meshs
let physicsObjectsMouseOver = []; // Array for physics objects intersect results
let physicsMeshToBodyMap = {}; // Map that holds each physics mesh's corresponding body
let currentSelectedPhysicsObject = undefined;

/*
 * Event listeners
 */

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
  physicsObjectsMouseOver = raycaster.intersectObjects(physicsObjects, true);

  if (currentSelectedPhysicsObject) {
    let objectName = currentSelectedPhysicsObject.object.name;
    objectName = objectName.includes(names.pencil) ? names.pencil : objectName;
    objectName = objectName.includes(names.rubicksCube) ? names.rubicksCube : objectName;

    const horizontalMultiplier = 3000;
    const verticalMultiplier = 1500;
    const maxForce = 1.2;

    const horizontalForce = diff.x * horizontalMultiplier;
    const verticalForce = diff.y * verticalMultiplier;
    const horizontalMagnitude = Math.min(Math.abs(diff.x * horizontalMultiplier), maxForce);
    const verticalMagnitude = Math.min(Math.abs(diff.y * verticalMultiplier), maxForce / 1.5);

    const physicsBody = physicsMeshToBodyMap[objectName];

    physicsBody.applyForce(new CANNON.Vec3(horizontalMagnitude * Math.sign(horizontalForce), (verticalMagnitude + (horizontalMagnitude * .25)) * Math.sign(verticalForce), 0), physicsBody.position);
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

  if (physicsObjectsMouseOver.length > 0) {
    currentSelectedPhysicsObject = physicsObjectsMouseOver[0];
  }
});

document.addEventListener('mouseup', () => {
  currentSelectedPhysicsObject = undefined;
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
  gltfLoader.load('./physics_objects_no_materials.glb', gltf => {
    const pencilChildren = [];
    const cubeChildren = [];
    const nameplateChildren = [];

    gltf.scene.traverse(child => {
      if (child.name === names.mug) {
        configureMugObject(child);
        mug = child;
      } else if (child.name.includes(names.pencil)) {
        configurePencilObject(child);
        pencilChildren.push(child);
      } else if (child.name.includes(names.rubicksCube)) {
        configureRubicksCubeObject(child);
        cubeChildren.push(child);
      } else if (child.name.includes(names.nameplate)) {
        configureNameplateObject(child);
        nameplateChildren.push(child);
      }
    });

    physicsMeshToBodyMap[names.mug] = mugBody;
    physicsMeshToBodyMap[names.pencil] = pencilBody;
    physicsMeshToBodyMap[names.rubicksCube] = rubicksCubeBody;
    // physicsMeshToBodyMap[names.nameplate] = nameplateBody;
  
    scene.add(mug);
    physicsObjects.push(mug);
    addGroupToScene(pencilChildren, pencil, names.pencil);
    addGroupToScene(cubeChildren, rubicksCube, names.rubicksCube);
    addGroupToScene(nameplateChildren, nameplate, names.nameplate);
  });
}

const addGroupToScene = (children, group, name) => {
  children.forEach(child => {
    group.attach(child);
  });
  scene.add(group);
  physicsObjects.push(group);
  group.name = name;
}

/*
 * Adding things into the scene
 */
addLights();
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
const world = createWorld(scene);
const cannonDebugRenderer = createCannonDebugRenderer(scene, world);

/*
 * Physics
 */
createKinematicBodies(world);
const mugBody = createMugBody(world);
const pencilBody = createPencilBody(world);
const rubicksCubeBody = createRubicksCubeBody(world);

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

  if (pencil && pencilBody) {
    pencil.position.copy(pencilBody.position);
    pencil.quaternion.copy(pencilBody.quaternion);
  }

  if (rubicksCube && rubicksCubeBody) {
    rubicksCube.position.copy(rubicksCubeBody.position);
    rubicksCube.quaternion.copy(rubicksCubeBody.quaternion);
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
