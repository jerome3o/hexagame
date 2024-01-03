import * as THREE from "three";

// enum of tile types
enum TileType {
  FOREST,
  MOUNTAIN,
  WATER,
  PLAIN,
  DESERT,
}

// tile colours
const TILE_COLOURS = {
  [TileType.FOREST]: 0x00ff00,
  [TileType.MOUNTAIN]: 0x888888,
  [TileType.WATER]: 0x0000ff,
  [TileType.PLAIN]: 0x00ffff,
  [TileType.DESERT]: 0xffff00,
};

interface TileCoordinate {
  q: number;
  r: number;
  // s: number;
}

class Tile {
  public type: TileType;

  constructor(type: TileType) {
    this.type = type;
  }
}

class RenderedTile {
  public tile: Tile;
  public mesh: THREE.Mesh;

  constructor(tile: Tile, mesh: THREE.Mesh) {
    this.tile = tile;
    this.mesh = mesh;
  }

  hover() {
    this.mesh.material.color.set(0xff0000);
  }

  unhover() {
    this.mesh.material.color.set(TILE_COLOURS[this.tile.type]);
  }
}

class TileGrid {
  // map of TileCoordinate to TileSlot
  private tiles: Map<TileCoordinate, Tile> = new Map();
  private renderedTiles: Map<TileCoordinate, RenderedTile> = new Map();
  private renderedTileByMeshUuid: Map<string, RenderedTile> = new Map();

  // set
  private hoveredTiles: Set<RenderedTile> = new Set();

  constructor() {}

  private updateRenderedTileByMeshUuid() {
    this.renderedTileByMeshUuid = new Map();
    this.renderedTiles.forEach((renderedTile) => {
      this.renderedTileByMeshUuid.set(renderedTile.mesh.uuid, renderedTile);
    });
  }

  getRenderedTileUuidMap() {
    return this.renderedTileByMeshUuid;
  }

  // add a tile to the grid
  addTile(tile: Tile, coordinate: TileCoordinate) {
    this.tiles.set(coordinate, tile);
  }

  addRenderedTile(renderedTile: RenderedTile, coordinate: TileCoordinate) {
    this.renderedTiles.set(coordinate, renderedTile);
    this.updateRenderedTileByMeshUuid();
  }

  // get all tiles
  getTiles() {
    return this.tiles;
  }

  getRenderedTiles() {
    return this.renderedTiles;
  }

  unhoverAll() {
    this.hoveredTiles.forEach((renderedTile) => {
      renderedTile.unhover();
    });
    this.hoveredTiles.clear();
  }

  hoverOver(uuid: string) {
    const renderedTile = this.renderedTileByMeshUuid.get(uuid);
    if (renderedTile) {
      renderedTile.hover();
      this.hoveredTiles.add(renderedTile);
    }
  }
}

const EXAMPLE_GRID = new TileGrid();

EXAMPLE_GRID.addTile(new Tile(TileType.FOREST), { q: 0, r: 0 });
EXAMPLE_GRID.addTile(new Tile(TileType.MOUNTAIN), { q: 1, r: 0 });
EXAMPLE_GRID.addTile(new Tile(TileType.WATER), { q: 2, r: 0 });
EXAMPLE_GRID.addTile(new Tile(TileType.PLAIN), { q: 0, r: 1 });
EXAMPLE_GRID.addTile(new Tile(TileType.DESERT), { q: 1, r: 1 });
EXAMPLE_GRID.addTile(new Tile(TileType.PLAIN), { q: 1, r: 4 });
EXAMPLE_GRID.addTile(new Tile(TileType.WATER), { q: 1, r: 3 });

export { RenderedTile, Tile, TileType, TileGrid, EXAMPLE_GRID, TILE_COLOURS };
