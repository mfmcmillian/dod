import { connect } from "./ArenaConnect";
import { Room } from "colyseus.js";
import { Dash_TriggerZone } from "dcldash";
import { CreateCombatZone } from "./combat-trigger-zone";
import { Player } from "../player";
import { Arrow } from "./Arrow";
import {
  ArenaAvatarModel,
  AvatarActiveMode,
  playerArenaModeFactory,
} from "./ArenaAvatar";
import { checkHealth } from "../counters";
import { applyEnemyAttackedEffectToLocation } from "src/effects/enemyAttacked";
import { player } from "src/instances";

const input = Input.instance;

class PlayerCombatServerSystem implements ISystem {
  room: Room;
  currentPosition: Vector3;
  private player: Player;

  constructor(room: Room, player: Player) {
    this.room = room;
    this.player = player;
  }

  update(dt: number) {
    const currentPosition = new Vector3().copyFrom(
      Camera.instance.feetPosition
    );

    if (!this.currentPosition) {
      this.currentPosition = currentPosition;
      this.room.send("update-location", {
        position: {
          x: this.currentPosition.x,
          y: this.currentPosition.y,
          z: this.currentPosition.z,
        },
        animation: "idle",
        direction: {
          x: Camera.instance.rotation.x,
          y: Camera.instance.rotation.y,
          z: Camera.instance.rotation.z,
          w: Camera.instance.rotation.w,
        },
      });
    } else if (!this.currentPosition.equals(currentPosition)) {
      this.currentPosition = currentPosition;
      this.room.send("update-location", {
        position: {
          x: this.currentPosition.x,
          y: this.currentPosition.y,
          z: this.currentPosition.z,
        },
        animation: "running",
        direction: {
          x: Camera.instance.rotation.x,
          y: Camera.instance.rotation.y,
          z: Camera.instance.rotation.z,
          w: Camera.instance.rotation.w,
        },
      });
    } else {
      this.room.send("update-location", {
        position: {
          x: this.currentPosition.x,
          y: this.currentPosition.y,
          z: this.currentPosition.z,
        },
        animation: "idle",
        direction: {
          x: Camera.instance.rotation.x,
          y: Camera.instance.rotation.y,
          z: Camera.instance.rotation.z,
          w: Camera.instance.rotation.w,
        },
      });
    }
  }
}

const ArrowShape = new GLTFShape("models/arrow_1_3.glb");
const arrowHitCache = new Arrow(ArrowShape);
arrowHitCache.getComponent(Transform).scale.setAll(0);

const DELETE_TIME = 60; // In seconds

function hitStaticTarget(event: LocalActionButtonEvent) {
  // Calculating for static targets
  log("calculating hit for static targets", event.hit, event);
  if (event.hit) {
    log("rotation", Camera.instance.rotation);
    const arrowMark = new Arrow(ArrowShape, DELETE_TIME);
    // arrowMark.getComponent(Transform).rotation.setEuler(90, 0, 90)
    log(arrowMark.getComponent(Transform).rotation);
    // arrowMark.getComponent(Transform).lookAt(event.hit.normal)
    arrowMark.getComponent(Transform).position = event.hit.hitPoint;
    arrowMark.getComponent(Transform).rotation =
      Camera.instance.rotation.clone();
    arrowMark.getComponent(Transform).scale.setAll(3);
    log("arrow", arrowMark.uuid);
    engine.addEntity(arrowMark);
  }
}

function hitDynamicTarget(entity: IEntity, event: LocalActionButtonEvent) {
  const bulletMark = new Arrow(ArrowShape, DELETE_TIME);
  bulletMark.setParent(entity); // Make the bullet mark the child of the target so that it remains on the target

  if (event.hit) {
    // NOTE: If you have multiple parent entities then you'll need to subtract for each successive parent transform
    const targetParentPosition = entity
      .getParent()!
      .getComponent(Transform).position;
    const targetPosition = entity.getComponent(Transform).position;
    const relativePosition = event.hit.hitPoint
      .subtract(targetParentPosition)
      .subtract(targetPosition);
    relativePosition.rotate(
      entity.getComponent(Transform).rotation.conjugate()
    ); // Inversing the parent's rotation
    bulletMark.getComponent(Transform).position = relativePosition;
  }
}

const shape = new GLTFShape("models/SkeletonPvP_1.glb");
export class CombatZone {
  players: [];

  playerAvatars: {
    [key: string]: ArenaAvatarModel;
  } = {};
  room?: Room;
  zone?: Dash_TriggerZone;
  system?: PlayerCombatServerSystem;
  private player: Player;
  private model: {
    playAttackAnimation: () => void;
    enableMode: () => void;
    playImpactAnimation: () => void;
    playIdle: () => void;
    switchActiveMode: (activeMode: AvatarActiveMode) => void;
    disableMode: () => void;
    getActiveMode: () => AvatarActiveMode;
    avatar: ArenaAvatarModel;
  };

  constructor(player: Player) {
    this.players = [];
    this.player = player;
    this.playerAvatars = {};

    this.onEnter = this.onEnter.bind(this);
    this.onLeave = this.onLeave.bind(this);
    this.handleStateUpdate = this.handleStateUpdate.bind(this);
    this.model = playerArenaModeFactory(shape);

    this.zone = CreateCombatZone({
      onEnter: () => this?.onEnter?.(),
      onLeave: () => this?.onLeave?.(),
    });
  }

