import { bakedDeskMaterial, bakedPropsMaterial, bakedMonitorMaterial, monitorWallpaperMaterial } from './materials';

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