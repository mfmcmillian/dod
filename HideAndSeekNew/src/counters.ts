import { setTimeout } from "@dcl/ecs-scene-utils";
import * as ui from "@dcl/ui-scene-utils";
import { movePlayerTo } from "@decentraland/RestrictedActions";
import { ITEM_TYPES } from "./inventory/playerInventoryMap";
import { LEVEL_TYPES } from "./LevelManager/types";
import { player } from "./instances";

//dead
export function checkHealth() {
  if (player.health <= 0) {
    ui.displayAnnouncement("you died!");
    //movePlayerTo({ x: 80.51, y: 55, z: 19.49 });
    player.health = player.maxHealth * 0.5;
    player.updateHealthBar();
    return true;
  }
  return false;
}
