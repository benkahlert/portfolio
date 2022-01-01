import CannonDebugger from 'cannon-es-debugger';
import CANNON from 'cannon';

/*
 * Physics
 */
export const createWorld = () => {
  const world = new CANNON.World();
  world.gravity.set(0, -9.82, 0);
  return world;
}

export const createCannonDebugRenderer = (scene, world) => {
  return new CannonDebugger(scene, world);
}

export const createMugBody = (world) => {
  const mugShape = new CANNON.Cylinder(.16, .16, .3, 20);
  const handleShape = new CANNON.Box(new CANNON.Vec3(.1, .025, .12));
  const mugBody = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(2.8, 1.879, 1.7645),
    shape: mugShape,
  });
  mugBody.addShape(handleShape, new CANNON.Vec3(-.175, 0, 0));
  mugBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
  world.addBody(mugBody);

  return mugBody;
}

export const createPencilBody = (world) => {
  const pencilShape = new CANNON.Cylinder(.025, .025, .54, 8);
  const pencilBody = new CANNON.Body({
    mass: .75,
    position: new CANNON.Vec3(.12, .76, 1.9),
    shape: pencilShape,
  });
  pencilBody.quaternion.y = -.165;
  world.addBody(pencilBody);

  return pencilBody;
}

export const createKinematicBodies = (world) => {
  createDeskBody(world);
  createMatBody(world);
  createKeyboardBody(world);
  createTrackpadBody(world);
  createNotebookBody(world);
  createMonitorBodies(world);
}

const createDeskBody = (world) => {
  const deskShape = new CANNON.Box(new CANNON.Vec3(2.45, 0.02, 0.95));
  const deskBody = new CANNON.Body({
    mass: 0,
    position: new CANNON.Vec3(1.25, .71, 1.6),
    shape: deskShape,
  });
  world.addBody(deskBody);
}

const createMatBody = (world) => {
  const matShape = new CANNON.Box(new CANNON.Vec3(.99, 0.01, 0.57));
  const matBody = new CANNON.Body({
    mass: 0,
    position: new CANNON.Vec3(1.31, .75, 1.8),
    shape: matShape,
  });
  world.addBody(matBody);
}

const createKeyboardBody = (world) => {
  const keyboardShape = new CANNON.Box(new CANNON.Vec3(.45, 0.04, 0.17));
  const keyboardBody = new CANNON.Body({
    mass: 0,
    position: new CANNON.Vec3(.98, .8, 2.075),
    shape: keyboardShape,
  });
  keyboardBody.quaternion.y = .025;
  world.addBody(keyboardBody);
}

const createTrackpadBody = (world) => {
  const trackpadShape = new CANNON.Box(new CANNON.Vec3(.27, 0.023, 0.27));
  const trackpadBody = new CANNON.Body({
    mass: 0,
    position: new CANNON.Vec3(1.9, .785, 2.05),
    shape: trackpadShape,
  });
  trackpadBody.quaternion.y = -.05;
  world.addBody(trackpadBody);
}

const createNotebookBody = (world) => {
  const notebookShape = new CANNON.Box(new CANNON.Vec3(.33, 0.025, 0.47));
  const notebookBody = new CANNON.Body({
    mass: 0,
    position: new CANNON.Vec3(-.55, .77, 1.6),
    shape: notebookShape,
  });
  notebookBody.quaternion.y = .1;
  world.addBody(notebookBody);
}

const createMonitorBodies = (world) => {
  // Monitor base
  const monitorBaseShape = new CANNON.Cylinder(.3, .3, .05, 20);
  const monitorBaseBody = new CANNON.Body({
    mass: 0,
    position: new CANNON.Vec3(1.35, .74, 1),
    shape: monitorBaseShape,
  });
  monitorBaseBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
  world.addBody(monitorBaseBody);

  // Monitor stand
  const monitorStandShape = new CANNON.Cylinder(.07, .07, .25, 20);
  const monitorStandBody = new CANNON.Body({
    mass: 0,
    position: new CANNON.Vec3(1.35, .92, 1.02),
    shape: monitorStandShape,
  });
  monitorStandBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
  world.addBody(monitorStandBody);

  // Monitor
  const monitorShape = new CANNON.Box(new CANNON.Vec3(.85, 0.06, 0.53));
  const monitorBody = new CANNON.Body({
    mass: 0,
    position: new CANNON.Vec3(1.35, 1.55, 1.19),
    shape: monitorShape,
  });
  monitorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
  world.addBody(monitorBody);
}