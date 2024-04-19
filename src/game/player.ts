export type Type = {
  name: string
  health: number
  mana: number
  attack: number
  defense: number
  x_velocity: number
  y_velocity: number
  z_velocity: number
  level: number
  experience: number
  gold: number
  inventory: string[]
  equipment: string[]
}

export function create(): Type {
  return {
    name: "Player",
    health: 100,
    mana: 100,
    attack: 10,
    defense: 10,
    x_velocity: 0,
    y_velocity: 0,
    z_velocity: 0,
    level: 1,
    experience: 0,
    gold: 0,
    inventory: [],
    equipment: []
  }
}

export function move(player: Type, direction: string): Type {
  return player
}