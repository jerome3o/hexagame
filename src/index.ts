import * as THREE from "three";

let frame = 0;

interface MousePosition {
  x: number;
  y: number;
}

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
  const geometry = new THREE.BoxGeometry(2, 1, 1);

  // with wireframe
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
  });
  const cube = new THREE.Mesh(geometry, material);
  return cube;
}

// listen for window resize
window.addEventListener("resize", () => {
  // update camera
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  // update renderer
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
});

function setUpMouse(
  functions: ((
    oldPosition: MousePosition,
    newPosition: MousePosition
  ) => void)[]
) {
  // listen for mouse drag
  let isDragging = false;
  let previousMousePosition = {
    x: 0,
    y: 0,
  };

  document.addEventListener("mousedown", (event) => {
    isDragging = true;
    previousMousePosition = {
      x: event.offsetX,
      y: event.offsetY,
    };
  });

  document.addEventListener("mouseup", (event) => {
    isDragging = false;
  });

  document.addEventListener("mousemove", (event) => {
    // only update if dragging
    if (!isDragging) {
      return;
    }

    // call functions
    functions.forEach((f) =>
      f(previousMousePosition, {
        x: event.offsetX,
        y: event.offsetY,
      })
    );

    // update previous mouse position
    previousMousePosition = {
      x: event.offsetX,
      y: event.offsetY,
    };
  });
}

function moveCube(oldPosition: MousePosition, newPosition: MousePosition) {
  // calculate delta mouse movement
  const deltaMove = {
    x: newPosition.x - oldPosition.x,
    y: newPosition.y - oldPosition.y,
  };

  // rotate cube
  cube.rotation.x += deltaMove.y * 0.01;
  cube.rotation.y += deltaMove.x * 0.01;
}

function drawHexagon(x: number, y: number, radius: number) {
  const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
  const points = [];
  const sides = 6;

  for (let i = 0; i < sides; i++) {
    const angle = (i * (Math.PI * 2)) / sides;
    points.push(
      new THREE.Vector2(
        x + radius * Math.sin(angle),
        y + radius * Math.cos(angle)
      )
    );
  }
  // add first point again to close the shape
  points.push(points[0]);

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry, material);
  return line;
}

function drawGridlines() {
  //  draw vertical and horizontal lines
  // 1 unit apart
  const material = new THREE.LineBasicMaterial({ color: 0xff00ff });
  const points = [];

  const bottomLeft = new THREE.Vector2(-1, -1);
  const bottomRight = new THREE.Vector2(1, -1);
  const topLeft = new THREE.Vector2(-1, 1);
  const topRight = new THREE.Vector2(1, 1);

  points.push(bottomLeft);
  points.push(bottomRight);
  points.push(topRight);
  points.push(topLeft);
  points.push(bottomLeft);

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry, material);
  return line;
}

function getApothem(radius: number) {
  return radius * (Math.sqrt(3) / 2.0);
}

function getRadius(apothem: number) {
  return apothem / (Math.sqrt(3) / 2.0);
}

function getSide(apothem: number) {
  return apothem / (Math.sqrt(3) / 2);
}

// initialise
camera.position.z = 5;
setUpMouse([moveCube]);

const cube = makeCube();

// const hexRadius = 1;
// const hexApothem = getApothem(hexRadius);

const hexApothem = 1;
const hexRadius = getRadius(hexApothem);
const hexSide = getSide(hexApothem);

console.log({ hexApothem, hexRadius });

// tessellate 100 hexagons
const hexagon = new THREE.Group();
for (let i = 0.0; i < 10.0; i++) {
  for (let j = 0.0; j < 10.0; j++) {
    // calculate position
    let x = hexApothem * 2 * i;
    let y = (hexRadius + hexSide / 2.0) * j;
    if (j % 2 === 1) {
      x += hexApothem;
    }

    // draw hexagon
    const hex = drawHexagon(x, y, hexRadius);

    // add hexagon to group
    hexagon.add(hex);
  }
}

const grids = drawGridlines();

scene.add(grids);

// scene.add(cube);
scene.add(hexagon);

function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
  frame++;
}
animate();
