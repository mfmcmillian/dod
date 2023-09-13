import { Character } from "src/character";
import * as ui from "@dcl/ui-scene-utils";
//import * as eth from "eth-connect"
import { getUserData } from "@decentraland/Identity";

import getRandomInt from "./utils/getRandomInt";
import { setTimeout } from "@dcl/ecs-scene-utils";
//import { canvas } from "./canvas"
import { PlayerInventory } from "./inventory/playerInventory";
import { ITEM_TYPES } from "./inventory/playerInventoryMap";

import {
  AddAvatarModels,
  AddPlayerEquipableItem,
  GetPlayerEquippedItems,
  GetPlayerAvatars,
  GetPlayerInventory,
  GetPlayerLevels,
  RemovePlayerEquipableItem,
  GetPlayerPets,
  GetPlayerDungeonCount,
} from "./api/api";
import { LEVEL_TYPES } from "./LevelManager/types";
import getRandomIntRange from "./utils/randomIntRange";
import { LevelManager } from "./LevelManager/levelManager";
import { Item, ItemTree, buffItem, itemTypes } from "./items";
import { PlayerAvatar } from "./skills/arissa";
import { canvas } from "@dcl/ui-scene-utils";
import { applyHealToLocation } from "./effects/heal";

const LAMBDA_URL = "https://lqcuxsaurh.execute-api.us-east-1.amazonaws.com"; //new

export const skillsUpgrade = new ui.CornerLabel(
  "",
  -815,
  30,
  Color4.Green(),
  11
);

export let DungeonStage = new ui.UICounter(0, -815, 60, Color4.Red(), 30);

//health increase by 10%
const HEALTH_MULTIPLIER = 1.05;
//attack increase by 20%
const ATTACK_MULTIPLIER = 1.11;

enum ITEM_GLBS {
  SWORD = "models/KnightSword.glb",
  AXE = "models/KnightAxe.glb",
}

export class Player extends Character {
  static instance: Player;

  //public attackAnimation?: () => void
  public questTime: number;
  public lastLogin: number;
  public username: string;
  public playerDataFetchError: boolean;
  public consecutiveLoginDays: number;
  public items: Item[];
  public inventory: PlayerInventory;
  public playerAvatar: PlayerAvatar;

  public swordInventoryCount: number;

  //HSU
  public HSU1InventoryCount: ui.UICounter;

  //HSU
  public fmBodyInventoryCount: ui.UICounter;
  public fmHeadInventoryCount: ui.UICounter;

  public polisher1: number;
  public polisher2: number;
  public polisher3: number;
  public polisher4: number;
  public polisherReward1: number;
  public polisherReward2: number;
  public polisherReward3: number;
  public polisherReward4: number;
  public bossKill2InventoryCount: ui.UICounter;
  public isChoppingTree: boolean;
  public isShakingTree: boolean;
  public isFishing: boolean;
  public isMining: boolean;
  public levels: LevelManager;
  private swordUI: ui.SmallIcon;
  private shieldUI: ui.SmallIcon;
  private helmetUI: ui.SmallIcon;
  private defenseLabel: ui.CornerLabel;
  public onInitDone: (player: Player) => void;
  public hasInit: boolean;
  public attackBuff?: number;
  public luckBuff?: number;
  public defBuff?: number;
  public critRateBuff?: number;
  public critDamageBuff?: number;

  //public petManager: PetManager
  public avatarModelList?: string[];

  // public healthBarNew: UIBarManager
  // public expBar: UIBarManager

  public hpEvent: Function;
  public xpEvent: Function;
  public lvEvent: Function;
  equiped: string = ITEM_GLBS.SWORD;
  public race: number;
  public class: number;
  public alliance: number;

  static getInstance(): Player {
    if (!Player.instance) {
      Player.instance = new Player(1, 0, 1, 100);
    }
    return Player.instance;
  }

