import { MeshBasicMaterial, MeshStandardMaterial } from "three";
import { bakedDeskTexture, bakedPropsTexture, bakedMonitorTexture, monitorWallpaperTexture } from "./textures";

// Baked materials
export const bakedDeskMaterial = new MeshBasicMaterial({ map: bakedDeskTexture });
export const bakedPropsMaterial = new MeshBasicMaterial({ map: bakedPropsTexture });
export const bakedMonitorMaterial = new MeshBasicMaterial({ map: bakedMonitorTexture });
export const monitorWallpaperMaterial = new MeshStandardMaterial({ color: 0xFFFFEE, map: monitorWallpaperTexture, emissive: 0x222222 });

// Dynamic object materials
export const potMaterial = new MeshStandardMaterial({ color: 0x8F452E });
export const plantMaterial = new MeshStandardMaterial({ color: 0x5CC15F });
export const mugMaterial = new MeshStandardMaterial({ color: 0xB6B1AC });

export const pencilMiddleMaterial = new MeshStandardMaterial({ color: 0xE79C23 });
export const pencilWoodMaterial = new MeshStandardMaterial({ color: 0xC6B29A });
export const pencilLeadMaterial = new MeshStandardMaterial({ color: 0x303030 });
export const pencilHolderMaterial = new MeshStandardMaterial({ color: 0xE7C239 });
export const pencilEraserMaterial = new MeshStandardMaterial({ color: 0xE74861 });