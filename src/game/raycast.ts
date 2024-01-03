import * as THREE from "three";
import { MousePosition } from "./commonModels";

export function getMouseVector2(position: MousePosition, window: Window) {
  let mousePointer = new THREE.Vector2();

  mousePointer.x = (position.x / window.innerWidth) * 2 - 1;
  mousePointer.y = -(position.y / window.innerHeight) * 2 + 1;

  return mousePointer;
}

export function checkRayIntersections(
  mousePointer: THREE.Vector2,
  camera: THREE.PerspectiveCamera,
  raycaster: THREE.Raycaster,
  scene: THREE.Scene
): THREE.Intersection[] {
  raycaster.setFromCamera(mousePointer, camera);
  let intersections = raycaster.intersectObjects(scene.children, true);
  return intersections;
}
