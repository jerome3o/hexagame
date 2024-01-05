import { TileGrid } from "./tile";

class Entity {
  mesh: THREE.Mesh;

  constructor(mesh: THREE.Mesh) {
    this.mesh = mesh;
  }

  onHover() {
    console.log("hovered");
  }

  onClick() {
    console.log("clicked");
  }
}

class Game {
  tileGrid: TileGrid;
  entities: Entity[];

  constructor(tileGrid: TileGrid, entities: Entity[]) {
    this.tileGrid = tileGrid;
    this.entities = entities;
  }
}
