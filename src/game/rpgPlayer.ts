export type Type = {
  name: string
  health: number
  mana: number
  attack: number
  defense: number
  velocity: Float32Array
  position: Float32Array
  level: number
  experience: number
  gold: number
  inventory: string[]
  equipment: string[]
  accelerate: (vector: Float32Array, deltaTime: number) => void
  update: (deltaTime: number) => void
}

export function create(): Type {
  return {
    name: "rpgPlayer",
    health: 100,
    mana: 100,
    attack: 10,
    defense: 10,
    velocity: new Float32Array([0, 0, 0]),
    position: new Float32Array([0, 0, 0]),
    level: 1,
    experience: 0,
    gold: 0,
    inventory: [],
    equipment: [],
    accelerate(vector: Float32Array, deltaTime: number) {
      accelerate(this, vector, deltaTime)
    },
    update(deltaTime: number) {
      updatePosition(this, deltaTime)
    },
  }
}

function accelerate(player: Type, vector: Float32Array, deltaTime: number): void {
  player.velocity = player.velocity.map((v, i) => v + vector[i])
}

function updatePosition(player: Type, deltaTime: number): void {
  // player.velocity = player.velocity.map((v) => v * 0.9 * deltaTime)
  player.position = player.position.map((p, i) => p + player.velocity[i] * deltaTime)
}