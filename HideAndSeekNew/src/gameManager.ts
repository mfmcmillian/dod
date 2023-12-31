import { Zombie } from "./zombies/zombie";
import { ZombieAttack } from "./zombieAttack";
import * as ui from "@dcl/ui-scene-utils";
import * as utils from "@dcl/ecs-scene-utils";
import { setTimeout } from "@dcl/ecs-scene-utils";
import { BulletMark } from "./bullet";
import { Score } from "./score";
import { Weapon } from "./weapon";
import { movePlayerTo } from "@decentraland/RestrictedActions";
import { gunShapes, WeaponsManager } from "./weaponManager";
import { highestRoundCounterLabel, roundCounterLabel } from "./roundLabel";

// LEADER BOARD
import {
  getPlayerRounds,
  createPlayerRounds,
  updatePlayerRounds,
} from "./api/api";
import { FastZombie } from "./zombies/fastZombie";
import { TankZombie } from "./zombies/tankZombie";
import { BigBossZombie } from "./zombies/bigBossZombie";
import { ITEM_TYPES } from "./inventory/playerInventoryMap";
import { player } from "./inventory/player";

const DELETE_TIME = 8; // In seconds
// Score
const scoreTen = new Score(
  new GLTFShape("models/scoreTen.glb"),
  new Transform()
);
const scoreTwentyFive = new Score(
  new GLTFShape("models/scoreTwentyFive.glb"),
  new Transform()
);
const scoreFifty = new Score(
  new GLTFShape("models/scoreFifty.glb"),
  new Transform()
);

type ZombieAttackMap = {
  [key: string]: ZombieAttack;
};

const bulletMarkShape = new GLTFShape("models/bulletMark.glb");
const bulletMarkCache = new BulletMark(bulletMarkShape);
bulletMarkCache.getComponent(Transform).scale.setAll(0);

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
};

const POSITIONS = [
  new Vector3(30.85, 0, 30.07),
  new Vector3(1.81, 0, 5.77),
  new Vector3(29.47, 0, 6.17),
  new Vector3(1.58, 0, 19.91),
  new Vector3(16.67, 0, 6.57),
];

// Weapon
export let weapon = new Weapon();

// Cache weapons
for (const element of gunShapes) {
  const weaponCache = new Entity();
  const weaponShape = element;
  weaponCache.addComponent(new Transform({ scale: new Vector3(0, 0, 0) }));
  weaponCache.addComponent(weaponShape);
  engine.addEntity(weaponCache);
}

type WeaponInfo = {
  colorIndex: number;
  position: ReadOnlyVector3;
  rotation: Quaternion;
};

// Controls
const input = Input.instance;
input.subscribe("BUTTON_DOWN", ActionButton.POINTER, true, (e) => {
  if (e.hit && e.hit.entityId) {
    const weaponInfo: WeaponInfo = {
      colorIndex: weapon.weaponIndex,
      position: e.hit.hitPoint,
      rotation: Quaternion.FromToRotation(Vector3.Up(), e.hit.normal),
    };
  }
});

// Inputs
input.subscribe("BUTTON_DOWN", ActionButton.PRIMARY, true, (e) => {
  weapon.nextWeapon();
  weapon.switchWeaponAnim(weapon.weaponIndex);
});

input.subscribe("BUTTON_DOWN", ActionButton.SECONDARY, true, (e) => {
  weapon.previousWeapon();
  weapon.switchWeaponAnim(weapon.weaponIndex);
});

export default class GameManager {
  private round: number = 1;
  private zombies: Zombie[] = [];
  private attack = 0.1;
  private distance = 4;
  private moveSpeed = 2;
  private rotSpeed = 1;
  private readonly camera: Camera;
  private input: Input;
  private gunShot: Entity;
  private gunShotFail: Entity;
  private _isPlayerInShootingArea: boolean;
  private zombieSystem: ZombieAttackMap = {};
  private finishedRendering: boolean;
  private pauseOn: boolean;
  private points: number;
  private kills: number;
  private health: number;
  public counter: ui.UICounter;
  public killCounter: ui.UICounter;
  public healthBar: ui.UIBar;
  public pointsLabel: ui.CornerLabel;
  public ammoLabel: ui.CornerLabel;
  public killsLabel: ui.CornerLabel;