  constructor(attack: number, xp: number, level: number, health: number = 1) {
    super(attack, xp, level, health);
    this.levels = new LevelManager();
    this.levels.setLevel(LEVEL_TYPES.PLAYER, level, xp);
    this.inventory = new PlayerInventory();
    //this.petManager = new PetManager();

    this.avatarModelList = ["models/BaseCharacter.glb"];

    this.levels.onUpdate = ({ type, level, xp, total, levelChange }) => {
      switch (type) {
        case LEVEL_TYPES.PLAYER:
          if (levelChange) {
            //this.handlePlayerLevelUp(level)
          } else {
            //this.updateXpBar()
          }
          return;
      }
      //this.writeDataToServer()
    };

    this.fmBodyInventoryCount = new ui.UICounter(
      0,
      -6000,
      410,
      Color4.Yellow(),
      40
    );
    this.fmHeadInventoryCount = new ui.UICounter(
      0,
      -6000,
      410,
      Color4.Yellow(),
      40
    );

    this.swordInventoryCount = 0;
    this.bossKill2InventoryCount = new ui.UICounter(
      this.level,
      -200,
      620,
      Color4.Red(),
      40
    );
    this.bossKill2InventoryCount.hide();

    //this.items = []

    this.defenseLabel = new ui.CornerLabel(``, -8850, 0);
    this.defenseLabel.hide();
    this.luckBuff = 0;
    this.critRateBuff = 1;
    this.critDamageBuff = 100;
    this.attackBuff = 0;
    this.defBuff = 0;
    this.lastLogin = 0;
    this.consecutiveLoginDays = 0;
    this.questTime = 99999;
    // this.lvEvent(this.level)
    // StatusHUD.updateLv(this.level)
    // executeTask(() => this.fetchPlayerStats())
  }

  async CreatePlayerAvatar(shape?: GLTFShape) {
    const { userId } = await getUserData();
    this.playerAvatar = new PlayerAvatar(
      userId,
      shape || new GLTFShape("models/Knight.glb")
    );
  }

  SwapModel(shape: GLTFShape) {
    if (this.playerAvatar) {
      this.playerAvatar.swapModel(shape);
    } else {
      executeTask(() => this.CreatePlayerAvatar(shape));
    }
  }
  getDefensePercent(): number {
    const defense =
      super.getDefensePercent() + this.defBuff ||
      0 +
        this.items.reduce((accm, item: Item) => {
          const buff: buffItem[] | buffItem = item.buff;
          if (item.type === itemTypes.SHIELD) {
            if (Array.isArray(buff)) {
              //@ts-ignore
              const b = buff.find((buff) => buff.type);
              if (b) {
                return accm + b.value;
              }
              return accm;
            }
            return accm + buff.value;
          }
          return accm;
        }, 0);
    const safeDefense = defense >= 1 ? 0.99 : defense;
    const percentageDef = safeDefense * 100;
    this.defenseLabel.set(`Player Defense: ${percentageDef}%`);
    setTimeout(2000, () => this.defenseLabel.hide());
    this.defenseLabel.show();
    return safeDefense;
  }

  attackAnimation() {
    //log("attack animation")
    this.playerAvatar?.playAttack();
  }

  impactAnimation() {
    //log("attack animation")
    this.playerAvatar?.playImpact();
  }

  addAvatarModel(model: string, weight: number = 0) {
    this.avatarModelList.push(model);
    executeTask(() => AddAvatarModels(model, weight));
  }

  getLuckRange(): number {
    return (
      super.getLuckRange() +
      this.luckBuff +
      this.items.reduce((accm, item: Item) => {
        const buff: buffItem[] | buffItem = item.buff;
        if (item.type === itemTypes.HELMET) {
          if (Array.isArray(buff)) {
            //@ts-ignore
            const b = buff.find((buff) => buff.type);
            if (b) {
              return accm + b.value;
            }
            return accm;
          }
          return accm + buff.value;
        }
        return accm;
      }, 0)
    );
  }

  getLuckBuffs(): number {
    return (
      this.luckBuff +
      this.items.reduce((accm, item: Item) => {
        const buff: buffItem[] | buffItem = item.buff;
        if (item.type === itemTypes.HELMET) {
          if (Array.isArray(buff)) {
            //@ts-ignore
            const b = buff.find((buff) => buff.type);
            if (b) {
              return accm + b.value;
            }
            return accm;
          }
          return accm + buff.value;
        }
        return accm;
      }, 0)
    );
  }

  getCritRate(): number {
    return this.critRateBuff;
  }

  getCritDamage(): number {
    return this.critDamageBuff;
  }

