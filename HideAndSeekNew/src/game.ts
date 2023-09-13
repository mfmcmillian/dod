import GameManager, { weapon } from "./gameManager";
import { canvas } from "@dcl/ui-scene-utils";
import * as utils from "@dcl/ecs-scene-utils";
import { buildHouse } from "./house";
import { buildJail } from "./jail";
import GameManagerHouse from "./gameManagerHouse";
import { CombatZone } from "./arena/CombatZone";
import { player } from "./instances";

const manager = new GameManager();
const managerHouse = new GameManagerHouse();

export function SpawnItem(
  model: GLTFShape,
  transform: Transform,
  sound: AudioClip,
  respawnTime: number
) {
  let entity = new Entity();
  engine.addEntity(entity);
  entity.addComponent(model);
  entity.addComponent(transform);

  let soundEntity = new Entity();
  soundEntity.addComponent(new AudioSource(sound));
  soundEntity.addComponent(new Transform());

  engine.addEntity(soundEntity);
  soundEntity.setParent(Attachable.AVATAR);

  /**
   * This trigger allows the player to stand on the same spot and continually
   * pick up an item without having to exit and re-enter the trigger themselves
   */
  entity.addComponent(
    new utils.TriggerComponent(
      new utils.TriggerBoxShape(new Vector3(1.5, 3, 1.5)), // We need a separate trigger instance for each item as we'll be modifying it
      {
        onCameraEnter: () => {
          soundEntity.getComponent(AudioSource).playOnce();
          manager.increaseHealth(1);
          entity.getComponent(Transform).scale.setAll(0);
          const origTriggerPosY = entity.getComponent(utils.TriggerComponent)
            .shape.position.y;
          entity.getComponent(utils.TriggerComponent).shape.position.y = -100; // Move the trigger so that the player exits and re-enters the trigger

          entity.addComponent(
            new utils.Delay(respawnTime, () => {
              entity.getComponent(Transform).scale.setAll(1);
              entity.getComponent(utils.TriggerComponent).shape.position.y =
                origTriggerPosY; // Revert trigger position back to its original position
            })
          );
        },
      }
    )
  );

  return entity;
}

Arena();
function Arena() {
  const entity3 = new Entity("entity3");
  // const input = Input.instance
  // const inputCallback = (e) => {
  //     // if (isPlayerInShootingArea) {
  //     //     gunShot.getComponent(AudioSource).playOnce()
  //     log(e);
  //     executeTask(async () => {
  //         let players = await getConnectedPlayers()
  //         players.forEach((player) => {
  //             log("player is nearby: ", player.userId)
  //             log(player)
  //         })
  //     })
  // }

  // engine.addEntity(entity3)
  // const box = new Entity()
  //
  // //create shape for entity and disable its collision
  //         box.addComponent(new BoxShape())
  //         box.getComponent(BoxShape).withCollisions = false

  // box.setParent(entity3)

  // box.addComponent(
  //     new utils.TriggerComponent(
  //         triggerBox, //shape
  //         {
  //             onCameraEnter : () => {
  //                 log('triggered!')
  //
  //                 input.subscribe('BUTTON_DOWN', ActionButton.POINTER, true, inputCallback)
  //             },
  //             onCameraExit: () => {
  //                 input.unsubscribe('BUTTON_DOWN', ActionButton.POINTER, inputCallback)
  //             }
  //         }
  //     )
  // )
  //entity3.setParent(_scene)
  const gltfShape3 = new GLTFShape("models/Arena.glb");
  gltfShape3.withCollisions = true;
  gltfShape3.isPointerBlocker = true;
  gltfShape3.visible = true;
  entity3.addComponentOrReplace(gltfShape3);

  const transform2200 = new Transform({
    position: new Vector3(16, 50, 16),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });

  entity3.addComponentOrReplace(transform2200);

  const combatZone = new CombatZone(player);
}

const modArea = new Entity();
modArea.addComponent(
  new CameraModeArea({
    area: { box: new Vector3(32000, 6000, 32000) },
    cameraMode: CameraMode.FirstPerson,
  })
);
modArea.addComponent(
  new Transform({
    position: new Vector3(16000, 3000, 16000),
  })
);
engine.addEntity(modArea);

