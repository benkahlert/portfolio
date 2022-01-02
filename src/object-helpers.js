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
  if (obj.name === names.rubicksCubeRed) {
    obj.material = rubicksCubeRedMaterial;
  } else if (obj.name === names.rubicksCubeBlue) {
    obj.material = rubicksCubeBlueMaterial;
  } else if (obj.name === names.rubicksCubeWhite) {
    obj.material = rubicksCubeWhiteMaterial;
  } else if (obj.name === names.rubicksCubeGreen) {
    obj.material = rubicksCubeGreenMaterial;
  } else if (obj.name === names.rubicksCubeOrange) {
    obj.material = rubicksCubeOrangeMaterial;
  } else if (obj.name === names.rubicksCubeYellow) {
    obj.material = rubicksCubeYellowMaterial;
  } else {
    obj.material = rubicksCubeBlackMaterial;
  }
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