  chopTree() {
    const treeCount = this.inventory.getItemCount(ITEM_TYPES.TREE);
    log(treeCount);
  }

  checkHealth() {
    if (this.health <= 0) {
      ui.displayAnnouncement("You died!", 5, Color4.Red(), 50);
      //movePlayerTo({ x: 80.51, y: 55, z: 19.49 })
      this.health = this.maxHealth * 0.5;
      this.updateHealthBar();
      return true;
    }
    return false;
  }

  reduceHealth(attack: number): void {
    super.reduceHealth(attack);
    //this.updateHealthBar()
  }

  refillHealthBar(percentage = 1, playAnimation = true) {
    this.health += this.maxHealth * percentage;
    if (this.health > this.maxHealth) {
      this.health = this.maxHealth;
    }
    //this.updateHealthBar()

    if (playAnimation === true) {
      applyHealToLocation(Camera.instance.feetPosition);
    }
  }

  depleteHealthBar(percentage = 1) {
    this.health -= this.maxHealth * percentage;
    // if (this.health > this.maxHealth) {
    //     this.health = this.maxHealth
    // }
    this.updateHealthBar();
  }
  getLevel() {
    return this.level;
  }
  subscribeHpEvent(f: Function) {
    this.hpEvent = f;
  }
  subscribeXpEvent(f: Function) {
    this.xpEvent = f;
  }
  subscribeLvEvent(f: Function) {
    this.lvEvent = f;
  }
  updateHealthBar() {
    this.hpEvent(this.health, this.maxHealth);
    // StatusHUD.updateHp(this.health, this.maxHealth);
    // InventoryHUD.getInstance().pages[0].updateHp(
    //   `${this.health} / ${this.maxHealth}`
    // );
  }

  updateXpBar() {
    const level = this.levels.getLevel(LEVEL_TYPES.PLAYER);
    this.xpEvent(
      this.levels.getXp(LEVEL_TYPES.PLAYER) -
        (level > 1 ? LevelManager.xpRequiredForNextLevel(level - 1) : 0),
      LevelManager.xpRequiredForNextLevel(level) -
        (level > 1 ? LevelManager.xpRequiredForNextLevel(level - 1) : 0)
    );
  }

