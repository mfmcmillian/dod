import { Room, Client } from "@colyseus/core";
import {
  AnimationState,
  MyRoomState,
  Player,
  Position,
  Rotation,
} from "./schema/MyRoomState";

const DISTANCE = 20;

const ATTACK = 200;

const MELEE_DISTANCE = 3;

const MELEE_ATTACK = 400;

interface Vector3 {
  x: number;
  y: number;
  z: number;
}

function detectIntersection(
  origin: Vector3,
  direction: Vector3,
  position: Vector3,
  maxDistance = DISTANCE
): boolean {
  // Find the distance between the origin and position using the distance formula
  const distance = Math.sqrt(
    Math.pow(position.x - origin.x, 2) +
      Math.pow(position.y - origin.y, 2) +
      Math.pow(position.z - origin.z, 2)
  );

  // Compare the distance to the desired value
  if (distance <= maxDistance) {
    // Find the vector from the origin to the position
    const originToPosition: Vector3 = {
      x: position.x - origin.x,
      y: position.y - origin.y,
      z: position.z - origin.z,
    };
    // Find the dot product of the direction vector and the origin-to-position vector
    const dotProduct =
      direction.x * originToPosition.x +
      direction.y * originToPosition.y +
      direction.z * originToPosition.z;
    // If the dot product is non-negative, an intersection has been detected
    if (dotProduct >= 0) {
      return true;
    }
  }
  return false;
}

export class MyRoom extends Room<MyRoomState> {
  onCreate(options: any) {
    this.setState(new MyRoomState());

    this.onMessage("join", (client, message) => {
      const player = new Player();
      player.health = message.health;
      player.maxHealth = message.maxHealth;
      player.weapon = message.weapon;
      player.userId = message?.userData?.userId;

      player.position = new Position();
      player.position.x = message.position.x;
      player.position.y = message.position.y;
      player.position.z = message.position.z;

      this.state.players.set(client.id, player);
    });

    this.onMessage("update-location", (client, message) => {
      const player = this.state.players.get(client.id);

      player.position.x = message.position.x;
      player.position.y = message.position.y;
      player.position.z = message.position.z;

      player.direction.x = message.direction.x;
      player.direction.y = message.direction.y;
      player.direction.z = message.direction.z;
      player.direction.w = message.direction.w;

      player.animation = message.animation;
    });

    this.onMessage("shoot", (client, message) => {
      const clientPlayer = this.state.players.get(client.id);
      clientPlayer.animation = AnimationState.attack;

      this.state.players.forEach((player, id) => {
        if (id !== client.id) {
          console.log("should check in in range");
          const hasCollided = detectIntersection(
            message.origin,
            message.direction,
            player.position
          );
          console.log("has collided", hasCollided);
          if (hasCollided) {
            player.health =
              player.health - ATTACK <= 0 ? 0 : player.health - ATTACK;
          }
          console.log(player.health);
          // isInRange(currentPlayer.position, player.position, direction, VELOCITY)
        }
      });
    });

    this.onMessage("attack", (client, message) => {
      const clientPlayer = this.state.players.get(client.id);
      clientPlayer.animation = AnimationState.attack;

      this.state.players.forEach((player, id) => {
        if (id !== client.id) {
          console.log("should check in in range");
          const hasCollided = detectIntersection(
            message.origin,
            message.direction,
            player.position,
            MELEE_DISTANCE
          );
          console.log("has collided", hasCollided);
          if (hasCollided) {
            player.health =
              player.health - MELEE_ATTACK <= 0
                ? 0
                : player.health - MELEE_ATTACK;
          }
          console.log(player.health);
          // isInRange(currentPlayer.position, player.position, direction, VELOCITY)
        }
      });
    });

    this.onMessage("active-mode", (client, message) => {
      const clientPlayer = this.state.players.get(client.id);
      clientPlayer.activeMode = message.activeMode;
    });
  }

  onJoin(client: Client, message: any) {
    console.log(client.sessionId, "joined!", message);
    const player = new Player();
    player.health = message.health;
    player.maxHealth = message.maxHealth;
    player.weapon = message.weapon;

    player.position = new Position();
    player.position.x = message.position.x;
    player.position.y = message.position.y;
    player.position.z = message.position.z;

    player.direction = new Rotation();
    player.direction.x = message.direction.x;
    player.direction.y = message.direction.y;
    player.direction.z = message.direction.z;
    player.direction.w = message.direction.w;

    player.animation = message.animation;

    this.state.players.set(client.id, player);
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    this.state.players.delete(client.id);
    this.broadcast("leave", {
      id: client.id,
    });
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
