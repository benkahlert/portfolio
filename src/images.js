import { PlaneGeometry, Mesh, MeshLambertMaterial, Vector3 } from "three";
import { textureLoader } from "./loaders";
import { getRandomImageRotationOffset, getRandomImageTimeOffset } from "./helpers";

// Functions as an enum
export const Images = {
  Github: 'github',
  LinkedIn: 'linkedin',
  Resume: 'resume',
}

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
}

export const githubUrl = 'https://github.com/benkahlert';
export const linkedinUrl = 'https://www.linkedin.com/in/benjamin-kahlert-0b4709126/';
export const resumeUrl = 'https://drive.google.com/file/d/1_IaPj3Qc3xBGi2IRy6fqbKvTXUC3qQWS/view?usp=sharing';

export const imageData = {
  [Images.Github]: {
    position: new Vector3(.95, 1.75, 1.25),
    scale: .3,
    path: './images/github.png',
    rotation: getRandomImageRotationOffset(),
    offset: getRandomImageTimeOffset(),
  },
  [Images.LinkedIn]: {
    position: new Vector3(1.75, 1.75, 1.25),
    scale: .3,
    path: './images/linkedin.png',
    rotation: getRandomImageRotationOffset(),
    offset: getRandomImageTimeOffset(),
  },
  [Images.Resume]: {
    position: new Vector3(1.325, 1.35, 1.25),
    scale: .4,
    path: './images/resume.png',
    rotation: getRandomImageRotationOffset(),
    offset: getRandomImageTimeOffset(),
  },
}

export const addImage = (image, dataUri) => {
  const data = imageData[image];

  const material = new MeshLambertMaterial({
    map: dataUri ? textureLoader.load(dataUri) : textureLoader.load(data.path),
    alphaTest: .05,
  });
  const geometry = new PlaneGeometry(data.scale, data.scale);
  const mesh = new Mesh(geometry, material);

  mesh.name = image;
  mesh.position.copy(data.position);
  
  return mesh;
}