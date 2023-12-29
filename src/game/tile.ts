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

class TileGrid {
  // map of TileCoordinate to TileSlot
  private tiles: Map<TileCoordinate, Tile> = new Map();

  constructor() {}

  // add a tile to the grid
  addTile(tile: Tile, coordinate: TileCoordinate) {
    this.tiles.set(coordinate, tile);
  }

  // get all tiles
  getTiles() {
    return this.tiles;
  }
}

const EXAMPLE_GRID = new TileGrid();

EXAMPLE_GRID.addTile(new Tile(TileType.FOREST), { q: 0, r: 0 });
EXAMPLE_GRID.addTile(new Tile(TileType.MOUNTAIN), { q: 1, r: 0 });
EXAMPLE_GRID.addTile(new Tile(TileType.WATER), { q: 2, r: 0 });
EXAMPLE_GRID.addTile(new Tile(TileType.PLAIN), { q: 0, r: 1 });
EXAMPLE_GRID.addTile(new Tile(TileType.DESERT), { q: 1, r: 1 });

export { Tile, TileType, TileGrid, EXAMPLE_GRID, TILE_COLOURS };
