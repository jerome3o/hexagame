import * as THREE from "three";

// enum of tile types
enum TileType {
  FOREST,
  MOUNTAIN,
  WATER,
  PLAIN,
  DESERT,
}

class TileSlot {
  private tile: Tile | null = null;
  private box: THREE.Box3;

  constructor(box: THREE.Box3, tile: Tile | null = null) {
    this.box = box;
  }
}

class Tile {
  private type: TileType;

  constructor(type: TileType) {
    this.type = type;
  }
}