  async fetchPlayerStats() {
    try {
      const { userId, displayName } = await getUserData();

      if (userId) {
        (await GetPlayerInventory()).computed_player_inventory.forEach(
          ({ itemId, count }) => {
            this.inventory.setItem(itemId, count);
          }
        );
        //log("player inventory")

        const levels = await GetPlayerLevels();
        // log("player levels", levels)

        levels.levels?.forEach((i) => {
          if (LEVEL_TYPES.PLAYER)
            this.levels.setLevel(i.level_type, i.level, i.xp);
          else this.levels.setLevel(i.level_type, i.level, i.xp);
          this.levels.createOrUpdateLevelLabel(i.level_type);
        });

        // if (this.levels.getLevel(LEVEL_TYPES.PLAYER) <= 60) {
        //     this.maxHealth =
        //         this.maxHealth +
        //         this.levels.getLevel(LEVEL_TYPES.PLAYER)
        // } else {
        //     this.maxHealth = this.maxHealth + 60
        // }

        this.maxHealth =
          this.maxHealth + this.levels.getLevel(LEVEL_TYPES.PLAYER);

        //this.updateHealthBar()

        log(
          `Adding attack level bonus ${this.levels.getLevel(
            LEVEL_TYPES.PLAYER
          )}`
        );

        if (this.levels.getLevel(LEVEL_TYPES.PLAYER) > 20) {
          skillsUpgrade.set(`Upgraded Skills Unlocked!`);
        }

        if (this.levels.getLevel(LEVEL_TYPES.PLAYER) <= 60) {
          this.attack = this.attack + this.levels.getLevel(LEVEL_TYPES.PLAYER);
        } else {
          this.attack = this.attack + 60;
        }

        this.refillHealthBar(1, false);

        this.updateXpBar();

        //this.username = username

        // log(this.getXpLabel())
        // log("player inited")

        // Update UI
        // InventoryHUD.getInstance().pages[0].updatePAtk(
        //   `${this.getPlayerAttack(false)}`
        // );
        // InventoryHUD.getInstance().pages[0].updatePDef(
        //   `${this.getDefensePercent()}`
        // );
        // InventoryHUD.getInstance().pages[0].updateLuck(
        //   `${this.getLuckRange()}`
        // );

        //InventoryHUD.getInstance().updateHp(``)

        // Run consecutive days reward check
        //this.updateLoginReward()

        const items = await GetPlayerEquippedItems();

        items?.items.forEach((i) => {
          const itemMeta = ItemTree[i.item_id];

          if (itemMeta) {
            const item = new Item(
              i.item_id,
              itemMeta.name,
              itemMeta.type,
              itemMeta.buff,
              itemMeta.image
            );
            this.addItem(item);
          }
        });
        //log("player equipped items", items)

        const data = await GetPlayerAvatars();

        if (data?.models?.length) {
          this.avatarModelList = data?.models
            ?.sort((a, b) => (a?.weight > b?.weight ? 1 : -1))
            .map((i) => i.file);
        }

        this.lvEvent(this.levels.getLevel(LEVEL_TYPES.PLAYER));
        //StatusHUD.updateLv(this.levels.getLevel(LEVEL_TYPES.PLAYER));

        const { pets } = (await GetPlayerPets()) || { pets: [] };

        const dungeonLevels = await GetPlayerDungeonCount();
        DungeonStage.increase(dungeonLevels?.result?.runs?.count);

        log("player dungeon level", dungeonLevels?.result?.runs?.count);

        // if (pets?.length) {
        //   this.petManager.setPets(pets.map(({ pet }) => pet));
        // }

        //log("set levels")
        this.updateHealthBar();
        if (this.onInitDone) {
          this.onInitDone(this);
        }
        this.hasInit = true;
        //log("player initied")

        // StatusHUD.show()
        this.updateXpBar();
        await this.CreatePlayerAvatar(new GLTFShape("models/Knight.glb"));
      }
    } catch (e) {
      //log("error", e.toString())
      if (Object.keys(e).length > 0) this.playerDataFetchError = true;
    }
  }

  rollDice() {
    const max = 20 + this.levels.getLevel(LEVEL_TYPES.PLAYER) / 2;
    const min = (this.getLuckBuffs() / 100) * max;

    const randomNumber = getRandomIntRange(Math.round(min), Math.round(max));

    //const value2 = this.getLuckBuffs() / 2

    const value = randomNumber + this.getLuckBuffs() / 2;
    return value;
  }

  // handlePlayerLevelUp(level: number) {
  //   this.lvEvent(level);
  //   StatusHUD.updateLv(level);
  //   if (this.levels.getLevel(LEVEL_TYPES.PLAYER) <= 60) {
  //     this.maxHealth += 4;
  //     this.attack++;
  //   }
  //   this.refillHealthBar(1, true);

  //   this.updateXpBar();
  //   this.inventory.incrementItem(ITEM_TYPES.CHICKEN, 20 + this.level);
  //   this.inventory.incrementItem(ITEM_TYPES.ROCK, 20 + this.level);
  //   this.inventory.incrementItem(ITEM_TYPES.BONE, 20 + this.level);
  //   this.inventory.incrementItem(ITEM_TYPES.TREE, 20 + this.level);

  //   this.inventory.incrementItem(ITEM_TYPES.BERRY, 20 + this.level);
  //   this.inventory.incrementItem(ITEM_TYPES.BONE, 2);
  //   this.writeDataToServer();
  //   const releaseNotes = new UIImage(
  //     canvas,
  //     new Texture("images/lvl_up_2.png")
  //   );
  //   releaseNotes.name = "clickable-image";
  //   releaseNotes.width = "500px";
  //   releaseNotes.height = "500px";
  //   releaseNotes.sourceWidth = 500;
  //   releaseNotes.sourceHeight = 500;
  //   releaseNotes.isPointerBlocker = true;
  //   releaseNotes.positionX = 2;
  //   releaseNotes.positionY = 80;
  //   releaseNotes.visible = true;
  //   setTimeout(6 * 1000, () => {
  //     releaseNotes.visible = false;
  //   });
  // }

