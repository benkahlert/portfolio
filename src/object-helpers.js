import {
  bakedDeskMaterial,
  bakedPropsMaterial,
  bakedMonitorMaterial,
  monitorWallpaperMaterial,
  plantMaterial,
  potMaterial,
  mugMaterial
} from './materials';

export const configureDeskObject = (obj) => {
  obj.material = bakedDeskMaterial;
}

export const configureMonitorObject = (obj) => {
  obj.material = bakedMonitorMaterial;
}

export const configureMonitorFaceObject = (obj) => {
  obj.material = monitorWallpaperMaterial;
}

export const configureWallObject = (obj) => {
  obj.scale.x *= 2;
  obj.position.z = obj.position.z + 1;
}

export const configurePropsObject = (obj) => {
  obj.material = bakedPropsMaterial;
}

export const configureKeyObject = (obj, keys, keyData) => {
  keyData[obj.name] = obj.position.y;
  obj.material = bakedPropsMaterial;
  keys.push(obj);
}

export const configureMugObject = (obj) => {
  obj.material = mugMaterial;
}

export const configurePlantObject = (obj) => {
  obj.material = plantMaterial;
}

export const configurePotObject = (obj) => {
  obj.material = potMaterial;
}

export const configureRubicksCubeObject = (obj) => {
  
}

export const configurePencilObject = (obj) => {
  
}