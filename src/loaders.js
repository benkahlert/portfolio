import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { TextureLoader } from 'three';

// Texture loader
export const textureLoader = new TextureLoader();

// Draco loader
export const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('draco/');

// GLTF loader
export const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);