  constructor() {
    this.camera = Camera.instance;
    this.input = Input.instance;
    this._isPlayerInShootingArea = true;
    this.pauseOn = true;
    this.points = 0;
    this.kills = 0;
    this.health = 100;
    this.counter = new ui.UICounter(0, -40, 580);
    //this.counter.hide();
    this.killCounter = new ui.UICounter(0, -40, 520);
    //this.killCounter.hide();
    this.pointsLabel = new ui.CornerLabel(`Points: `, -120, 580);
    //this.pointsLabel.hide();
    this.ammoLabel = new ui.CornerLabel(`Ammo: `, -120, 550);
    //this.ammoLabel.hide();
    this.killsLabel = new ui.CornerLabel(`Kills: `, -120, 520);
    //this.killsLabel.hide();
    this.healthBar = new ui.UIBar(
      1,
      -80,
      630,
      Color4.Green(),
      ui.BarStyles.ROUNDSILVER,
      1
    );
    this.setUpGunShot();
    this.setUpGunShotFail();

    this.setUpInputHandler();
    // setTimeout(5 * 1000, () => {
    //   this.createZombiesForRound();
    // });
    this.counter.hide();
    this.killCounter.hide();
    this.pointsLabel.hide();
    this.ammoLabel.hide();
    this.killsLabel.hide();
    this.healthBar.hide();
  }

  increaseHealth(amount) {
    this.healthBar.set(amount);
    // Assuming that the health bar is updated elsewhere in your code
  }

