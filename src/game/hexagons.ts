import * as THREE from "three";

interface Point {
  x: number;
  y: number;
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

function drawHexagon(x: number, y: number, radius: number): THREE.Line {
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

function drawHexagonGrid(
  nx: number = 1,
  ny: number = 1,
  hexRadius: number = 1,
  center: Point = { x: 0, y: 0 }
): THREE.Group {
  const hexApothem = getApothem(hexRadius);
  const hexSide = getSide(hexApothem);

  console.log({ hexApothem, hexRadius });

  // tessellate 100 hexagons
  const hexagon = new THREE.Group();
  for (let i = 0.0; i < nx; i++) {
    for (let j = 0.0; j < ny; j++) {
      // calculate position
      let x = hexApothem * 2 * i + center.x;
      let y = (hexRadius + hexSide / 2.0) * j + center.y;
      if (j % 2 === 1) {
        x += hexApothem;
      }

      // draw hexagon
      const hex = drawHexagon(x, y, hexRadius * 0.9);

      // add hexagon to group
      hexagon.add(hex);
    }
  }
  return hexagon;
}

export { getApothem, getRadius, getSide, drawHexagon, drawHexagonGrid };