//UI
export class StartingInfo {
  private card: UIImage;

  constructor(texturePath: string) {
    this.card = new UIImage(canvas, new Texture(texturePath));
    this.card.name = "clickable-image";
    // this.card.width = "768px";
    // this.card.height = "420px";
    this.card.width = "1950px";
    this.card.height = "1080px";
    this.card.sourceWidth = 1024;
    this.card.sourceHeight = 530;
    this.card.positionX = 0;
    this.card.positionY = 50;
    this.card.hAlign = "center";
    this.card.vAlign = "center";
    this.card.visible = false;
    this.card.isPointerBlocker = true;
  }

  public hide() {
    this.card.visible = false;
  }

  public show() {
    this.card.visible = true;
    // setTimeout(5 * 1000, () => {
    //   this.card.visible = false;
    // });
  }
}
export const startingInfo = new StartingInfo("images/nightmare.png");

export class StartingHeader {
  private card: UIImage;

  constructor() {
    this.card = new UIImage(canvas, new Texture("images/Hide_seek.png"));
    this.card.name = "clickable-image";
    this.card.width = "862px";
    this.card.height = "215px";
    this.card.sourceWidth = 862;
    this.card.sourceHeight = 215;
    this.card.positionX = 0;
    this.card.positionY = 230;
    this.card.hAlign = "center";
    this.card.vAlign = "center";
    this.card.visible = false;
    this.card.isPointerBlocker = true;
  }

  public show() {
    this.card.visible = true;
  }

  public hide() {
    this.card.visible = false;
  }
}
export const startingHeader = new StartingHeader();

export class StartingInfoExit {
  private card: UIImage;
  private cardHouse: UIImage;

  constructor() {
    this.card = new UIImage(canvas, new Texture("images/exit_button.png"));
    this.card.name = "clickable-image";
    this.card.width = "278px";
    this.card.height = "87px";
    this.card.sourceWidth = 278;
    this.card.sourceHeight = 87;
    this.card.positionX = 0;
    this.card.positionY = -250;
    this.card.hAlign = "center";
    this.card.vAlign = "center";
    this.card.visible = false;
    this.card.isPointerBlocker = true;
    this.card.onClick = new OnPointerDown(() => {
      startingInfo.hide();
      startingHeader.hide();
      this.card.visible = false;
      this.cardHouse.visible = false;
      //setTimeout(1 * 1000, () => {
      //this.card.visible = false;
      manager.createZombiesForRound();
      buildJail();

      //manager.healthBar.show();
      //player.inventory.incrementItem(ITEM_TYPES.ICEHEART, 1);
    });
    //});

    this.cardHouse = new UIImage(canvas, new Texture("images/exit_button.png"));
    this.cardHouse.name = "clickable-image";
    this.cardHouse.width = "278px";
    this.cardHouse.height = "87px";
    this.cardHouse.sourceWidth = 278;
    this.cardHouse.sourceHeight = 87;
    this.cardHouse.positionX = 0;
    this.cardHouse.positionY = -150;
    this.cardHouse.hAlign = "center";
    this.cardHouse.vAlign = "center";
    this.cardHouse.visible = false;
    this.cardHouse.isPointerBlocker = true;
    this.cardHouse.onClick = new OnPointerDown(() => {
      startingInfo.hide();
      startingHeader.hide();
      this.cardHouse.visible = false;
      this.card.visible = false;
      //setTimeout(1 * 1000, () => {
      //this.card.visible = false;
      managerHouse.createZombiesForRound();
      buildHouse();

      //managerHouse.healthBar.show();
      //player.inventory.incrementItem(ITEM_TYPES.ICEHEART, 1);
    });
    //});
  }

  public show() {
    this.card.visible = true;
    this.cardHouse.visible = true;
  }
}
export const startingInfoExitButton = new StartingInfoExit();

// startingInfo.show();
// startingHeader.show();
// startingInfoExitButton.show();
buildHouse();
