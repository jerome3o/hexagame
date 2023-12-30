import * as THREE from "three";

let cameraLocation = new THREE.Vector2(0, 0);
let cameraHeight = 5;
let cameraRadius = 5;
let cameraAngle = 0;

interface MousePosition {
  x: number;
  y: number;
}

function updateCameraPosition(
  oldPosition: MousePosition,
  newPosition: MousePosition
) {
  // calculate delta
  const deltaX = newPosition.x - oldPosition.x;
  const deltaY = newPosition.y - oldPosition.y;

  const delta = new THREE.Vector2(deltaX, deltaY);
  delta.rotateAround(new THREE.Vector2(0, 0), -cameraAngle + Math.PI / 2.0);

  // update camera position
  cameraLocation.x += delta.x / 100.0;
  cameraLocation.y -= delta.y / 100.0;
}

function updateCameraRotation(
  oldPosition: MousePosition,
  newPosition: MousePosition
) {
  // // calculate delta
  const deltaX = newPosition.x - oldPosition.x;

  // update camera rotation
  cameraAngle -= deltaX / 500.0;
}

function updateCameraZoom(scrollDelta: number) {
  // update camera zoom
  cameraHeight = cameraHeight + (cameraHeight * scrollDelta) / 1000.0;
  cameraRadius = cameraRadius + (cameraRadius * scrollDelta) / 1000.0;
}

function updateCameraInner(
  cameralocation: THREE.Vector2,
  cameraHeight: number,
  cameraRadius: number,
  cameraAngle: number,
  camera: THREE.PerspectiveCamera
) {
  // calculate camera position
  camera.position.x = cameralocation.x + cameraRadius * Math.cos(cameraAngle);
  camera.position.y = cameralocation.y + cameraRadius * Math.sin(cameraAngle);
  camera.position.z = cameraHeight;

  camera.lookAt(cameralocation.x, cameralocation.y, 0);
  // ensure top of camera is always pointing up
  camera.up.set(0, 0, 1);
}

function rotateCamera(angle: number) {
  cameraAngle += angle;
}

export {
  updateCameraInner,
  updateCameraPosition,
  updateCameraRotation,
  updateCameraZoom,
  rotateCamera,
  cameraLocation,
  cameraHeight,
  cameraRadius,
  cameraAngle,
};