  async createZombiesForRound() {
    this.counter.show();
    this.killCounter.show();
    this.pointsLabel.show();
    this.ammoLabel.show();
    this.killsLabel.show();
    this.healthBar.show();
    const response = await getPlayerRounds();
    ui.displayAnnouncement(`Round ${this.round}`, 5, Color4.Red());
    roundCounterLabel.value = `Round: ${this.round}`;

    if (
      response.zombies_leader_board &&
      response.zombies_leader_board.length === 0
    ) {
      highestRoundCounterLabel.value = `Highest Round: 1`;
    } else {
      highestRoundCounterLabel.value = `Highest Round: ${response.zombies_leader_board[0].rounds}`;
    }

    if (this.round % 10 === 0) {
      player.inventory.incrementItem(ITEM_TYPES.ICEHEART, 1);
      //log("add hearts!");
    }

    this.finishedRendering = false;
    let count = 0;
    let target = Math.round(this.round * 1.2);
    let isBigBossZombieCreatedInThisIteration = false;

    if (this.round % 5 === 0 && this.pauseOn === true) {
      let prompt = new ui.OptionPrompt(
        "Agent, feeling the strain?",
        "Breaks are scheduled every 5 rounds, but if you're up for a relentless zombie-hunting spree, you can opt to ignore them by clicking 'Don't show' Keep your guard up!",
        () => {
          for (let i = 1; i <= target; i++) {
            setTimeout(Math.round(i * 1.5) * 2000, () => {
              log("create zombie for round");

              setTimeout(200 * 1000, () => {
                if (engine.entities[zombie.uuid]) {
                  this.removeZombie(zombie);
                  this.createZombiesForRound();
                }
              });

              let moveSpeed = this.moveSpeed;
              let attack = this.attack;
              let distance = this.distance;

              let zombie;
              if (
                this.round % 5 === 0 &&
                !isBigBossZombieCreatedInThisIteration
              ) {
                // BigBossZombie
                moveSpeed = 2;
                attack = 0.3;
                distance = 14;
                let health = this.round * 50.2;

                zombie = new BigBossZombie(
                  new GLTFShape("models/Oligar.glb"),
                  health,
                  new Transform({
                    position:
                      POSITIONS[getRandomInt(POSITIONS.length)]?.clone(),
                  })
                );
                isBigBossZombieCreatedInThisIteration = true;
              } else if (this.round % 3 === 0) {
                // FastZombie
                moveSpeed = 6;
                zombie = new FastZombie(
                  new GLTFShape("models/Zombie.glb"),
                  moveSpeed,
                  new Transform({
                    position:
                      POSITIONS[getRandomInt(POSITIONS.length)]?.clone(),
                  })
                );
              } else if (this.round % 6 === 0) {
                // TankZombie
                zombie = new TankZombie(
                  new GLTFShape("models/Zombie.glb"),
                  new Transform({
                    position:
                      POSITIONS[getRandomInt(POSITIONS.length)]?.clone(),
                  })
                );
              } else {
                // Regular Zombie
                zombie = new Zombie(
                  new GLTFShape("models/Zombie.glb"),
                  new Transform({
                    position:
                      POSITIONS[getRandomInt(POSITIONS.length)]?.clone(),
                  })
                );
              }

              //zombie sounds
              let clip2 = new AudioClip("sounds/attack.mp3");
              let attackSound = new AudioSource(clip2);
              zombie.addComponentOrReplace(attackSound);

              const zombieSystem = new ZombieAttack(zombie, this.camera, {
                moveSpeed: moveSpeed,
                rotSpeed: this.rotSpeed,
                attackDistance: distance,
                onAttack: async () => {
                  log("attack");
                  attackSound.playOnce();
                  this.healthBar.decrease(attack);
                  if (this.healthBar.read() <= 0) {
                    ui.displayAnnouncement("GAME OVER!", 5, Color4.Red(), 50);
                    // get th current round and compare with db rounds by player & save again just in case//
                    log("GEt Player Rouds>>>>", response);

                    if (
                      response.zombies_leader_board &&
                      response.zombies_leader_board.length === 0
                    ) {
                      // create new entries for player
                      const response2 = await createPlayerRounds(this.round);
                    } else {
                      // update
                      log(
                        "player rounds>>>",
                        response.zombies_leader_board[0].rounds
                      );
                      if (
                        this.round > response.zombies_leader_board[0].rounds
                      ) {
                        const response3 = await updatePlayerRounds(this.round);
                        highestRoundCounterLabel.value = `Highest Round: ${response.zombies_leader_board[0].rounds}`;
                        log("rounds updateD", response3);
                      }
                    }
                    log("current Player Rounds>>>", this.round);

                    movePlayerTo({ x: 22.51, y: 0, z: 13.92 });
                    this.healthBar.set(1);
                    this.removeAllZombies();
                    this.round = 1;
                    this.points = 0;
                    this.counter.set(this.points);
                    this.createZombiesForRound();
                  }
                },
              });

              engine.addSystem(zombieSystem);
              this.zombieSystem[zombie.uuid] = zombieSystem;

              this.zombies.push(zombie);
              count++;

              if (count === target) {
                this.finishedRendering = true;
              }
            });
          }
        },
        () => {
          this.pauseOn = false;
          for (let i = 1; i <= target; i++) {
            setTimeout(Math.round(i * 1.5) * 2000, () => {
              log("create zombie for round");

              setTimeout(200 * 1000, () => {
                if (engine.entities[zombie.uuid]) {
                  this.removeZombie(zombie);
                  this.createZombiesForRound();
                }
              });

              let moveSpeed = this.moveSpeed;
              let attack = this.attack;
              let distance = this.distance;

              let zombie;
              if (
                this.round % 5 === 0 &&
                !isBigBossZombieCreatedInThisIteration
              ) {
                // BigBossZombie
                moveSpeed = 2;
                attack = 0.3;
                distance = 14;
                let health = this.round * 50.2;

                zombie = new BigBossZombie(
                  new GLTFShape("models/Oligar.glb"),
                  health,
                  new Transform({
                    position:
                      POSITIONS[getRandomInt(POSITIONS.length)]?.clone(),
                  })
                );
                isBigBossZombieCreatedInThisIteration = true;
              } else if (this.round % 3 === 0) {
                // FastZombie
                moveSpeed = 6;
                zombie = new FastZombie(
                  new GLTFShape("models/Zombie.glb"),
                  moveSpeed,
                  new Transform({
                    position:
                      POSITIONS[getRandomInt(POSITIONS.length)]?.clone(),
                  })
                );
              } else if (this.round % 6 === 0) {
                // TankZombie
                zombie = new TankZombie(
                  new GLTFShape("models/Zombie.glb"),
                  new Transform({
                    position:
                      POSITIONS[getRandomInt(POSITIONS.length)]?.clone(),
                  })
                );
              } else {
                // Regular Zombie
                zombie = new Zombie(
                  new GLTFShape("models/Zombie.glb"),
                  new Transform({
                    position:
                      POSITIONS[getRandomInt(POSITIONS.length)]?.clone(),
                  })
                );
              }

              //zombie sounds
              let clip2 = new AudioClip("sounds/attack.mp3");
              let attackSound = new AudioSource(clip2);
              zombie.addComponentOrReplace(attackSound);

              const zombieSystem = new ZombieAttack(zombie, this.camera, {
                moveSpeed: moveSpeed,
                rotSpeed: this.rotSpeed,
                attackDistance: distance,
                onAttack: async () => {
                  log("attack");
                  attackSound.playOnce();
                  this.healthBar.decrease(attack);
                  if (this.healthBar.read() <= 0) {
                    ui.displayAnnouncement("GAME OVER!", 5, Color4.Red(), 50);
                    // get th current round and compare with db rounds by player & save again just in case//
                    log("GEt Player Rouds>>>>", response);

                    if (
                      response.zombies_leader_board &&
                      response.zombies_leader_board.length === 0
                    ) {
                      // create new entries for player
                      const response2 = await createPlayerRounds(this.round);
                    } else {
                      // update
                      log(
                        "player rounds>>>",
                        response.zombies_leader_board[0].rounds
                      );
                      if (
                        this.round > response.zombies_leader_board[0].rounds
                      ) {
                        const response3 = await updatePlayerRounds(this.round);
                        highestRoundCounterLabel.value = `Highest Round: ${response.zombies_leader_board[0].rounds}`;
                        log("rounds updateD", response3);
                      }
                    }
                    log("current Player Rounds>>>", this.round);

                    movePlayerTo({ x: 22.51, y: 0, z: 13.92 });
                    this.healthBar.set(1);
                    this.removeAllZombies();
                    this.round = 1;
                    this.points = 0;
                    this.counter.set(this.points);
                    this.createZombiesForRound();
                  }
                },
              });

              engine.addSystem(zombieSystem);
              this.zombieSystem[zombie.uuid] = zombieSystem;

              this.zombies.push(zombie);
              count++;

              if (count === target) {
                this.finishedRendering = true;
              }
            });
          }
        },
        "Continue",
        "Dont show",

        true
      );
    } else {
      for (let i = 1; i <= target; i++) {
        setTimeout(Math.round(i * 1.5) * 2000, () => {
          log("create zombie for round");

          setTimeout(200 * 1000, () => {
            if (engine.entities[zombie.uuid]) {
              this.removeZombie(zombie);
              this.createZombiesForRound();
            }
          });

          let moveSpeed = this.moveSpeed;
          let attack = this.attack;
          let distance = this.distance;

          let zombie;
          if (this.round % 5 === 0 && !isBigBossZombieCreatedInThisIteration) {
            // BigBossZombie
            moveSpeed = 2;
            attack = 0.3;
            distance = 14;
            let health = this.round * 50.2;

            zombie = new BigBossZombie(
              new GLTFShape("models/Oligar.glb"),
              health,
              new Transform({
                position: POSITIONS[getRandomInt(POSITIONS.length)]?.clone(),
              })
            );
            isBigBossZombieCreatedInThisIteration = true;
          } else if (this.round % 3 === 0) {
            // FastZombie
            moveSpeed = 6;
            zombie = new FastZombie(
              new GLTFShape("models/Zombie.glb"),
              moveSpeed,
              new Transform({
                position: POSITIONS[getRandomInt(POSITIONS.length)]?.clone(),
              })
            );
          } else if (this.round % 6 === 0) {
            // TankZombie
            zombie = new TankZombie(
              new GLTFShape("models/Zombie.glb"),
              new Transform({
                position: POSITIONS[getRandomInt(POSITIONS.length)]?.clone(),
              })
            );
          } else {
            // Regular Zombie
            zombie = new Zombie(
              new GLTFShape("models/Zombie.glb"),
              new Transform({
                position: POSITIONS[getRandomInt(POSITIONS.length)]?.clone(),
              })
            );
          }

          //zombie sounds
          let clip2 = new AudioClip("sounds/attack.mp3");
          let attackSound = new AudioSource(clip2);
          zombie.addComponentOrReplace(attackSound);

          const zombieSystem = new ZombieAttack(zombie, this.camera, {
            moveSpeed: moveSpeed,
            rotSpeed: this.rotSpeed,
            attackDistance: distance,
            onAttack: async () => {
              log("attack");
              attackSound.playOnce();
              this.healthBar.decrease(attack);
              if (this.healthBar.read() <= 0) {
                ui.displayAnnouncement("GAME OVER!", 5, Color4.Red(), 50);
                // get th current round and compare with db rounds by player & save again just in case//
                log("GEt Player Rouds>>>>", response);

                if (
                  response.zombies_leader_board &&
                  response.zombies_leader_board.length === 0
                ) {
                  // create new entries for player
                  const response2 = await createPlayerRounds(this.round);
                } else {
                  // update
                  log(
                    "player rounds>>>",
                    response.zombies_leader_board[0].rounds
                  );
                  if (this.round > response.zombies_leader_board[0].rounds) {
                    const response3 = await updatePlayerRounds(this.round);
                    highestRoundCounterLabel.value = `Highest Round: ${response.zombies_leader_board[0].rounds}`;
                    log("rounds updateD", response3);
                  }
                }
                log("current Player Rounds>>>", this.round);

                movePlayerTo({ x: 22.51, y: 0, z: 13.92 });
                this.healthBar.set(1);
                this.removeAllZombies();
                this.round = 1;
                this.points = 0;
                this.counter.set(this.points);
                this.createZombiesForRound();
              }
            },
          });

          engine.addSystem(zombieSystem);
          this.zombieSystem[zombie.uuid] = zombieSystem;

          this.zombies.push(zombie);
          count++;

          if (count === target) {
            this.finishedRendering = true;
          }
        });
      }
    }
  }

