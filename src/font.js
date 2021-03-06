import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';

export let helpText;

export const addText = (scene) => {
  const loader = new THREE.FontLoader();
  loader.load('./fonts/helvetiker_regular.typeface.json', (font) => {
    const color = new THREE.Color( 0x000000 );
    const matDark = new THREE.MeshBasicMaterial( {
      color: color,
      side: THREE.DoubleSide
    });
    const matLite = new THREE.MeshBasicMaterial( {
      color: color,
      transparent: false,
      opacity: 0.1,
      side: THREE.DoubleSide
    });

    createText(scene, font, color, 'Benjamin Kahlert', matLite, matDark);
    helpText = createText(scene, font, color, 'Try dragging\nobjects around!', matLite, matDark, new THREE.Vector3(0, 0, 0), new THREE.Vector3(3.5, 1.25, 0));
  });
}

const createText = (scene, font, color, message, mat1, mat2, scale = new THREE.Vector3(.003, .003, .003), position = new THREE.Vector3(1.35, 2.5, 0)) => {
  const shapes = font.generateShapes(message, 100);
  const geometry = new THREE.ShapeGeometry(shapes);
  geometry.computeBoundingBox();

  const xMid = - 0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
  geometry.translate(xMid, 0, 0);

  const text = new THREE.Mesh(geometry, mat1);
  text.position.z = - 150;
  scene.add(text);

  const holeShapes = [];
  for (let i = 0; i < shapes.length; i ++) {
    const shape = shapes[i];

    if ( shape.holes && shape.holes.length > 0 ) {
      for ( let j = 0; j < shape.holes.length; j ++ ) {
        const hole = shape.holes[j];
        holeShapes.push(hole);
      }
    }
  }

  shapes.push.apply(shapes, holeShapes);

  const style = SVGLoader.getStrokeStyle(2.5, color.getStyle());
  const strokeText = new THREE.Group();

  for (let i = 0; i < shapes.length; i ++) {
    const shape = shapes[i];
    const points = shape.getPoints();
    const geometry = SVGLoader.pointsToStroke(points, style);
    geometry.translate(xMid, 0, 0);

    const strokeMesh = new THREE.Mesh(geometry, mat2);
    strokeText.add(strokeMesh);
  }

  strokeText.scale.copy(scale);
  strokeText.position.copy(position);
  scene.add(strokeText);
  return strokeText;
}