  shoot(e: LocalActionButtonEvent) {
    if (!this.model.avatar.getAnimation("attack").playing) {
      this.model.playAttackAnimation();
      applyEnemyAttackedEffectToLocation(Camera.instance.feetPosition);
      if (this.room && this.model.getActiveMode()) {
        if (e.hit) {
          log("hit entity", e.hit.entityId);
          // check if entity exists in the avatar map
          const result = Object.keys(this.playerAvatars).filter((key) => {
            return this.playerAvatars[key].uuid === e.hit.entityId;
          });

          if (this.model.getActiveMode() === AvatarActiveMode.BOW) {
            if (result.length === 1) {
              // if entity exists we hit with a dynamic target
              hitDynamicTarget(this.playerAvatars[result[0]], e);
              this.room.send("shoot", {
                direction: e.direction,
                origin: Camera.instance.position,
              });
            } else {
              hitStaticTarget(e);
            }
          } else {
            log("res", result);
            this.room.send("attack", {
              direction: e.direction,
              origin: Camera.instance.position,
            });
          }
        }
      }
    }
  }

  handleStateUpdate(c: any) {
    this.players = c?.players || [];

    this.players?.forEach((p: any, key) => {
      // @ts-ignore
      if (key !== this.room.sessionId) {
        if (this.playerAvatars[key]) {
          this.playerAvatars[key]?.addComponentOrReplace(
            new Transform({
              position: new Vector3(
                p?.position?.x,
                p?.position?.y,
                p?.position?.z
              ),
              rotation: new Quaternion(p?.direction.x, 0, 0, p?.direction?.w),
            })
          );
          this.playerAvatars[key]?.updateHealthBar(p.health, p.maxHealth);
        } else {
          this.playerAvatars[key] = new ArenaAvatarModel(
            shape,
            new Transform({
              position: new Vector3(
                p?.position?.x,
                p?.position?.y,
                p?.position?.z
              ),
              scale: new Vector3(1, 1, 1),
              rotation: new Quaternion(p?.direction.x, 0, 0, p?.direction?.w),
            })
          );

          this.playerAvatars[key]?.createHealthBar(p.health, p.maxHealth);
          this.playerAvatars[key]?.playIdle();
          engine.addEntity(this.playerAvatars[key]);
        }

        this.playerAvatars[key].switchActiveMode(p.activeMode || "bow");

        const animation = p.animation;

        switch (animation) {
          case "idle":
            this.playerAvatars[key]?.playIdle(true);
            break;
          case "running":
            this.playerAvatars[key]?.playRunning(false);
            break;
          case "attack":
            this.playerAvatars[key]?.playAttack();
            applyEnemyAttackedEffectToLocation(
              this.playerAvatars[key].getComponent(Transform).position
            );
            break;
          default:
            break;
        }
      } else {
        // if (p?.health > 0) {
        //     log(`player health: ${p?.health}`)

        //     this.player.reduceHealth(
        //         Math.floor(this.player.health - p.health)
        //     )
        // }
        // log(`red health: ${Math.floor(this.player.health - p.health)}`)
        // // else if (this.player.health != p.health) {
        // //     this.player.reduceHealth(1)
        // // }
        this.player.health = p.health;
        this.player.updateHealthBar();

        checkHealth();
      }
    });
  }

  listenToChanges() {
    this.room.onStateChange(this.handleStateUpdate);
  }

  onEnter() {
    log("User has entered the zone");
    this.player.refillHealthBar();
    this?.model.enableMode();

    executeTask(() =>
      connect("my_room", {
        health: this.player.health,
        maxHealth: this.player.maxHealth,
        weapon: 1,
        animation: "idle",
        direction: {
          x: Camera.instance.rotation.x,
          y: Camera.instance.rotation.y,
          z: Camera.instance.rotation.z,
          w: Camera.instance.rotation.w,
        },
        position: {
          x: Camera.instance.feetPosition.x,
          y: Camera.instance.feetPosition.y,
          z: Camera.instance.feetPosition.z,
        },
      })
        .then((r) => {
          this.room = r;
          this.system = new PlayerCombatServerSystem(r, player);
          this.listenToChanges();
          engine.addSystem(this.system);
          this.room.onMessage("leave", (m) => {
            log("left", m.id);
            if (this.playerAvatars[m.id]) {
              engine.removeEntity(this.playerAvatars[m.id]);
            }
          });
        })
        .catch((e) => log(e))
    );

    input.subscribe("BUTTON_DOWN", ActionButton.POINTER, true, (e) =>
      this.shoot(e)
    );

    input.subscribe("BUTTON_DOWN", ActionButton.PRIMARY, false, (e) => {
      const newMode =
        this.model.getActiveMode() === AvatarActiveMode.BOW
          ? AvatarActiveMode.SWORD
          : AvatarActiveMode.BOW;
      this.room.send("active-mode", {
        activeMode: newMode,
      });
      this.model.switchActiveMode(newMode);
      this.model.playIdle();
    });
  }

  onLeave() {
    log("User has left the zone");
    this.room?.leave(true);
    this?.model.disableMode();

    this.room?.onStateChange?.remove(this.handleStateUpdate);

    Object.keys(this.playerAvatars).forEach((key) => {
      engine.removeEntity(this.playerAvatars[key]);
      delete this.playerAvatars[key];
    });

    this.room?.removeAllListeners?.();

    delete this.room;

    if (this.system) {
      engine.removeSystem(this.system);
      delete this.system;
    }
  }
}
