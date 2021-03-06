import {
  bakedDeskMaterial,
  bakedPropsMaterial,
  bakedMonitorMaterial,
  monitorWallpaperMaterial,
  plantMaterial,
  potMaterial,
  mugMaterial,
  pencilMiddleMaterial,
  pencilLeadMaterial,
  pencilWoodMaterial,
  pencilHolderMaterial,
  pencilEraserMaterial,
  rubicksCubeRedMaterial,
  rubicksCubeBlueMaterial,
  rubicksCubeWhiteMaterial,
  rubicksCubeGreenMaterial,
  rubicksCubeOrangeMaterial,
  rubicksCubeYellowMaterial,
  rubicksCubeBlackMaterial,
  nameplateNameMaterial,
  nameplateBackgroundMaterial,
  nameplateBaseMaterial,
  bakedPhysicsObjectsMaterial,
} from './materials';
import names from './identifiers';

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
  obj.material = bakedPhysicsObjectsMaterial;
}

export const configurePencilObject = (obj) => {
  if (obj.name === names.pencilMiddle) {
    obj.material = pencilMiddleMaterial;
  } else if (obj.name === names.pencilLead) {
    obj.material = pencilLeadMaterial;
  } else if (obj.name === names.pencilWood) {
    obj.material = pencilWoodMaterial;
  } else if (obj.name === names.pencilHolder) {
    obj.material = pencilHolderMaterial;
  } else if (obj.name === names.pencilEraser) {
    obj.material = pencilEraserMaterial;
  }
}

export const configureNameplateObject = (obj) => {
  if (obj.name === names.nameplateName) {
    obj.material = nameplateNameMaterial;
  } else {
    obj.material = bakedPhysicsObjectsMaterial;
  }
}