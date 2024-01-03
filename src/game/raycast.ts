import * as THREE from "three";

export function getMouseVector2(event: MouseEvent, window: Window) {
  let mousePointer = new THREE.Vector2();

  mousePointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  mousePointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  return mousePointer;
}

export function checkRayIntersections(
  mousePointer: THREE.Vector2,
  camera: THREE.PerspectiveCamera,
  raycaster: THREE.Raycaster,
  scene: THREE.Scene
) {
  raycaster.setFromCamera(mousePointer, camera);
  let intersections = raycaster.intersectObjects(scene.children, true);
}
