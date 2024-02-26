import * as THREE from "three"

// enum of tile types
enum TileType {
  FOREST,
  MOUNTAIN,
  WATER,
  PLAIN,
  DESERT,
  NONE,
}

// tile colours
const TILE_COLOURS = {
  [TileType.FOREST]: 0x00ff00,
  [TileType.MOUNTAIN]: 0x888888,
  [TileType.WATER]: 0x0000ff,
  [TileType.PLAIN]: 0x00ffff,
  [TileType.DESERT]: 0xffff00,
  [TileType.NONE]: 0xffffff,
}

interface TileCoordinate {
  q: number
  r: number
  // s: number;
}

class Tile {
  public type: TileType

  constructor(type: TileType) {
    this.type = type
  }
}

class RenderedTile {
  public tile: Tile
  public mesh: THREE.Mesh

  constructor(tile: Tile, mesh: THREE.Mesh) {
    this.tile = tile
    this.mesh = mesh
  }

  hover() {
    this.mesh.material.color.set(0xff0000)
  }

  unhover() {
    this.mesh.material.color.set(TILE_COLOURS[this.tile.type])
  }
}

class TileGrid {
  // tiles by q,r coordinate
  private readonly tiles: Tile[][]
  private readonly renderedTiles: Map<TileCoordinate, RenderedTile> = new Map();
  private readonly coordinateByMeshId: Map<string, TileCoordinate> = new Map();
  size: number

  // set
  private hoveredTiles: Set<TileCoordinate> = new Set();

  constructor(size = 10) {
    this.size = size
    this.tiles = [...Array(size)].map(() => {
      return Array(size).fill(null)
    })
    for (let q = 0; q < size; q++) {
      for (let r = 0; r < size; r++) {
        const tile = new Tile(TileType.NONE)
        this.tiles[q][r] = tile
      }
    }
  }

  addRenderedTile(renderedTile: RenderedTile, coordinate: TileCoordinate) {
    this.renderedTiles.set(coordinate, renderedTile)
    this.coordinateByMeshId.set(renderedTile.mesh.uuid, coordinate)
  }

  getTile(coordinate: TileCoordinate) {
    return this.tiles[coordinate.q][coordinate.r]
  }

  getAdjacent({ q, r }: TileCoordinate) {
    const adjacent = []
    const directions = [
      [1, 0],
      [1, -1],
      [0, -1],
      [-1, 0],
      [-1, 1],
      [0, 1],
    ]
    for (const [dq, dr] of directions) {
      const neighbour = { q: q + dq, r: r + dr }
      if (neighbour.q < 0 || neighbour.r < 0 || neighbour.q >= this.size || neighbour.r >= this.size) {
        continue
      }
      adjacent.push(this.getTile(neighbour))
    }
    return adjacent
  }

  getRenderedTileByCoordinate(coordinate: TileCoordinate) {
    const renderedTile = this.renderedTiles.get(coordinate)
    if (!renderedTile) {
      throw new Error(`No renderedTile found at coordinate (${coordinate.q}, ${coordinate.r}) `)
    }
    return renderedTile
  }

  unhoverAll() {
    this.hoveredTiles.forEach((coordinate) => {
      this.renderedTiles.get(coordinate)!.unhover()
    })
    this.hoveredTiles.clear()
  }

  getCoordinateByMeshId(uuid: string) {
    const coordinate = this.coordinateByMeshId.get(uuid)
    if (!coordinate) {
      throw new Error(`No coordinate found for mesh with uuid ${uuid}`)
    }
    return coordinate
  }

  getRenderedTileByMeshId(uuid: string) {
    const coordinate = this.getCoordinateByMeshId(uuid)
    return this.getRenderedTileByCoordinate(coordinate)
  }

  hoverOver(uuid: string) {
    const coordinate = this.getCoordinateByMeshId(uuid)
    const renderedTile = this.getRenderedTileByCoordinate(coordinate)
    renderedTile.hover()
    this.hoveredTiles.add(coordinate)
  }

  onClick() {

    for (const coordinate of this.hoveredTiles) {
      const adjacent = this.getAdjacent(coordinate)

      if (adjacent.every((tile) => tile.type === TileType.NONE)) {
        continue
      }

      const tile = this.getTile(coordinate)

      switch (tile.type) {
        case TileType.FOREST:
          tile.type = TileType.MOUNTAIN
          break
        case TileType.MOUNTAIN:
          tile.type = TileType.WATER
          break
        case TileType.WATER:
          tile.type = TileType.PLAIN
          break
        case TileType.PLAIN:
          tile.type = TileType.DESERT
          break
        case TileType.DESERT:
          tile.type = TileType.FOREST
          break
        default:
          tile.type = TileType.FOREST
      }
    }
  }
}

const EXAMPLE_GRID = new TileGrid(10)

EXAMPLE_GRID.getTile({ q: 0, r: 0 }).type = TileType.FOREST
EXAMPLE_GRID.getTile({ q: 1, r: 0 }).type = TileType.MOUNTAIN
EXAMPLE_GRID.getTile({ q: 2, r: 0 }).type = TileType.WATER
EXAMPLE_GRID.getTile({ q: 0, r: 1 }).type = TileType.PLAIN
EXAMPLE_GRID.getTile({ q: 1, r: 1 }).type = TileType.DESERT
EXAMPLE_GRID.getTile({ q: 1, r: 4 }).type = TileType.PLAIN
EXAMPLE_GRID.getTile({ q: 1, r: 3 }).type = TileType.WATER

export { RenderedTile, Tile, TileType, TileGrid, EXAMPLE_GRID, TILE_COLOURS }