  // updateAtkBuff(value: number) {
  //   this.attackBuff += value;
  //   InventoryHUD.getInstance().pages[0].updatePAtk(
  //     `${this.getPlayerAttack(false)}`
  //   );
  // }

  // updateDefBuff(value: number) {
  //   this.defBuff += value;
  //   InventoryHUD.getInstance().pages[0].updatePDef(
  //     `${this.getDefensePercent()}`
  //   );
  // }

  // updateLuckBuff(value: number) {
  //   this.luckBuff += value;
  //   InventoryHUD.getInstance().pages[0].updateLuck(`${this.getLuckRange()}`);
  // }

  // updateCritDmg(value: number) {
  //   this.critDamageBuff += value;
  //   InventoryHUD.getInstance().pages[0].updateCritDamage(
  //     `${this.getCritDamage()}%`
  //   );
  // }

  // updateCritRate(value: number) {
  //   this.critRateBuff += value;
  //   InventoryHUD.getInstance().pages[0].updateCritRate(
  //     `${this.getCritRate()}%`
  //   );
  // }

  // updateMaxHp(value: number) {
  //   this.maxHealth += value;
  //   this.updateHealthBar();
  // }

  // getPlayerAttack(withCritical = true) {
  //   const isCriticalAttack =
  //     getRandomInt(100) <= this.critRateBuff && withCritical;

  //   if (isCriticalAttack) {
  //     ui.displayAnnouncement(`Critical Attack!`);
  //   }
  //   return (
  //     (this.attack +
  //       (this.attackBuff || 0) +
  //       this.items.reduce((accm, item: Item) => {
  //         const buff: buffItem[] | buffItem = item.buff;
  //         if (item.type === itemTypes.SWORD) {
  //           if (Array.isArray(buff)) {
  //             //@ts-ignore
  //             const b = buff.find((buff) => buff.type);
  //             if (b) {
  //               return accm + b.value;
  //             }
  //             return accm;
  //           }
  //           return accm + buff.value;
  //         }
  //         return accm;
  //       }, 0)) *
  //     (isCriticalAttack ? 2 : 1)
  //   );
  // }
  async addItem(item: Item) {
    const toDelete = this.items.reduce(
      (acc, i) => (i.type === item.type ? i : acc),
      null
    );
    this.items = this.items.filter((iItem) => iItem.type !== item.type);

    this.items.push(item);

    if (toDelete) {
      await RemovePlayerEquipableItem({
        item_type: toDelete.type,
        item_id: toDelete.id,
      });
    }

    await AddPlayerEquipableItem({
      item_type: item.type,
      item_id: item.id,
      equipped: true,
    });
  }

  async writeDataToServer() {
    if (this.playerDataFetchError)
      return ui.displayAnnouncement(
        "Error: Please refresh page to load your stats",
        600
      );

    const { userId } = await getUserData();

    const fmHead = this.fmHeadInventoryCount.read();
    const fmBody = this.fmBodyInventoryCount.read();

    const consecutiveLoginDays = this.consecutiveLoginDays;
    const lastLogin = this.lastLogin;
    const questTime = this.questTime;
    const username = this.username;
    const polisher1 = this.polisher1 || null;
    const polisher2 = this.polisher2 || null;
    const polisher3 = this.polisher3 || null;
    const polisher4 = this.polisher4 || null;
    const polisherReward1 = this.polisherReward1 || null;
    const polisherReward2 = this.polisherReward2 || null;
    const polisherReward3 = this.polisherReward3 || null;
    const polisherReward4 = this.polisherReward4 || null;

    // const data = eth.toHex(
    //   `uuid=${userId}&fmHead=${fmHead}&fmBody=${fmBody}&lastLogin=${lastLogin}&username=${username}&consecutiveLoginDays=${consecutiveLoginDays}&polisher1=${polisher1}&polisher2=${polisher2}&polisher3=${polisher3}&polisher4=${polisher4}&polisherReward1=${polisherReward1}&polisherReward2=${polisherReward2}&polisherReward3=${polisherReward3}&polisherReward4=${polisherReward4}${
    //     questTime ? `&questTime=${questTime}` : ""
    //   }`
    // );
    try {
      //fetch(`${LAMBDA_URL}/update-stats?data=${data}`)
    } catch (e) {
      //log("db update failed try again later")
    }
  }
}