  removeZombie(zombie: Zombie | Entity | IEntity) {
    engine.removeEntity(zombie);
    this.zombies = this.zombies.filter((zom) => zom.uuid !== zombie.uuid);

    //zombie sounds
    let clip = new AudioClip("sounds/die.mp3");
    let dyingSound = new AudioSource(clip);
    zombie.addComponentOrReplace(dyingSound);

    if (this.zombieSystem[zombie.uuid]) {
      engine.removeSystem(this.zombieSystem[zombie.uuid]);
      dyingSound.playOnce();
    }
    if (this.zombies.length === 0 && this.finishedRendering) {
      this.round++;
      utils.setTimeout(2000, () => {
        this.createZombiesForRound();
      });
    }
  }

  setUpGunShot() {
    this.gunShot = new Entity();
    this.gunShot.addComponent(
      new AudioSource(new AudioClip("sounds/shot.mp3"))
    );
    this.gunShot.addComponent(new Transform());
    engine.addEntity(this.gunShot);
    this.gunShot.setParent(Attachable.AVATAR);
  }

  getPoints() {
    return this.points;
  }

  deductPoints(points) {
    if (this.points - points >= 0) {
      this.points -= points;
      this.counter.set(this.points);
    }
  }

  setUpGunShotFail() {
    this.gunShotFail = new Entity();
    this.gunShotFail.addComponent(
      new AudioSource(new AudioClip("sounds/shotFail.mp3"))
    );
    this.gunShotFail.addComponent(new Transform());
    engine.addEntity(this.gunShotFail);
    this.gunShotFail.setParent(Attachable.AVATAR);
  }

