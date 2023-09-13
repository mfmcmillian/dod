import { Schema, Context, type } from "@colyseus/schema";

enum Weapon {
  MELEE,
  RANGED,
}

export class Position extends Schema {
  @type("number") x: number;
  @type("number") y: number;
  @type("number") z: number;
}

export class Rotation extends Position {
  @type("number") w: number;
}

export enum AnimationState {
  idle = "idle",
  running = "running",

  attack = "attack",
}

export class Player extends Schema {
  @type("number") health: number;
  @type("number") maxHealth: number;
  @type("number") weapon: Weapon;
  @type(Position) position: Position;
  @type(Rotation) direction: Rotation;
  @type("string") animation: AnimationState;

  @type("string") activeMode: "bow" | "sword";
  @type("string") userId: string;
}

export class MyRoomState extends Schema {
  //@type("string") mySynchronizedProperty: string = "Hello world";
  @type({ map: Player }) players = new Map<string, Player>();
}
