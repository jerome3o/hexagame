import * as THREE from "three"
import { RenderedTile, TileGrid, Tile, TILE_COLOURS } from "./tile"

interface Point {
  x: number
  y: number
}

interface HexPoint {
  q: number
  r: number
}

function getApothem(radius: number) {
  return radius * (Math.sqrt(3) / 2.0)
}

function getRadius(apothem: number) {
  return apothem / (Math.sqrt(3) / 2.0)
}

function getSide(apothem: number) {
  return apothem / (Math.sqrt(3) / 2)
}

function hexPointToXy(
  point: HexPoint,
  radius: number,
  offset: Point = { x: 0, y: 0 }
) {
  const apothem = getApothem(radius)
  const side = getSide(apothem)

  // let x = hexApothem * 2 * i + center.x;
  // let y = (hexRadius + hexSide / 2.0) * j + center.y;

  const x = apothem * 2 * point.q + offset.x + apothem * point.r
  const y = (radius + side / 2.0) * point.r + offset.y
  return { x, y }
}

function drawHexagon(
  x: number,
  y: number,
  radius: number,
  color: number = 0x00ff00
) {
  const hexGeometry = new THREE.CylinderGeometry(radius, radius, 0.2, 6)
  const hexMaterial = new THREE.MeshPhongMaterial({
    color: color,
    side: THREE.DoubleSide,
  })
  const hex = new THREE.Mesh(hexGeometry, hexMaterial)
  hex.position.x = x
  hex.position.y = y
  hex.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2.0)
  return hex
}

function drawHexagonGrid(
  nx: number = 1,
  ny: number = 1,
  hexRadius: number = 1,
  center: Point = { x: 0, y: 0 }
): THREE.Group {
  const hexApothem = getApothem(hexRadius)
  const hexSide = getSide(hexApothem)

  console.log({ hexApothem, hexRadius })

  // tessellate 100 hexagons
  const hexagon = new THREE.Group()
  for (let i = 0.0; i < nx; i++) {
    for (let j = 0.0; j < ny; j++) {
      // calculate position
      let x = hexApothem * 2 * i + center.x
      let y = (hexRadius + hexSide / 2.0) * j + center.y
      if (j % 2 === 1) {
        x += hexApothem
      }

      // draw hexagon
      const hex = drawHexagon(x, y, hexRadius * 0.9)

      // add hexagon to group
      hexagon.add(hex)
    }
  }
  return hexagon
}

function drawTile(tile: Tile, coordinate: Point, radius: number = 1) {
  const hex = drawHexagon(
    coordinate.x,
    coordinate.y,
    radius,
    TILE_COLOURS[tile.type]
  )
  return hex
}

function drawTileGrid(tileGrid: TileGrid, radius: number = 1) {
  const hexagon = new THREE.Group()
  for (let q = 0; q < tileGrid.size; q++) {
    for (let r = 0; r < tileGrid.size; r++) {
      const tile = tileGrid.getTile(q, r)
      const coordinate = { q, r }
      const point = hexPointToXy(coordinate, radius)
      const hex = drawTile(tile, point, radius)
      hexagon.add(hex)
      tileGrid.addRenderedTile(new RenderedTile(tile, hex), coordinate)

    }
  }
  return hexagon
}

export {
  getApothem,
  getRadius,
  getSide,
  drawHexagon,
  drawHexagonGrid,
  drawTile,
  drawTileGrid,
}
