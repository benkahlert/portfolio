import { textureLoader } from './loaders';
import { sRGBEncoding } from 'three';

const configureBakedTexture = (texture) => {
  texture.flipY = false;
  texture.encoding = sRGBEncoding;
}

export const bakedDeskTexture = textureLoader.load('./textures/desk_scene.jpg');
configureBakedTexture(bakedDeskTexture);

export const bakedPropsTexture = textureLoader.load('./textures/static_desk_props.jpg');
configureBakedTexture(bakedPropsTexture);

export const bakedMonitorTexture = textureLoader.load('./textures/monitor.jpg');
configureBakedTexture(bakedMonitorTexture);

export const monitorWallpaperTexture = textureLoader.load('./images/wallpaper.jpg');

// Scale and offset the monitor texture since the wallpaper image is too big
monitorWallpaperTexture.repeat.set(2, 2);
monitorWallpaperTexture.offset.set(-.5, -.5);