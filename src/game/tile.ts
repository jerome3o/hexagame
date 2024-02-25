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
  private tiles: Tile[][]
  private renderedTiles: Map<TileCoordinate, RenderedTile> = new Map();
  private renderedTileByMeshUuid: Map<string, RenderedTile> = new Map();
  size: number

  // set
  private hoveredTiles: Set<RenderedTile> = new Set();

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

  private updateRenderedTileByMeshUuid() {
    this.renderedTileByMeshUuid = new Map()
    this.renderedTiles.forEach((renderedTile) => {
      this.renderedTileByMeshUuid.set(renderedTile.mesh.uuid, renderedTile)
    })
  }

  getRenderedTileUuidMap() {
    return this.renderedTileByMeshUuid
  }

  addRenderedTile(renderedTile: RenderedTile, coordinate: TileCoordinate) {
    this.renderedTiles.set(coordinate, renderedTile)
    this.updateRenderedTileByMeshUuid()
  }

  getTiles() {
    return this.tiles
  }

  getTile(q: number, r: number) {
    return this.tiles[q][r]
  }

  getRenderedTiles() {
    return this.renderedTiles
  }

  unhoverAll() {
    this.hoveredTiles.forEach((renderedTile) => {
      renderedTile.unhover()
    })
    this.hoveredTiles.clear()
  }

  hoverOver(uuid: string) {
    const renderedTile = this.renderedTileByMeshUuid.get(uuid)
    if (renderedTile) {
      renderedTile.hover()
      this.hoveredTiles.add(renderedTile)
    }
  }

  onClick() {
    this.hoveredTiles.forEach(({ tile }) => tile.type = TileType.FOREST)
    for (const row of this.tiles) {
      for (const tile of row) {
        console.log(tile.type)
      }
    }
  }
}

const EXAMPLE_GRID = new TileGrid(10)

EXAMPLE_GRID.getTile(0, 0)!.type = TileType.FOREST
EXAMPLE_GRID.getTile(1, 0)!.type = TileType.MOUNTAIN
EXAMPLE_GRID.getTile(2, 0)!.type = TileType.WATER
EXAMPLE_GRID.getTile(0, 1)!.type = TileType.PLAIN
EXAMPLE_GRID.getTile(1, 1)!.type = TileType.DESERT
EXAMPLE_GRID.getTile(1, 4)!.type = TileType.PLAIN
EXAMPLE_GRID.getTile(1, 3)!.type = TileType.WATER

export { RenderedTile, Tile, TileType, TileGrid, EXAMPLE_GRID, TILE_COLOURS }
