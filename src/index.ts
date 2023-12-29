import * as THREE from "three";

let frame = 0;

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

function makeCube() {
    const geometry = new THREE.BoxGeometry( 2, 1, 1 );

    // with wireframe
    const material = new THREE.MeshBasicMaterial(
        { color: 0x00ff00, wireframe: true }
    );
    const cube = new THREE.Mesh( geometry, material );
    return cube;
}

const cube = makeCube();

scene.add( cube );

camera.position.z = 5;

// listen for window resize
window.addEventListener('resize', () => {
  // update camera
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  // update renderer
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
});

// listen for mouse drag
let isDragging = false;
let previousMousePosition = {
  x: 0,
  y: 0
};

document.addEventListener('mousedown', event => {
  isDragging = true;
  previousMousePosition = {
    x: event.offsetX,
    y: event.offsetY
  };
});

document.addEventListener('mouseup', event => {
  isDragging = false;
});

document.addEventListener('mousemove', event => {
  // only update if dragging
  if (!isDragging) {
    return;
  }

  // calculate delta mouse movement
  const deltaMove = {
    x: event.offsetX - previousMousePosition.x,
    y: event.offsetY - previousMousePosition.y
  };

  // rotate cube
  cube.rotation.x += deltaMove.y * 0.01;
  cube.rotation.y += deltaMove.x * 0.01;

  // update previous mouse position
  previousMousePosition = {
    x: event.offsetX,
    y: event.offsetY
  };
});


function animate() {
	requestAnimationFrame( animate );

	renderer.render( scene, camera );
    frame++;
}
animate();