  removeAllZombies() {
    this.zombies.forEach((zombie) => this.removeZombie(zombie));
  }

  setUpInputHandler() {
    this.input.subscribe("BUTTON_DOWN", ActionButton.POINTER, true, (e) => {
      if (
        this._isPlayerInShootingArea &&
        ((this.gunShot && weapon.getAmmo() > 0) || weapon.getAmmo() === -1)
      ) {
        this.gunShot.getComponent(AudioSource).playOnce();
        weapon.reduceAmmo();
        const [zombie] = this.zombies.filter(
          (zombie) => zombie.uuid === engine.entities[e.hit.entityId]?.uuid
        );

        if (e.hit.entityId !== undefined && zombie) {
          zombie.hit(weapon.getDamage());
          if (zombie.health <= 0) {
            //log(e.hit.meshName);
            this.score(50, e.hit.hitPoint); // Play score animation
            this.removeZombie(zombie);
            this.points += 50;
            this.kills += 1;
          } else {
            this.score(10, e.hit.hitPoint); // Play score animation
            this.points += 10;
          }
          this.counter.set(this.points);
          this.killCounter.set(this.kills);

          // we can make api call to add points into db for that player.
        } else if (engine.entities[e.hit.entityId] !== undefined) {
          // Calculate the position of where the bullet hits relative to the target
          const targetPosition =
            engine.entities[e.hit.entityId].getComponent(Transform).position;
          const relativePosition = e.hit.hitPoint.subtract(targetPosition);
          const bulletMark = new BulletMark(bulletMarkShape, DELETE_TIME);
          bulletMark.setParent(engine.entities[e.hit.entityId]); // Make the bullet mark the child of the target so that it remains on the target
          bulletMark.getComponent(Transform).position = relativePosition;
        }
      } else if (this.gunShotFail) {
        this.gunShotFail.getComponent(AudioSource).playOnce();
      }
    });
  }

  get isPlayerInShootingArea(): boolean {
    return this._isPlayerInShootingArea;
  }

  set isPlayerInShootingArea(value: boolean) {
    this._isPlayerInShootingArea = value;
  }

  score(targetHit: number, targetPosition: Vector3): void {
    switch (targetHit) {
      case 10:
        scoreTen.getComponent(Transform).position = targetPosition;
        scoreTen.getComponent(Transform).position.z -= 0.5;
        scoreTen.playAnimation();
        break;
      case 25:
        scoreTwentyFive.getComponent(Transform).position = targetPosition;
        scoreTwentyFive.getComponent(Transform).position.z -= 0.5;
        scoreTwentyFive.playAnimation();
        break;
      case 50:
        scoreFifty.getComponent(Transform).position = targetPosition;
        scoreFifty.getComponent(Transform).position.z -= 0.5;
        scoreFifty.playAnimation();
        break;
    }
  }
}
