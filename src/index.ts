import * as THREE from "three";
import * as CANNON from "cannon-es";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { drawTileGrid } from "./game/hexagons";
import { setUpMouse } from "./game/mouse";
import {
  updateCameraInner,
  updateCameraPosition,
  updateCameraRotation,
  updateCameraZoom,
  rotateCamera,
  cameraAngle,
  cameraHeight,
  cameraRadius,
  cameraLocation,
} from "./game/camera";
import { EXAMPLE_GRID } from "./game/tile";
import { setUpKeys } from "./game/keys";

let frame = 0;

// three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// cannon.js setup
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, 0, -0.1),
});
const radius = 1;
const sphereBody = new CANNON.Body({
  mass: 5,
  position: new CANNON.Vec3(0, 0, 3),
  shape: new CANNON.Sphere(radius),
});
world.addBody(sphereBody);

const groundBody = new CANNON.Body({
  type: CANNON.Body.STATIC,
  shape: new CANNON.Plane(),
});
// make it face up
groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), 0);
// world.addBody(groundBody);

// listen for window resize
window.addEventListener("resize", () => {
  // update camera
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  // update renderer
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
});

function getDebugInfoString(camera: THREE.PerspectiveCamera) {
  // return {
  //   fov: camera.fov,
  //   aspect: camera.aspect,
  //   near: camera.near,
  //   far: camera.far,
  //   position: camera.position,
  //   rotation: camera.rotation,
  // };
  return `fov: ${camera.fov}
aspect: ${camera.aspect}
near: ${camera.near}
far: ${camera.far}
position: ${camera.position.x}, ${camera.position.y}, ${camera.position.z}
rotation: ${camera.rotation.x}, ${camera.rotation.y}, ${camera.rotation.z}
gameRotation: ${cameraAngle}`;
}

function updateDebugText(camera: THREE.PerspectiveCamera) {
  const debugText = document.getElementById("info");
  if (debugText) {
    debugText.innerText = getDebugInfoString(camera);
  }
}

function updateCamera() {
  updateCameraInner(
    cameraLocation,
    cameraHeight,
    cameraRadius,
    cameraAngle,
    camera
  );
  updateDebugText(camera);
}

// controls

const rotationSpeed = 0.05;

updateCamera();
setUpMouse([updateCameraPosition], [updateCameraRotation], [updateCameraZoom]);
const controlsOnGameTick = setUpKeys([
  {
    key: "ArrowLeft",
    handler: () => {
      rotateCamera(-rotationSpeed);
    },
  },
  {
    key: "ArrowRight",
    handler: () => {
      rotateCamera(rotationSpeed);
    },
  },
]);

const light = new THREE.AmbientLight(0x404040); // soft white light
const pointLight = new THREE.PointLight(0xffffff, 50, 500);
pointLight.position.set(0, 0, 10);

const loader = new GLTFLoader();
loader.load(
  "/avocado/Avocado.gltf",
  (gltf: any) => {
    // scale up by 100
    gltf.scene.scale.set(10, 10, 10);
    gltf.scene.position.set(0, 0, 1);
    scene.add(gltf.scene);
  },
  // called while loading is progressing
  function (xhr: any) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  (error: any) => {
    console.log(error);
  }
);

// const hexagonGrid = drawHexagonGrid(15, 15, 1);
const hexagonGrid = drawTileGrid(EXAMPLE_GRID, 1);

// add sphere
const geometry = new THREE.SphereGeometry(radius, 32, 32);
const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sphere = new THREE.Mesh(geometry, material);

// add plane
const planeGeometry = new THREE.PlaneGeometry(3, 3, 3);
// beige
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xf5f5dc });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);

// Update plane from ground body
plane.position.copy(groundBody.position);
plane.quaternion.copy(groundBody.quaternion);

scene.add(sphere);
scene.add(plane);

scene.add(hexagonGrid);
scene.add(light);
scene.add(pointLight);

scene.background = new THREE.Color(0xffffff);

function animate() {
  requestAnimationFrame(animate);

  controlsOnGameTick();
  world.fixedStep();

  // the sphere y position shows the sphere falling
  sphere.position.copy(sphereBody.position);
  sphere.quaternion.copy(sphereBody.quaternion);
  // the sphere y position shows the sphere falling
  console.log(`Sphere y position: ${sphereBody.position.z}`);

  // update sphere position
  sphere.position.x = sphereBody.position.x;

  updateDebugText(camera);
  updateCamera();

  renderer.render(scene, camera);
  frame++;
}
animate();
