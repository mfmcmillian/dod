import GameManagerHouse, { weapon } from "./gameManagerHouse";
import { setTimeout } from "@dcl/ecs-scene-utils";
import { createChannel } from "../node_modules/decentraland-builder-scripts/channel";
import { createInventory } from "../node_modules/decentraland-builder-scripts/inventory";
import * as ui from "@dcl/ui-scene-utils";
import Script1 from "../b53e3bde-9d22-4098-8707-29a685d25a3b/src/item";
import Script2 from "../d367d3f2-9696-4d61-985a-7988fbf5f50d/src/item";
import Script3 from "../8dcc2ca4-5e30-4488-9731-be24f0c041fd/src/item";
import Script4 from "../645d2a2b-266d-4872-9368-562ca4a81139/src/item";
import Script5 from "../7d669c08-c354-45e4-b3a3-c915c8fd6b6e/src/item";
import Script6 from "../a747f104-5434-42a8-a543-8739c24cf253/src/item";
import Script7 from "../901e4555-8743-49bb-854c-c8b354a3e3e1/src/item";
import Script8 from "../846479b0-75d3-450d-bbd6-7e6b3355a7a2/src/item";
import Script9 from "../683aa047-8043-40f8-8d31-beb7ab1b138c/src/item";

const manager = new GameManagerHouse();

export function buildHouse() {
  function shotgunBox() {
    const weaponBox = new Entity("weaponBox");
    engine.addEntity(weaponBox);
    weaponBox.setParent(_scene);
    const transform60 = new Transform({
      position: new Vector3(15.6, 1.9, 23.81),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(0.5, 0.5, 0.5),
    });
    weaponBox.addComponentOrReplace(transform60);
    const gltfShape20 = new GLTFShape("models/ShotgunB.glb");
    gltfShape20.withCollisions = true;
    gltfShape20.isPointerBlocker = true;
    gltfShape20.visible = true;
    weaponBox.addComponentOrReplace(gltfShape20);
    weaponBox.addComponent(
      new OnPointerDown(
        (e) => {
          const points = manager.getPoints();
          if (points >= 1000) {
            //clipOpen2.play();
            purchase.playOnce();
            weapon.addGun({
              type: "shotgun",
              ammo: 40,
              shape: new GLTFShape("models/Shotgun.glb"),
              damage: 70,
            });
            setTimeout(3 * 1000, () => {
              //clipClose2.play();
              //give shotgun
            });
            manager.deductPoints(1000);
          } else {
            ui.displayAnnouncement("Need more points to buy Shot gun");
          }
        },
        {
          hoverText: "1000 points for a shotgun",
          distance: 2,
        }
      )
    );
    let d2animator = new Animator();

    // Add animator component to the entity
    weaponBox.addComponent(d2animator);

    // Instance animation clip object
    const clipOpen2 = new AnimationState("open", { looping: false });
    const clipClose2 = new AnimationState("closed", { looping: false });
    const idleClip2 = new AnimationState("idle", { looping: false });

    // Add animation clip to Animator component
    d2animator.addClip(clipOpen2);
    d2animator.addClip(clipClose2);
    d2animator.addClip(idleClip2);

    // Add entity to engine
    engine.addEntity(weaponBox);

    //Default Animation
    idleClip2.play();

    //add sound
    let clip = new AudioClip("sounds/sale.mp3");
    let purchase = new AudioSource(clip);
    weaponBox.addComponent(purchase);
  }

  function machinegunBox() {
    const weaponBox = new Entity("weaponBox");
    engine.addEntity(weaponBox);

    weaponBox.setParent(_scene);
    const transform60 = new Transform({
      position: new Vector3(31.5, 1.9, 23.39),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(0.5, 0.5, 0.5),
    });
    weaponBox.addComponentOrReplace(transform60);
    const gltfShape20 = new GLTFShape("models/RifleB.glb");
    gltfShape20.withCollisions = true;
    gltfShape20.isPointerBlocker = true;
    gltfShape20.visible = true;
    weaponBox.addComponentOrReplace(gltfShape20);
    weaponBox.addComponent(
      new OnPointerDown(
        (e) => {
          const points = manager.getPoints();
          const pointsNeeded = 1000;
          if (points >= pointsNeeded) {
            //clipOpen2.play();
            purchase.playOnce();
            weapon.addGun({
              type: "AK - 47",
              ammo: 70,
              shape: new GLTFShape("models/Rifle.glb"),
              damage: 30,
            });
            setTimeout(3 * 1000, () => {
              //clipClose2.play();
            });
            manager.deductPoints(pointsNeeded);
          } else {
            ui.displayAnnouncement("Need more points to buy Machine gun");
          }
        },
        {
          hoverText: "1000 points for a machinegun",
          distance: 5,
        }
      )
    );
    let d2animator = new Animator();

    // Add animator component to the entity
    weaponBox.addComponent(d2animator);

    // Instance animation clip object
    const clipOpen2 = new AnimationState("open", { looping: false });
    const clipClose2 = new AnimationState("closed", { looping: false });
    const idleClip2 = new AnimationState("idle", { looping: false });

    // Add animation clip to Animator component
    d2animator.addClip(clipOpen2);
    d2animator.addClip(clipClose2);
    d2animator.addClip(idleClip2);

    // Add entity to engine
    engine.addEntity(weaponBox);

    //Default Animation
    idleClip2.play();

    //add sound
    let clip = new AudioClip("sounds/sale.mp3");
    let purchase = new AudioSource(clip);
    weaponBox.addComponent(purchase);
  }

  shotgunBox();
  machinegunBox();

  function door1() {
    const payDoor = new Entity("door");
    engine.addEntity(payDoor);
    payDoor.setParent(_scene);
    const transform60 = new Transform({
      position: new Vector3(9.61, 1, 11.3),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(0.5, 0.5, 0.5),
    });
    payDoor.addComponentOrReplace(transform60);
    const gltfShape20 = new GLTFShape("models/irondoor.glb");
    gltfShape20.withCollisions = true;
    gltfShape20.isPointerBlocker = true;
    gltfShape20.visible = true;
    payDoor.addComponentOrReplace(gltfShape20);
    payDoor.addComponent(
      new OnPointerDown(
        (e) => {
          const points = manager.getPoints();
          if (points >= 1000) {
            engine.removeEntity(payDoor);

            manager.deductPoints(1000);
          } else {
            ui.displayAnnouncement("Need more points to buy this door");
          }
        },
        {
          hoverText: "1000 points for a the door",
          distance: 2,
        }
      )
    );

    //add sound
    let clip = new AudioClip("sounds/sale.mp3");
    let purchase = new AudioSource(clip);
    payDoor.addComponent(purchase);
  }
  function door2() {
    const payDoor = new Entity("door");
    engine.addEntity(payDoor);
    payDoor.setParent(_scene);
    const transform60 = new Transform({
      position: new Vector3(23.73, 0.95, 11.3),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(0.5, 0.5, 0.5),
    });
    payDoor.addComponentOrReplace(transform60);
    const gltfShape20 = new GLTFShape("models/irondoor.glb");
    gltfShape20.withCollisions = true;
    gltfShape20.isPointerBlocker = true;
    gltfShape20.visible = true;
    payDoor.addComponentOrReplace(gltfShape20);
    payDoor.addComponent(
      new OnPointerDown(
        (e) => {
          const points = manager.getPoints();
          if (points >= 1000) {
            engine.removeEntity(payDoor);

            manager.deductPoints(1000);
          } else {
            ui.displayAnnouncement("Need more points to buy this door");
          }
        },
        {
          hoverText: "1000 points for a the door",
          distance: 2,
        }
      )
    );

    //add sound
    let clip = new AudioClip("sounds/sale.mp3");
    let purchase = new AudioSource(clip);
    payDoor.addComponent(purchase);
  }
  function door3() {
    const payDoor = new Entity("door");
    engine.addEntity(payDoor);
    payDoor.setParent(_scene);
    const transform60 = new Transform({
      position: new Vector3(18.83, 0.95, 11.3),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(0.5, 0.5, 0.5),
    });
    payDoor.addComponentOrReplace(transform60);
    const gltfShape20 = new GLTFShape("models/irondoor.glb");
    gltfShape20.withCollisions = true;
    gltfShape20.isPointerBlocker = true;
    gltfShape20.visible = true;
    payDoor.addComponentOrReplace(gltfShape20);
    payDoor.addComponent(
      new OnPointerDown(
        (e) => {
          const points = manager.getPoints();
          if (points >= 1000) {
            engine.removeEntity(payDoor);

            manager.deductPoints(1000);
          } else {
            ui.displayAnnouncement("Need more points to buy this door");
          }
        },
        {
          hoverText: "1000 points for a the door",
          distance: 2,
        }
      )
    );

    //add sound
    let clip = new AudioClip("sounds/sale.mp3");
    let purchase = new AudioSource(clip);
    payDoor.addComponent(purchase);
  }
  function door4() {
    const payDoor = new Entity("door");
    engine.addEntity(payDoor);
    payDoor.setParent(_scene);
    const transform60 = new Transform({
      position: new Vector3(13.2, 0.9, 21.1),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(0.5, 0.5, 0.5),
    });
    payDoor.addComponentOrReplace(transform60);
    const gltfShape20 = new GLTFShape("models/irondoor.glb");
    gltfShape20.withCollisions = true;
    gltfShape20.isPointerBlocker = true;
    gltfShape20.visible = true;
    payDoor.addComponentOrReplace(gltfShape20);
    payDoor.addComponent(
      new OnPointerDown(
        (e) => {
          const points = manager.getPoints();
          if (points >= 1000) {
            engine.removeEntity(payDoor);

            manager.deductPoints(1000);
          } else {
            ui.displayAnnouncement("Need more points to buy this door");
          }
        },
        {
          hoverText: "1000 points for a the door",
          distance: 2,
        }
      )
    );

    //add sound
    let clip = new AudioClip("sounds/sale.mp3");
    let purchase = new AudioSource(clip);
    payDoor.addComponent(purchase);
  }
  function door5() {
    const payDoor = new Entity("door");
    engine.addEntity(payDoor);
    payDoor.setParent(_scene);
    const transform60 = new Transform({
      position: new Vector3(20.2, 0.9, 21.1),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(0.5, 0.5, 0.5),
    });
    payDoor.addComponentOrReplace(transform60);
    const gltfShape20 = new GLTFShape("models/irondoor.glb");
    gltfShape20.withCollisions = true;
    gltfShape20.isPointerBlocker = true;
    gltfShape20.visible = true;
    payDoor.addComponentOrReplace(gltfShape20);
    payDoor.addComponent(
      new OnPointerDown(
        (e) => {
          const points = manager.getPoints();
          if (points >= 1000) {
            engine.removeEntity(payDoor);

            manager.deductPoints(1000);
          } else {
            ui.displayAnnouncement("Need more points to buy this door");
          }
        },
        {
          hoverText: "1000 points for a the door",
          distance: 2,
        }
      )
    );

    //add sound
    let clip = new AudioClip("sounds/sale.mp3");
    let purchase = new AudioSource(clip);
    payDoor.addComponent(purchase);
  }
  function door6() {
    const payDoor = new Entity("door");
    engine.addEntity(payDoor);
    payDoor.setParent(_scene);
    const transform60 = new Transform({
      position: new Vector3(25.9, 0.9, 15.5),
      rotation: new Quaternion(0, 1, 0, 1),
      scale: new Vector3(0.5, 0.5, 0.5),
    });
    payDoor.addComponentOrReplace(transform60);
    const gltfShape20 = new GLTFShape("models/irondoor.glb");
    gltfShape20.withCollisions = true;
    gltfShape20.isPointerBlocker = true;
    gltfShape20.visible = true;
    payDoor.addComponentOrReplace(gltfShape20);
    payDoor.addComponent(
      new OnPointerDown(
        (e) => {
          const points = manager.getPoints();
          if (points >= 1000) {
            engine.removeEntity(payDoor);

            manager.deductPoints(1000);
          } else {
            ui.displayAnnouncement("Need more points to buy this door");
          }
        },
        {
          hoverText: "1000 points for a the door",
          distance: 2,
        }
      )
    );

    //add sound
    let clip = new AudioClip("sounds/sale.mp3");
    let purchase = new AudioSource(clip);
    payDoor.addComponent(purchase);
  }
  function door7() {
    const payDoor = new Entity("door");
    engine.addEntity(payDoor);
    payDoor.setParent(_scene);
    const transform60 = new Transform({
      position: new Vector3(6.2, 0.9, 15.5),
      rotation: new Quaternion(0, 1, 0, 1),
      scale: new Vector3(0.5, 0.5, 0.5),
    });
    payDoor.addComponentOrReplace(transform60);
    const gltfShape20 = new GLTFShape("models/irondoor.glb");
    gltfShape20.withCollisions = true;
    gltfShape20.isPointerBlocker = true;
    gltfShape20.visible = true;
    payDoor.addComponentOrReplace(gltfShape20);
    payDoor.addComponent(
      new OnPointerDown(
        (e) => {
          const points = manager.getPoints();
          if (points >= 1000) {
            engine.removeEntity(payDoor);

            manager.deductPoints(1000);
          } else {
            ui.displayAnnouncement("Need more points to buy this door");
          }
        },
        {
          hoverText: "1000 points for a the door",
          distance: 2,
        }
      )
    );

    //add sound
    let clip = new AudioClip("sounds/sale.mp3");
    let purchase = new AudioSource(clip);
    payDoor.addComponent(purchase);
  }

  door1();
  door2();
  door3();
  door4();
  door5();
  door6();
  door7();
  const _scene = new Entity("_scene");
  engine.addEntity(_scene);
  const transform = new Transform({
    position: new Vector3(0, 0, 0),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  _scene.addComponentOrReplace(transform);

  const entity = new Entity("entity");
  engine.addEntity(entity);
  entity.setParent(_scene);
  const gltfShape = new GLTFShape(
    "644374a3-450b-430c-8ea6-45aa85f20db2/baseGrass.glb"
  );
  gltfShape.withCollisions = true;
  gltfShape.isPointerBlocker = true;
  gltfShape.visible = true;
  entity.addComponentOrReplace(gltfShape);
  const transform2 = new Transform({
    position: new Vector3(8, 0, 8),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity.addComponentOrReplace(transform2);

  const entity2 = new Entity("entity2");
  engine.addEntity(entity2);
  entity2.setParent(_scene);
  entity2.addComponentOrReplace(gltfShape);
  const transform3 = new Transform({
    position: new Vector3(24, 0, 8),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity2.addComponentOrReplace(transform3);

  const entity3 = new Entity("entity3");
  engine.addEntity(entity3);
  entity3.setParent(_scene);
  entity3.addComponentOrReplace(gltfShape);
  const transform4 = new Transform({
    position: new Vector3(40, 0, 8),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity3.addComponentOrReplace(transform4);

  const entity4 = new Entity("entity4");
  engine.addEntity(entity4);
  entity4.setParent(_scene);
  entity4.addComponentOrReplace(gltfShape);
  const transform5 = new Transform({
    position: new Vector3(56, 0, 8),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity4.addComponentOrReplace(transform5);

  const entity5 = new Entity("entity5");
  engine.addEntity(entity5);
  entity5.setParent(_scene);
  entity5.addComponentOrReplace(gltfShape);
  const transform6 = new Transform({
    position: new Vector3(72, 0, 8),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity5.addComponentOrReplace(transform6);

  const entity6 = new Entity("entity6");
  engine.addEntity(entity6);
  entity6.setParent(_scene);
  entity6.addComponentOrReplace(gltfShape);
  const transform7 = new Transform({
    position: new Vector3(88, 0, 8),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity6.addComponentOrReplace(transform7);

  const entity7 = new Entity("entity7");
  engine.addEntity(entity7);
  entity7.setParent(_scene);
  entity7.addComponentOrReplace(gltfShape);
  const transform8 = new Transform({
    position: new Vector3(104, 0, 8),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity7.addComponentOrReplace(transform8);

  const entity8 = new Entity("entity8");
  engine.addEntity(entity8);
  entity8.setParent(_scene);
  entity8.addComponentOrReplace(gltfShape);
  const transform9 = new Transform({
    position: new Vector3(120, 0, 8),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity8.addComponentOrReplace(transform9);

  const entity9 = new Entity("entity9");
  engine.addEntity(entity9);
  entity9.setParent(_scene);
  entity9.addComponentOrReplace(gltfShape);
  const transform10 = new Transform({
    position: new Vector3(8, 0, 24),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity9.addComponentOrReplace(transform10);

  const entity10 = new Entity("entity10");
  engine.addEntity(entity10);
  entity10.setParent(_scene);
  entity10.addComponentOrReplace(gltfShape);
  const transform11 = new Transform({
    position: new Vector3(24, 0, 24),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity10.addComponentOrReplace(transform11);

  const entity11 = new Entity("entity11");
  engine.addEntity(entity11);
  entity11.setParent(_scene);
  entity11.addComponentOrReplace(gltfShape);
  const transform12 = new Transform({
    position: new Vector3(40, 0, 24),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity11.addComponentOrReplace(transform12);

  const entity12 = new Entity("entity12");
  engine.addEntity(entity12);
  entity12.setParent(_scene);
  entity12.addComponentOrReplace(gltfShape);
  const transform13 = new Transform({
    position: new Vector3(56, 0, 24),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity12.addComponentOrReplace(transform13);

  const entity13 = new Entity("entity13");
  engine.addEntity(entity13);
  entity13.setParent(_scene);
  entity13.addComponentOrReplace(gltfShape);
  const transform14 = new Transform({
    position: new Vector3(72, 0, 24),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity13.addComponentOrReplace(transform14);

  const entity14 = new Entity("entity14");
  engine.addEntity(entity14);
  entity14.setParent(_scene);
  entity14.addComponentOrReplace(gltfShape);
  const transform15 = new Transform({
    position: new Vector3(88, 0, 24),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity14.addComponentOrReplace(transform15);

  const entity15 = new Entity("entity15");
  engine.addEntity(entity15);
  entity15.setParent(_scene);
  entity15.addComponentOrReplace(gltfShape);
  const transform16 = new Transform({
    position: new Vector3(104, 0, 24),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity15.addComponentOrReplace(transform16);

  const entity16 = new Entity("entity16");
  engine.addEntity(entity16);
  entity16.setParent(_scene);
  entity16.addComponentOrReplace(gltfShape);
  const transform17 = new Transform({
    position: new Vector3(120, 0, 24),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity16.addComponentOrReplace(transform17);

  const entity17 = new Entity("entity17");
  engine.addEntity(entity17);
  entity17.setParent(_scene);
  entity17.addComponentOrReplace(gltfShape);
  const transform18 = new Transform({
    position: new Vector3(8, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity17.addComponentOrReplace(transform18);

  const entity18 = new Entity("entity18");
  engine.addEntity(entity18);
  entity18.setParent(_scene);
  entity18.addComponentOrReplace(gltfShape);
  const transform19 = new Transform({
    position: new Vector3(24, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity18.addComponentOrReplace(transform19);

  const entity19 = new Entity("entity19");
  engine.addEntity(entity19);
  entity19.setParent(_scene);
  entity19.addComponentOrReplace(gltfShape);
  const transform20 = new Transform({
    position: new Vector3(40, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity19.addComponentOrReplace(transform20);

  const entity20 = new Entity("entity20");
  engine.addEntity(entity20);
  entity20.setParent(_scene);
  entity20.addComponentOrReplace(gltfShape);
  const transform21 = new Transform({
    position: new Vector3(56, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity20.addComponentOrReplace(transform21);

  const entity21 = new Entity("entity21");
  engine.addEntity(entity21);
  entity21.setParent(_scene);
  entity21.addComponentOrReplace(gltfShape);
  const transform22 = new Transform({
    position: new Vector3(72, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity21.addComponentOrReplace(transform22);

  const entity22 = new Entity("entity22");
  engine.addEntity(entity22);
  entity22.setParent(_scene);
  entity22.addComponentOrReplace(gltfShape);
  const transform23 = new Transform({
    position: new Vector3(88, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity22.addComponentOrReplace(transform23);

  const entity23 = new Entity("entity23");
  engine.addEntity(entity23);
  entity23.setParent(_scene);
  entity23.addComponentOrReplace(gltfShape);
  const transform24 = new Transform({
    position: new Vector3(104, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity23.addComponentOrReplace(transform24);

  const entity24 = new Entity("entity24");
  engine.addEntity(entity24);
  entity24.setParent(_scene);
  entity24.addComponentOrReplace(gltfShape);
  const transform25 = new Transform({
    position: new Vector3(120, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity24.addComponentOrReplace(transform25);

  const entity25 = new Entity("entity25");
  engine.addEntity(entity25);
  entity25.setParent(_scene);
  entity25.addComponentOrReplace(gltfShape);
  const transform26 = new Transform({
    position: new Vector3(8, 0, 56),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity25.addComponentOrReplace(transform26);

  const entity26 = new Entity("entity26");
  engine.addEntity(entity26);
  entity26.setParent(_scene);
  entity26.addComponentOrReplace(gltfShape);
  const transform27 = new Transform({
    position: new Vector3(24, 0, 56),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity26.addComponentOrReplace(transform27);

  const entity27 = new Entity("entity27");
  engine.addEntity(entity27);
  entity27.setParent(_scene);
  entity27.addComponentOrReplace(gltfShape);
  const transform28 = new Transform({
    position: new Vector3(40, 0, 56),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity27.addComponentOrReplace(transform28);

  const entity28 = new Entity("entity28");
  engine.addEntity(entity28);
  entity28.setParent(_scene);
  entity28.addComponentOrReplace(gltfShape);
  const transform29 = new Transform({
    position: new Vector3(56, 0, 56),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity28.addComponentOrReplace(transform29);

  const entity29 = new Entity("entity29");
  engine.addEntity(entity29);
  entity29.setParent(_scene);
  entity29.addComponentOrReplace(gltfShape);
  const transform30 = new Transform({
    position: new Vector3(72, 0, 56),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity29.addComponentOrReplace(transform30);

  const entity30 = new Entity("entity30");
  engine.addEntity(entity30);
  entity30.setParent(_scene);
  entity30.addComponentOrReplace(gltfShape);
  const transform31 = new Transform({
    position: new Vector3(88, 0, 56),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity30.addComponentOrReplace(transform31);

  const entity31 = new Entity("entity31");
  engine.addEntity(entity31);
  entity31.setParent(_scene);
  entity31.addComponentOrReplace(gltfShape);
  const transform32 = new Transform({
    position: new Vector3(104, 0, 56),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity31.addComponentOrReplace(transform32);

  const entity32 = new Entity("entity32");
  engine.addEntity(entity32);
  entity32.setParent(_scene);
  entity32.addComponentOrReplace(gltfShape);
  const transform33 = new Transform({
    position: new Vector3(120, 0, 56),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity32.addComponentOrReplace(transform33);

  const entity33 = new Entity("entity33");
  engine.addEntity(entity33);
  entity33.setParent(_scene);
  entity33.addComponentOrReplace(gltfShape);
  const transform34 = new Transform({
    position: new Vector3(8, 0, 72),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity33.addComponentOrReplace(transform34);

  const entity34 = new Entity("entity34");
  engine.addEntity(entity34);
  entity34.setParent(_scene);
  entity34.addComponentOrReplace(gltfShape);
  const transform35 = new Transform({
    position: new Vector3(24, 0, 72),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity34.addComponentOrReplace(transform35);

  const entity35 = new Entity("entity35");
  engine.addEntity(entity35);
  entity35.setParent(_scene);
  entity35.addComponentOrReplace(gltfShape);
  const transform36 = new Transform({
    position: new Vector3(40, 0, 72),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity35.addComponentOrReplace(transform36);

  const entity36 = new Entity("entity36");
  engine.addEntity(entity36);
  entity36.setParent(_scene);
  entity36.addComponentOrReplace(gltfShape);
  const transform37 = new Transform({
    position: new Vector3(56, 0, 72),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity36.addComponentOrReplace(transform37);

  const entity37 = new Entity("entity37");
  engine.addEntity(entity37);
  entity37.setParent(_scene);
  entity37.addComponentOrReplace(gltfShape);
  const transform38 = new Transform({
    position: new Vector3(72, 0, 72),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity37.addComponentOrReplace(transform38);

  const entity38 = new Entity("entity38");
  engine.addEntity(entity38);
  entity38.setParent(_scene);
  entity38.addComponentOrReplace(gltfShape);
  const transform39 = new Transform({
    position: new Vector3(88, 0, 72),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity38.addComponentOrReplace(transform39);

  const entity39 = new Entity("entity39");
  engine.addEntity(entity39);
  entity39.setParent(_scene);
  entity39.addComponentOrReplace(gltfShape);
  const transform40 = new Transform({
    position: new Vector3(104, 0, 72),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity39.addComponentOrReplace(transform40);

  const entity40 = new Entity("entity40");
  engine.addEntity(entity40);
  entity40.setParent(_scene);
  entity40.addComponentOrReplace(gltfShape);
  const transform41 = new Transform({
    position: new Vector3(120, 0, 72),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity40.addComponentOrReplace(transform41);

  const entity41 = new Entity("entity41");
  engine.addEntity(entity41);
  entity41.setParent(_scene);
  entity41.addComponentOrReplace(gltfShape);
  const transform42 = new Transform({
    position: new Vector3(8, 0, 88),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity41.addComponentOrReplace(transform42);

  const entity42 = new Entity("entity42");
  engine.addEntity(entity42);
  entity42.setParent(_scene);
  entity42.addComponentOrReplace(gltfShape);
  const transform43 = new Transform({
    position: new Vector3(24, 0, 88),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity42.addComponentOrReplace(transform43);

  const entity43 = new Entity("entity43");
  engine.addEntity(entity43);
  entity43.setParent(_scene);
  entity43.addComponentOrReplace(gltfShape);
  const transform44 = new Transform({
    position: new Vector3(40, 0, 88),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity43.addComponentOrReplace(transform44);

  const entity44 = new Entity("entity44");
  engine.addEntity(entity44);
  entity44.setParent(_scene);
  entity44.addComponentOrReplace(gltfShape);
  const transform45 = new Transform({
    position: new Vector3(56, 0, 88),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity44.addComponentOrReplace(transform45);

  const entity45 = new Entity("entity45");
  engine.addEntity(entity45);
  entity45.setParent(_scene);
  entity45.addComponentOrReplace(gltfShape);
  const transform46 = new Transform({
    position: new Vector3(72, 0, 88),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity45.addComponentOrReplace(transform46);

  const entity46 = new Entity("entity46");
  engine.addEntity(entity46);
  entity46.setParent(_scene);
  entity46.addComponentOrReplace(gltfShape);
  const transform47 = new Transform({
    position: new Vector3(88, 0, 88),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity46.addComponentOrReplace(transform47);

  const entity47 = new Entity("entity47");
  engine.addEntity(entity47);
  entity47.setParent(_scene);
  entity47.addComponentOrReplace(gltfShape);
  const transform48 = new Transform({
    position: new Vector3(104, 0, 88),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity47.addComponentOrReplace(transform48);

  const entity48 = new Entity("entity48");
  engine.addEntity(entity48);
  entity48.setParent(_scene);
  entity48.addComponentOrReplace(gltfShape);
  const transform49 = new Transform({
    position: new Vector3(120, 0, 88),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity48.addComponentOrReplace(transform49);

  const entity49 = new Entity("entity49");
  engine.addEntity(entity49);
  entity49.setParent(_scene);
  entity49.addComponentOrReplace(gltfShape);
  const transform50 = new Transform({
    position: new Vector3(8, 0, 104),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity49.addComponentOrReplace(transform50);

  const entity50 = new Entity("entity50");
  engine.addEntity(entity50);
  entity50.setParent(_scene);
  entity50.addComponentOrReplace(gltfShape);
  const transform51 = new Transform({
    position: new Vector3(24, 0, 104),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity50.addComponentOrReplace(transform51);

  const entity51 = new Entity("entity51");
  engine.addEntity(entity51);
  entity51.setParent(_scene);
  entity51.addComponentOrReplace(gltfShape);
  const transform52 = new Transform({
    position: new Vector3(40, 0, 104),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity51.addComponentOrReplace(transform52);

  const entity52 = new Entity("entity52");
  engine.addEntity(entity52);
  entity52.setParent(_scene);
  entity52.addComponentOrReplace(gltfShape);
  const transform53 = new Transform({
    position: new Vector3(56, 0, 104),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity52.addComponentOrReplace(transform53);

  const entity53 = new Entity("entity53");
  engine.addEntity(entity53);
  entity53.setParent(_scene);
  entity53.addComponentOrReplace(gltfShape);
  const transform54 = new Transform({
    position: new Vector3(72, 0, 104),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity53.addComponentOrReplace(transform54);

  const entity54 = new Entity("entity54");
  engine.addEntity(entity54);
  entity54.setParent(_scene);
  entity54.addComponentOrReplace(gltfShape);
  const transform55 = new Transform({
    position: new Vector3(88, 0, 104),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity54.addComponentOrReplace(transform55);

  const entity55 = new Entity("entity55");
  engine.addEntity(entity55);
  entity55.setParent(_scene);
  entity55.addComponentOrReplace(gltfShape);
  const transform56 = new Transform({
    position: new Vector3(104, 0, 104),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity55.addComponentOrReplace(transform56);

  const entity56 = new Entity("entity56");
  engine.addEntity(entity56);
  entity56.setParent(_scene);
  entity56.addComponentOrReplace(gltfShape);
  const transform57 = new Transform({
    position: new Vector3(120, 0, 104),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity56.addComponentOrReplace(transform57);

  const entity57 = new Entity("entity57");
  engine.addEntity(entity57);
  entity57.setParent(_scene);
  entity57.addComponentOrReplace(gltfShape);
  const transform58 = new Transform({
    position: new Vector3(8, 0, 120),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity57.addComponentOrReplace(transform58);

  const entity58 = new Entity("entity58");
  engine.addEntity(entity58);
  entity58.setParent(_scene);
  entity58.addComponentOrReplace(gltfShape);
  const transform59 = new Transform({
    position: new Vector3(24, 0, 120),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity58.addComponentOrReplace(transform59);

  const entity59 = new Entity("entity59");
  engine.addEntity(entity59);
  entity59.setParent(_scene);
  entity59.addComponentOrReplace(gltfShape);
  const transform60 = new Transform({
    position: new Vector3(40, 0, 120),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity59.addComponentOrReplace(transform60);

  const entity60 = new Entity("entity60");
  engine.addEntity(entity60);
  entity60.setParent(_scene);
  entity60.addComponentOrReplace(gltfShape);
  const transform61 = new Transform({
    position: new Vector3(56, 0, 120),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity60.addComponentOrReplace(transform61);

  const entity61 = new Entity("entity61");
  engine.addEntity(entity61);
  entity61.setParent(_scene);
  entity61.addComponentOrReplace(gltfShape);
  const transform62 = new Transform({
    position: new Vector3(72, 0, 120),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity61.addComponentOrReplace(transform62);

  const entity62 = new Entity("entity62");
  engine.addEntity(entity62);
  entity62.setParent(_scene);
  entity62.addComponentOrReplace(gltfShape);
  const transform63 = new Transform({
    position: new Vector3(88, 0, 120),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity62.addComponentOrReplace(transform63);

  const entity63 = new Entity("entity63");
  engine.addEntity(entity63);
  entity63.setParent(_scene);
  entity63.addComponentOrReplace(gltfShape);
  const transform64 = new Transform({
    position: new Vector3(104, 0, 120),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity63.addComponentOrReplace(transform64);

  const entity64 = new Entity("entity64");
  engine.addEntity(entity64);
  entity64.setParent(_scene);
  entity64.addComponentOrReplace(gltfShape);
  const transform65 = new Transform({
    position: new Vector3(120, 0, 120),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  entity64.addComponentOrReplace(transform65);

  const bbqgrill = new Entity("bbqgrill");
  engine.addEntity(bbqgrill);
  bbqgrill.setParent(_scene);
  const transform66 = new Transform({
    position: new Vector3(71, 16.22251319885254, 67),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  bbqgrill.addComponentOrReplace(transform66);
  const gltfShape2 = new GLTFShape(
    "6332ad78-badb-481f-9122-481228206e8c/BBQGrill.glb"
  );
  gltfShape2.withCollisions = true;
  gltfShape2.isPointerBlocker = true;
  gltfShape2.visible = true;
  bbqgrill.addComponentOrReplace(gltfShape2);

  const bbqgrillchair = new Entity("bbqgrillchair");
  engine.addEntity(bbqgrillchair);
  bbqgrillchair.setParent(_scene);
  const transform67 = new Transform({
    position: new Vector3(69.5, 16.199254989624023, 69.5),
    rotation: new Quaternion(
      4.582643062223633e-15,
      -0.9238795638084412,
      1.1013501932666259e-7,
      -0.3826834559440613
    ),
    scale: new Vector3(1.0000004768371582, 1, 1.0000004768371582),
  });
  bbqgrillchair.addComponentOrReplace(transform67);
  const gltfShape3 = new GLTFShape(
    "9ca08d47-2784-4a7f-a446-0f1761a8cb46/BBQGrillChair.glb"
  );
  gltfShape3.withCollisions = true;
  gltfShape3.isPointerBlocker = true;
  gltfShape3.visible = true;
  bbqgrillchair.addComponentOrReplace(gltfShape3);

  const plantpot = new Entity("plantpot");
  engine.addEntity(plantpot);
  plantpot.setParent(_scene);
  const transform68 = new Transform({
    position: new Vector3(
      83.32220458984375,
      2.1964447498321533,
      79.39427947998047
    ),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  plantpot.addComponentOrReplace(transform68);
  const gltfShape4 = new GLTFShape(
    "8598d36a-56d0-4d86-a5e3-9169d5ee83db/PlantPot01.glb"
  );
  gltfShape4.withCollisions = true;
  gltfShape4.isPointerBlocker = true;
  gltfShape4.visible = true;
  plantpot.addComponentOrReplace(gltfShape4);

  const exteriorfireplace = new Entity("exteriorfireplace");
  engine.addEntity(exteriorfireplace);
  exteriorfireplace.setParent(_scene);
  const transform69 = new Transform({
    position: new Vector3(
      57.17918014526367,
      0.25685545802116394,
      72.4816665649414
    ),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  exteriorfireplace.addComponentOrReplace(transform69);
  const gltfShape5 = new GLTFShape(
    "5cd61c06-2652-49bb-868b-d85d25107e41/ExteriorFireplace.glb"
  );
  gltfShape5.withCollisions = true;
  gltfShape5.isPointerBlocker = true;
  gltfShape5.visible = true;
  exteriorfireplace.addComponentOrReplace(gltfShape5);

  const beanbagchair = new Entity("beanbagchair");
  engine.addEntity(beanbagchair);
  beanbagchair.setParent(_scene);
  const transform70 = new Transform({
    position: new Vector3(72.5, 2.2021279335021973, 70.5),
    rotation: new Quaternion(
      -4.977343474985192e-15,
      -0.8819213509559631,
      1.0513321058169822e-7,
      0.4713967442512512
    ),
    scale: new Vector3(1.0000009536743164, 1, 1.0000009536743164),
  });
  beanbagchair.addComponentOrReplace(transform70);
  const gltfShape6 = new GLTFShape(
    "245c9208-821c-47bb-8450-a713a7a6822d/BeanBagChair.glb"
  );
  gltfShape6.withCollisions = true;
  gltfShape6.isPointerBlocker = true;
  gltfShape6.visible = true;
  beanbagchair.addComponentOrReplace(gltfShape6);

  const desk = new Entity("desk");
  engine.addEntity(desk);
  desk.setParent(_scene);
  const transform71 = new Transform({
    position: new Vector3(71, 9.144721984863281, 77),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  desk.addComponentOrReplace(transform71);
  const gltfShape7 = new GLTFShape(
    "6e35180b-e431-433e-9a8a-25c59563aa8b/desk.glb"
  );
  gltfShape7.withCollisions = true;
  gltfShape7.isPointerBlocker = true;
  gltfShape7.visible = true;
  desk.addComponentOrReplace(gltfShape7);

  const deskchair = new Entity("deskchair");
  engine.addEntity(deskchair);
  deskchair.setParent(_scene);
  const transform72 = new Transform({
    position: new Vector3(72.20053100585938, 9.206462860107422, 76.28662109375),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  deskchair.addComponentOrReplace(transform72);
  const gltfShape8 = new GLTFShape(
    "6bc59ac2-8c1c-44bd-8375-c1d17023b360/deskChair.glb"
  );
  gltfShape8.withCollisions = true;
  gltfShape8.isPointerBlocker = true;
  gltfShape8.visible = true;
  deskchair.addComponentOrReplace(gltfShape8);

  const lamppostbig = new Entity("lamppostbig");
  engine.addEntity(lamppostbig);
  lamppostbig.setParent(_scene);
  const transform73 = new Transform({
    position: new Vector3(75.5, 1.1209774017333984, 100),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  lamppostbig.addComponentOrReplace(transform73);
  const gltfShape9 = new GLTFShape(
    "d60a9476-1d42-43a1-b881-800ffab3558c/LampPostBig.glb"
  );
  gltfShape9.withCollisions = true;
  gltfShape9.isPointerBlocker = true;
  gltfShape9.visible = true;
  lamppostbig.addComponentOrReplace(gltfShape9);

  const lightstick = new Entity("lightstick");
  engine.addEntity(lightstick);
  lightstick.setParent(_scene);
  const transform74 = new Transform({
    position: new Vector3(20, 0.17571532726287842, 43.5),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  lightstick.addComponentOrReplace(transform74);
  const gltfShape10 = new GLTFShape(
    "f9b7c5e6-f06a-403a-9155-b698d3a8c207/LightStick.glb"
  );
  gltfShape10.withCollisions = true;
  gltfShape10.isPointerBlocker = true;
  gltfShape10.visible = true;
  lightstick.addComponentOrReplace(gltfShape10);

  const parasol = new Entity("parasol");
  engine.addEntity(parasol);
  parasol.setParent(_scene);
  const transform75 = new Transform({
    position: new Vector3(
      44.38507080078125,
      1.033503532409668,
      85.12332916259766
    ),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  parasol.addComponentOrReplace(transform75);
  const gltfShape11 = new GLTFShape(
    "13d668f5-f090-466f-8fad-7376805a2b29/Parasol.glb"
  );
  gltfShape11.withCollisions = true;
  gltfShape11.isPointerBlocker = true;
  gltfShape11.visible = true;
  parasol.addComponentOrReplace(gltfShape11);

  const parasol2 = new Entity("parasol2");
  engine.addEntity(parasol2);
  parasol2.setParent(_scene);
  parasol2.addComponentOrReplace(gltfShape11);
  const transform76 = new Transform({
    position: new Vector3(53.5, 1.033503532409668, 85.5),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  parasol2.addComponentOrReplace(transform76);

  const patiochair = new Entity("patiochair");
  engine.addEntity(patiochair);
  patiochair.setParent(_scene);
  const transform77 = new Transform({
    position: new Vector3(53.5, 1.0345242023468018, 84),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  patiochair.addComponentOrReplace(transform77);
  const gltfShape12 = new GLTFShape(
    "bb8b91ab-0eda-4eba-9098-33228f60d2f2/PatioChair.glb"
  );
  gltfShape12.withCollisions = true;
  gltfShape12.isPointerBlocker = true;
  gltfShape12.visible = true;
  patiochair.addComponentOrReplace(gltfShape12);

  const patiosofa = new Entity("patiosofa");
  engine.addEntity(patiosofa);
  patiosofa.setParent(_scene);
  const transform78 = new Transform({
    position: new Vector3(
      53.44672393798828,
      0.9876352548599243,
      48.462799072265625
    ),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  patiosofa.addComponentOrReplace(transform78);
  const gltfShape13 = new GLTFShape(
    "1fd4e337-8539-45b8-b5e3-b0220f1a1196/PatioSofa.glb"
  );
  gltfShape13.withCollisions = true;
  gltfShape13.isPointerBlocker = true;
  gltfShape13.visible = true;
  patiosofa.addComponentOrReplace(gltfShape13);

  const patiotable = new Entity("patiotable");
  engine.addEntity(patiotable);
  patiotable.setParent(_scene);
  const transform79 = new Transform({
    position: new Vector3(
      53.08806610107422,
      1.0262256860733032,
      48.4055290222168
    ),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  patiotable.addComponentOrReplace(transform79);
  const gltfShape14 = new GLTFShape(
    "51e2a2c3-0658-4360-8a39-0ca6028d8f90/PatioTable.glb"
  );
  gltfShape14.withCollisions = true;
  gltfShape14.isPointerBlocker = true;
  gltfShape14.visible = true;
  patiotable.addComponentOrReplace(gltfShape14);

  const pooltoy = new Entity("pooltoy");
  engine.addEntity(pooltoy);
  pooltoy.setParent(_scene);
  const transform80 = new Transform({
    position: new Vector3(49.5, 1, 59),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  pooltoy.addComponentOrReplace(transform80);
  const gltfShape15 = new GLTFShape(
    "22cb8b53-c47b-46d9-8a2d-5ae886a63d07/PoolToy01.glb"
  );
  gltfShape15.withCollisions = true;
  gltfShape15.isPointerBlocker = true;
  gltfShape15.visible = true;
  pooltoy.addComponentOrReplace(gltfShape15);

  const pooltoy2 = new Entity("pooltoy2");
  engine.addEntity(pooltoy2);
  pooltoy2.setParent(_scene);
  const transform81 = new Transform({
    position: new Vector3(48.25025177001953, 1, 54.3770637512207),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  pooltoy2.addComponentOrReplace(transform81);
  const gltfShape16 = new GLTFShape(
    "13c8a34a-70eb-4061-ada7-b4248c4f5c55/PoolToy02.glb"
  );
  gltfShape16.withCollisions = true;
  gltfShape16.isPointerBlocker = true;
  gltfShape16.visible = true;
  pooltoy2.addComponentOrReplace(gltfShape16);

  const pooltoy3 = new Entity("pooltoy3");
  engine.addEntity(pooltoy3);
  pooltoy3.setParent(_scene);
  const transform82 = new Transform({
    position: new Vector3(62, 1, 51.5),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  pooltoy3.addComponentOrReplace(transform82);
  const gltfShape17 = new GLTFShape(
    "70e16e66-933d-4aa1-ae59-68a024c0038d/PoolToy03.glb"
  );
  gltfShape17.withCollisions = true;
  gltfShape17.isPointerBlocker = true;
  gltfShape17.visible = true;
  pooltoy3.addComponentOrReplace(gltfShape17);

  const pooltoy4 = new Entity("pooltoy4");
  engine.addEntity(pooltoy4);
  pooltoy4.setParent(_scene);
  const transform83 = new Transform({
    position: new Vector3(79, 1, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  pooltoy4.addComponentOrReplace(transform83);
  pooltoy4.addComponentOrReplace(gltfShape16);

  const pooltoy5 = new Entity("pooltoy5");
  engine.addEntity(pooltoy5);
  pooltoy5.setParent(_scene);
  const transform84 = new Transform({
    position: new Vector3(72, 1, 39.5),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  pooltoy5.addComponentOrReplace(transform84);
  pooltoy5.addComponentOrReplace(gltfShape15);

  const pooltoy6 = new Entity("pooltoy6");
  engine.addEntity(pooltoy6);
  pooltoy6.setParent(_scene);
  const transform85 = new Transform({
    position: new Vector3(85, 1, 46.5),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  pooltoy6.addComponentOrReplace(transform85);
  pooltoy6.addComponentOrReplace(gltfShape17);

  const vase = new Entity("vase");
  engine.addEntity(vase);
  vase.setParent(_scene);
  const transform86 = new Transform({
    position: new Vector3(83, 2.1701314449310303, 55),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  vase.addComponentOrReplace(transform86);
  const gltfShape18 = new GLTFShape(
    "a03b320d-cce7-4c6a-828f-b13f258f763c/Vase01.glb"
  );
  gltfShape18.withCollisions = true;
  gltfShape18.isPointerBlocker = true;
  gltfShape18.visible = true;
  vase.addComponentOrReplace(gltfShape18);

  const vase2 = new Entity("vase2");
  engine.addEntity(vase2);
  vase2.setParent(_scene);
  const transform87 = new Transform({
    position: new Vector3(81.5, 2.2120234966278076, 55),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  vase2.addComponentOrReplace(transform87);
  const gltfShape19 = new GLTFShape(
    "1c11ce94-8d3c-4325-9561-d0819a39311d/Vase03.glb"
  );
  gltfShape19.withCollisions = true;
  gltfShape19.isPointerBlocker = true;
  gltfShape19.visible = true;
  vase2.addComponentOrReplace(gltfShape19);

  const vase3 = new Entity("vase3");
  engine.addEntity(vase3);
  vase3.setParent(_scene);
  const transform88 = new Transform({
    position: new Vector3(
      82.23187255859375,
      2.2282819747924805,
      54.0399055480957
    ),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  vase3.addComponentOrReplace(transform88);
  const gltfShape20 = new GLTFShape(
    "d762cafa-22bc-4869-b52a-43a5601a363e/Vase02.glb"
  );
  gltfShape20.withCollisions = true;
  gltfShape20.isPointerBlocker = true;
  gltfShape20.visible = true;
  vase3.addComponentOrReplace(gltfShape20);

  const pooltoy7 = new Entity("pooltoy7");
  engine.addEntity(pooltoy7);
  pooltoy7.setParent(_scene);
  const transform89 = new Transform({
    position: new Vector3(29, 0.8005578517913818, 96),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  pooltoy7.addComponentOrReplace(transform89);
  pooltoy7.addComponentOrReplace(gltfShape15);

  const pooltoy8 = new Entity("pooltoy8");
  engine.addEntity(pooltoy8);
  pooltoy8.setParent(_scene);
  const transform90 = new Transform({
    position: new Vector3(38.92598342895508, 1, 92.88152313232422),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  pooltoy8.addComponentOrReplace(transform90);
  pooltoy8.addComponentOrReplace(gltfShape16);

  const readingLamp = new Entity("readingLamp");
  engine.addEntity(readingLamp);
  readingLamp.setParent(_scene);
  const transform91 = new Transform({
    position: new Vector3(89, 9.192527770996094, 79.5),
    rotation: new Quaternion(
      -2.220446049250313e-16,
      -0.3826834559440613,
      4.561941935321556e-8,
      0.9238795638084412
    ),
    scale: new Vector3(1, 1, 1),
  });
  readingLamp.addComponentOrReplace(transform91);
  const gltfShape21 = new GLTFShape(
    "36d4db0e-5aec-4c50-903c-9381dca31df9/Reading_Lamp.glb"
  );
  gltfShape21.withCollisions = true;
  gltfShape21.isPointerBlocker = true;
  gltfShape21.visible = true;
  readingLamp.addComponentOrReplace(gltfShape21);

  const beanbagchair2 = new Entity("beanbagchair2");
  engine.addEntity(beanbagchair2);
  beanbagchair2.setParent(_scene);
  beanbagchair2.addComponentOrReplace(gltfShape6);
  const transform92 = new Transform({
    position: new Vector3(89, 9.153764724731445, 78),
    rotation: new Quaternion(
      -6.65064594497863e-16,
      -0.4713967442512512,
      5.6194867426029305e-8,
      0.8819212913513184
    ),
    scale: new Vector3(1, 1, 1),
  });
  beanbagchair2.addComponentOrReplace(transform92);

  const speakersset = new Entity("speakersset");
  engine.addEntity(speakersset);
  speakersset.setParent(_scene);
  const transform93 = new Transform({
    position: new Vector3(74.5, 2.199857711791992, 59.61174392700195),
    rotation: new Quaternion(
      0,
      0.0980171412229538,
      -1.1684551992630077e-8,
      0.9951847195625305
    ),
    scale: new Vector3(0.9999999403953552, 1, 0.9999999403953552),
  });
  speakersset.addComponentOrReplace(transform93);
  const gltfShape22 = new GLTFShape(
    "c6b8af7c-0f4e-43bd-8966-c0a7e4ffc078/SpeakersSet.glb"
  );
  gltfShape22.withCollisions = true;
  gltfShape22.isPointerBlocker = true;
  gltfShape22.visible = true;
  speakersset.addComponentOrReplace(gltfShape22);

  const speakersset2 = new Entity("speakersset2");
  engine.addEntity(speakersset2);
  speakersset2.setParent(_scene);
  speakersset2.addComponentOrReplace(gltfShape22);
  const transform94 = new Transform({
    position: new Vector3(
      83.89503479003906,
      2.199857711791992,
      59.61174392700195
    ),
    rotation: new Quaternion(
      0,
      -0.0980171412229538,
      1.1684551992630077e-8,
      0.9951847195625305
    ),
    scale: new Vector3(0.9999999403953552, 1, 0.9999999403953552),
  });
  speakersset2.addComponentOrReplace(transform94);

  const plantpot2 = new Entity("plantpot2");
  engine.addEntity(plantpot2);
  plantpot2.setParent(_scene);
  const transform95 = new Transform({
    position: new Vector3(
      75.40693664550781,
      2.2096567153930664,
      54.92110824584961
    ),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  plantpot2.addComponentOrReplace(transform95);
  plantpot2.addComponentOrReplace(gltfShape4);

  const plantpot3 = new Entity("plantpot3");
  engine.addEntity(plantpot3);
  plantpot3.setParent(_scene);
  plantpot3.addComponentOrReplace(gltfShape4);
  const transform96 = new Transform({
    position: new Vector3(
      69.23030090332031,
      2.2096567153930664,
      54.80204772949219
    ),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  plantpot3.addComponentOrReplace(transform96);

  const patiochair2 = new Entity("patiochair2");
  engine.addEntity(patiochair2);
  patiochair2.setParent(_scene);
  patiochair2.addComponentOrReplace(gltfShape12);
  const transform97 = new Transform({
    position: new Vector3(
      46.82504653930664,
      1.0345242023468018,
      85.82087707519531
    ),
    rotation: new Quaternion(
      3.912480758751398e-15,
      -0.9569403529167175,
      1.1407617250824842e-7,
      0.2902847230434418
    ),
    scale: new Vector3(1.000001072883606, 1, 1.000001072883606),
  });
  patiochair2.addComponentOrReplace(transform97);

  const parasol3 = new Entity("parasol3");
  engine.addEntity(parasol3);
  parasol3.setParent(_scene);
  parasol3.addComponentOrReplace(gltfShape11);
  const transform98 = new Transform({
    position: new Vector3(
      54.65807342529297,
      1.0335044860839844,
      44.67075729370117
    ),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  parasol3.addComponentOrReplace(transform98);

  const parasol4 = new Entity("parasol4");
  engine.addEntity(parasol4);
  parasol4.setParent(_scene);
  parasol4.addComponentOrReplace(gltfShape11);
  const transform99 = new Transform({
    position: new Vector3(
      49.67152786254883,
      1.0335044860839844,
      49.27376174926758
    ),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  parasol4.addComponentOrReplace(transform99);

  const patiochair3 = new Entity("patiochair3");
  engine.addEntity(patiochair3);
  patiochair3.setParent(_scene);
  patiochair3.addComponentOrReplace(gltfShape12);
  const transform100 = new Transform({
    position: new Vector3(
      60.97863006591797,
      1.0345242023468018,
      43.14342498779297
    ),
    rotation: new Quaternion(
      0,
      0.2902846932411194,
      -3.4604628496026635e-8,
      0.9569403529167175
    ),
    scale: new Vector3(1, 1, 1),
  });
  patiochair3.addComponentOrReplace(transform100);

  const twitterLink = new Entity("twitterLink");
  engine.addEntity(twitterLink);
  twitterLink.setParent(_scene);
  const transform101 = new Transform({
    position: new Vector3(
      70.96798706054688,
      10.029446601867676,
      78.02629852294922
    ),
    rotation: new Quaternion(
      -1.9663483411726398e-16,
      -0.5555702447891235,
      6.622912707143769e-8,
      0.8314696550369263
    ),
    scale: new Vector3(0.5000002980232239, 0.5, 0.5000002980232239),
  });
  twitterLink.addComponentOrReplace(transform101);

  const instagramLink = new Entity("instagramLink");
  engine.addEntity(instagramLink);
  instagramLink.setParent(_scene);
  const transform102 = new Transform({
    position: new Vector3(
      70.78724670410156,
      10.039101600646973,
      76.5059814453125
    ),
    rotation: new Quaternion(
      7.96227805198869e-16,
      -0.7071068286895752,
      8.429368847373553e-8,
      0.7071067690849304
    ),
    scale: new Vector3(0.5, 0.5, 0.5),
  });
  instagramLink.addComponentOrReplace(transform102);

  const discordLink = new Entity("discordLink");
  engine.addEntity(discordLink);
  discordLink.setParent(_scene);
  const transform103 = new Transform({
    position: new Vector3(
      70.79878997802734,
      10.049365043640137,
      77.15196228027344
    ),
    rotation: new Quaternion(
      1.9771354116350417e-15,
      0.7071068286895752,
      -8.429369557916289e-8,
      -0.7071068286895752
    ),
    scale: new Vector3(0.5000004768371582, 0.5, 0.5000004768371582),
  });
  discordLink.addComponentOrReplace(transform103);

  const youtubeLink = new Entity("youtubeLink");
  engine.addEntity(youtubeLink);
  youtubeLink.setParent(_scene);
  const transform104 = new Transform({
    position: new Vector3(
      70.9446792602539,
      10.025341987609863,
      75.65637969970703
    ),
    rotation: new Quaternion(
      -3.318958843379679e-15,
      0.7730104923248291,
      -9.215000318363309e-8,
      -0.6343932747840881
    ),
    scale: new Vector3(0.5000002980232239, 0.5, 0.5000002980232239),
  });
  youtubeLink.addComponentOrReplace(transform104);

  const beanbagchair3 = new Entity("beanbagchair3");
  engine.addEntity(beanbagchair3);
  beanbagchair3.setParent(_scene);
  beanbagchair3.addComponentOrReplace(gltfShape6);
  const transform105 = new Transform({
    position: new Vector3(71.5, 2.2021279335021973, 66.5),
    rotation: new Quaternion(
      4.100738489959876e-15,
      0.7730104923248291,
      -9.21500173944878e-8,
      0.6343933343887329
    ),
    scale: new Vector3(1.000003457069397, 1, 1.000003457069397),
  });
  beanbagchair3.addComponentOrReplace(transform105);

  const beanbagchair4 = new Entity("beanbagchair4");
  engine.addEntity(beanbagchair4);
  beanbagchair4.setParent(_scene);
  beanbagchair4.addComponentOrReplace(gltfShape6);
  const transform106 = new Transform({
    position: new Vector3(
      70.01290130615234,
      2.2021279335021973,
      69.03734588623047
    ),
    rotation: new Quaternion(
      8.172021409178984e-15,
      0.9891542196273804,
      -1.1791635756708274e-7,
      -0.14688116312026978
    ),
    scale: new Vector3(1.000004768371582, 1, 1.000004768371582),
  });
  beanbagchair4.addComponentOrReplace(transform106);

  const djdecktable2 = new Entity("djdecktable2");
  engine.addEntity(djdecktable2);
  djdecktable2.setParent(_scene);
  const transform107 = new Transform({
    position: new Vector3(
      79.34882354736328,
      3.198575019836426,
      76.13500213623047
    ),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  djdecktable2.addComponentOrReplace(transform107);
  const gltfShape23 = new GLTFShape(
    "8e5560c8-3e84-4e16-bb75-013ae5b779df/DJdeckTable.glb"
  );
  gltfShape23.withCollisions = true;
  gltfShape23.isPointerBlocker = true;
  gltfShape23.visible = true;
  djdecktable2.addComponentOrReplace(gltfShape23);

  const imageFromURL2 = new Entity("imageFromURL2");
  engine.addEntity(imageFromURL2);
  imageFromURL2.setParent(_scene);
  const transform108 = new Transform({
    position: new Vector3(
      84.43685150146484,
      10.74496078491211,
      80.86945343017578
    ),
    rotation: new Quaternion(
      7.607008081713003e-15,
      -1,
      1.1920926823449918e-7,
      -2.9802322387695312e-8
    ),
    scale: new Vector3(2.5, 2.5, 2.5),
  });
  imageFromURL2.addComponentOrReplace(transform108);

  const imageFromURL3 = new Entity("imageFromURL3");
  engine.addEntity(imageFromURL3);
  imageFromURL3.setParent(_scene);
  const transform109 = new Transform({
    position: new Vector3(
      76.82502746582031,
      10.74496078491211,
      80.86945343017578
    ),
    rotation: new Quaternion(
      7.607008081713003e-15,
      -1,
      1.1920926823449918e-7,
      -2.9802322387695312e-8
    ),
    scale: new Vector3(2.5, 2.5, 2.5),
  });
  imageFromURL3.addComponentOrReplace(transform109);

  const imageFromURL4 = new Entity("imageFromURL4");
  engine.addEntity(imageFromURL4);
  imageFromURL4.setParent(_scene);
  const transform110 = new Transform({
    position: new Vector3(
      91.1238784790039,
      10.74496078491211,
      79.04407501220703
    ),
    rotation: new Quaternion(
      -1.7264598225433941e-15,
      -0.7071068286895752,
      8.429368136830817e-8,
      0.7071068286895752
    ),
    scale: new Vector3(2.5, 2.5, 2.5),
  });
  imageFromURL4.addComponentOrReplace(transform110);

  const imageFromURL5 = new Entity("imageFromURL5");
  engine.addEntity(imageFromURL5);
  imageFromURL5.setParent(_scene);
  const transform111 = new Transform({
    position: new Vector3(
      91.09549713134766,
      9.93840503692627,
      61.84138488769531
    ),
    rotation: new Quaternion(
      -1.7264598225433941e-15,
      -0.7071068286895752,
      8.429368136830817e-8,
      0.7071068286895752
    ),
    scale: new Vector3(4.406743049621582, 4.40673828125, 3.0438742637634277),
  });
  imageFromURL5.addComponentOrReplace(transform111);

  const imageFromURL6 = new Entity("imageFromURL6");
  engine.addEntity(imageFromURL6);
  imageFromURL6.setParent(_scene);
  const transform112 = new Transform({
    position: new Vector3(
      78.72247314453125,
      3.983041286468506,
      78.33039855957031
    ),
    rotation: new Quaternion(
      7.607008081713003e-15,
      -1,
      1.1920926823449918e-7,
      -2.9802322387695312e-8
    ),
    scale: new Vector3(2.5, 2.5, 2.5),
  });
  imageFromURL6.addComponentOrReplace(transform112);

  const imageFromURL7 = new Entity("imageFromURL7");
  engine.addEntity(imageFromURL7);
  imageFromURL7.setParent(_scene);
  const transform113 = new Transform({
    position: new Vector3(
      91.32524871826172,
      3.282630681991577,
      71.21465301513672
    ),
    rotation: new Quaternion(
      -1.7264598225433941e-15,
      -0.7071068286895752,
      8.429368136830817e-8,
      0.7071068286895752
    ),
    scale: new Vector3(
      3.5800387859344482,
      3.580036163330078,
      3.5800387859344482
    ),
  });
  imageFromURL7.addComponentOrReplace(transform113);

  const videoStream = new Entity("videoStream");
  engine.addEntity(videoStream);
  videoStream.setParent(_scene);
  const transform114 = new Transform({
    position: new Vector3(
      79.05701446533203,
      3.155240058898926,
      59.07041931152344
    ),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(2.594082832336426, 2.594082832336426, 2.594082832336426),
  });
  videoStream.addComponentOrReplace(transform114);

  const radio = new Entity("radio");
  engine.addEntity(radio);
  radio.setParent(_scene);
  const transform115 = new Transform({
    position: new Vector3(
      79.37799072265625,
      2.8664255142211914,
      59.69272232055664
    ),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  radio.addComponentOrReplace(transform115);

  const plantaqua = new Entity("plantaqua");
  engine.addEntity(plantaqua);
  plantaqua.setParent(_scene);
  const transform116 = new Transform({
    position: new Vector3(71.5, 0.7238188982009888, 84.3400650024414),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  plantaqua.addComponentOrReplace(transform116);
  const gltfShape24 = new GLTFShape(
    "98c1d499-072c-4791-bed5-9c9234dd0c3b/PlantAqua04.glb"
  );
  gltfShape24.withCollisions = true;
  gltfShape24.isPointerBlocker = true;
  gltfShape24.visible = true;
  plantaqua.addComponentOrReplace(gltfShape24);

  const waterdrop = new Entity("waterdrop");
  engine.addEntity(waterdrop);
  waterdrop.setParent(_scene);
  const transform117 = new Transform({
    position: new Vector3(89, 0.971562385559082, 42.07074737548828),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(4.147838592529297, 4.147838592529297, 4.147838592529297),
  });
  waterdrop.addComponentOrReplace(transform117);
  const gltfShape25 = new GLTFShape(
    "487274ac-e0ac-4a4d-847e-fa92849a8e8c/waterDrop.glb"
  );
  gltfShape25.withCollisions = true;
  gltfShape25.isPointerBlocker = true;
  gltfShape25.visible = true;
  waterdrop.addComponentOrReplace(gltfShape25);

  const plantpot4 = new Entity("plantpot4");
  engine.addEntity(plantpot4);
  plantpot4.setParent(_scene);
  plantpot4.addComponentOrReplace(gltfShape4);
  const transform118 = new Transform({
    position: new Vector3(
      89.6281509399414,
      2.1964447498321533,
      79.35304260253906
    ),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  plantpot4.addComponentOrReplace(transform118);

  const waterfallvolume = new Entity("waterfallvolume");
  engine.addEntity(waterfallvolume);
  waterfallvolume.setParent(_scene);
  const transform119 = new Transform({
    position: new Vector3(89.41158294677734, 0.5971951484680176, 44),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 0.855451762676239, 1),
  });
  waterfallvolume.addComponentOrReplace(transform119);
  const gltfShape26 = new GLTFShape(
    "f1330e34-528f-462d-a291-30e4f84ad25b/waterFallVolume.glb"
  );
  gltfShape26.withCollisions = true;
  gltfShape26.isPointerBlocker = true;
  gltfShape26.visible = true;
  waterfallvolume.addComponentOrReplace(gltfShape26);

  const waterfall = new Entity("waterfall");
  engine.addEntity(waterfall);
  waterfall.setParent(_scene);
  const transform120 = new Transform({
    position: new Vector3(
      89.24787902832031,
      0.3814878463745117,
      42.19752502441406
    ),
    rotation: new Quaternion(0, 0, 0.7071068286895752, 0.7071068286895752),
    scale: new Vector3(
      10.849454879760742,
      1.000002384185791,
      3.7450027465820312
    ),
  });
  waterfall.addComponentOrReplace(transform120);
  const gltfShape27 = new GLTFShape(
    "e2b82643-94ae-4317-8fcc-0a6bd9763afa/waterFall.glb"
  );
  gltfShape27.withCollisions = true;
  gltfShape27.isPointerBlocker = true;
  gltfShape27.visible = true;
  waterfall.addComponentOrReplace(gltfShape27);

  const waterdrop2 = new Entity("waterdrop2");
  engine.addEntity(waterdrop2);
  waterdrop2.setParent(_scene);
  waterdrop2.addComponentOrReplace(gltfShape25);
  const transform121 = new Transform({
    position: new Vector3(89, 0.971562385559082, 46.5),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(4.147838592529297, 4.147838592529297, 4.147838592529297),
  });
  waterdrop2.addComponentOrReplace(transform121);

  const lamppostbig2 = new Entity("lamppostbig2");
  engine.addEntity(lamppostbig2);
  lamppostbig2.setParent(_scene);
  lamppostbig2.addComponentOrReplace(gltfShape9);
  const transform122 = new Transform({
    position: new Vector3(96.79669952392578, 1.1209774017333984, 100),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  lamppostbig2.addComponentOrReplace(transform122);

  const bbqgrillchair2 = new Entity("bbqgrillchair2");
  engine.addEntity(bbqgrillchair2);
  bbqgrillchair2.setParent(_scene);
  bbqgrillchair2.addComponentOrReplace(gltfShape3);
  const transform123 = new Transform({
    position: new Vector3(69.5, 16.199254989624023, 64.5),
    rotation: new Quaternion(
      -3.4038635201883187e-15,
      0.9238795042037964,
      -1.1013500511580787e-7,
      -0.3826834559440613
    ),
    scale: new Vector3(1.0000007152557373, 1, 1.0000007152557373),
  });
  bbqgrillchair2.addComponentOrReplace(transform123);

  const fireparticles = new Entity("fireparticles");
  engine.addEntity(fireparticles);
  fireparticles.setParent(_scene);
  const transform124 = new Transform({
    position: new Vector3(57.230167388916016, 0.46891701221466064, 72.5),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(0.84478759765625, 0.84478759765625, 0.84478759765625),
  });
  fireparticles.addComponentOrReplace(transform124);
  const gltfShape28 = new GLTFShape(
    "5d7469b2-3cc0-4960-af4b-53a461940545/fireParticles.glb"
  );
  gltfShape28.withCollisions = true;
  gltfShape28.isPointerBlocker = true;
  gltfShape28.visible = true;
  fireparticles.addComponentOrReplace(gltfShape28);

  const fireparticles2 = new Entity("fireparticles2");
  engine.addEntity(fireparticles2);
  fireparticles2.setParent(_scene);
  fireparticles2.addComponentOrReplace(gltfShape28);
  const transform125 = new Transform({
    position: new Vector3(
      84.48617553710938,
      2.765345811843872,
      68.53019714355469
    ),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(
      0.5424617528915405,
      0.5424617528915405,
      0.5424617528915405
    ),
  });
  fireparticles2.addComponentOrReplace(transform125);

  const clickArea = new Entity("clickArea");
  engine.addEntity(clickArea);
  clickArea.setParent(_scene);
  const transform126 = new Transform({
    position: new Vector3(84.5, 2.7805652618408203, 68.5),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1.6182830333709717, 1, 1.5896059274673462),
  });
  clickArea.addComponentOrReplace(transform126);

  const toolbox = new Entity("toolbox");
  engine.addEntity(toolbox);
  toolbox.setParent(_scene);
  const transform127 = new Transform({
    position: new Vector3(85, 2.0255794525146484, 70.5),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  toolbox.addComponentOrReplace(transform127);

  const clickArea2 = new Entity("clickArea2");
  engine.addEntity(clickArea2);
  clickArea2.setParent(_scene);
  const transform128 = new Transform({
    position: new Vector3(84.5, 2.7334210872650146, 68.5),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  clickArea2.addComponentOrReplace(transform128);

  const clickArea3 = new Entity("clickArea3");
  engine.addEntity(clickArea3);
  clickArea3.setParent(_scene);
  const transform129 = new Transform({
    position: new Vector3(57.17389678955078, 0.6095948219299316, 72.5),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(
      0.4843045771121979,
      0.30525603890419006,
      0.47572237253189087
    ),
  });
  clickArea3.addComponentOrReplace(transform129);

  const clickArea4 = new Entity("clickArea4");
  engine.addEntity(clickArea4);
  clickArea4.setParent(_scene);
  const transform130 = new Transform({
    position: new Vector3(
      57.246646881103516,
      0.39715349674224854,
      72.54523468017578
    ),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  clickArea4.addComponentOrReplace(transform130);

  const clickArea5 = new Entity("clickArea5");
  engine.addEntity(clickArea5);
  clickArea5.setParent(_scene);
  const transform131 = new Transform({
    position: new Vector3(82, 3.2698824405670166, 76.16600036621094),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(
      0.4132286012172699,
      0.2553499937057495,
      0.4059058725833893
    ),
  });
  clickArea5.addComponentOrReplace(transform131);

  const discoball = new Entity("discoball");
  engine.addEntity(discoball);
  discoball.setParent(_scene);
  const transform132 = new Transform({
    position: new Vector3(
      79.66348266601562,
      9.654993057250977,
      68.6711196899414
    ),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(
      -0.009999999776482582,
      -0.009999999776482582,
      -0.009999999776482582
    ),
  });
  discoball.addComponentOrReplace(transform132);
  const gltfShape29 = new GLTFShape(
    "a5188e9e-a0cf-467f-b443-6ae3d054c765/discoBall.glb"
  );
  gltfShape29.withCollisions = true;
  gltfShape29.isPointerBlocker = true;
  gltfShape29.visible = true;
  discoball.addComponentOrReplace(gltfShape29);

  const clickArea6 = new Entity("clickArea6");
  engine.addEntity(clickArea6);
  clickArea6.setParent(_scene);
  const transform133 = new Transform({
    position: new Vector3(
      82.00609588623047,
      3.3712379932403564,
      76.22562408447266
    ),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(
      0.2232392281293869,
      0.1379481852054596,
      0.21928325295448303
    ),
  });
  clickArea6.addComponentOrReplace(transform133);

  const partylight = new Entity("partylight");
  engine.addEntity(partylight);
  partylight.setParent(_scene);
  const transform134 = new Transform({
    position: new Vector3(
      83.74263763427734,
      7.728586196899414,
      59.234397888183594
    ),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  partylight.addComponentOrReplace(transform134);
  const gltfShape30 = new GLTFShape(
    "2e11ab90-c630-4ab5-9ee3-4dfa1c695160/partyLight01.glb"
  );
  gltfShape30.withCollisions = true;
  gltfShape30.isPointerBlocker = true;
  gltfShape30.visible = true;
  partylight.addComponentOrReplace(gltfShape30);

  const partybutton2 = new Entity("partybutton2");
  engine.addEntity(partybutton2);
  partybutton2.setParent(_scene);
  const transform135 = new Transform({
    position: new Vector3(82, 3.202975034713745, 76.22063446044922),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  partybutton2.addComponentOrReplace(transform135);
  const gltfShape31 = new GLTFShape(
    "d57063da-655e-4e72-a888-77bd7a4b4970/partyButton.glb"
  );
  gltfShape31.withCollisions = true;
  gltfShape31.isPointerBlocker = true;
  gltfShape31.visible = true;
  partybutton2.addComponentOrReplace(gltfShape31);

  const partylight2 = new Entity("partylight2");
  engine.addEntity(partylight2);
  partylight2.setParent(_scene);
  partylight2.addComponentOrReplace(gltfShape30);
  const transform136 = new Transform({
    position: new Vector3(
      74.43072509765625,
      7.728586196899414,
      59.234397888183594
    ),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  partylight2.addComponentOrReplace(transform136);

  const butterfly = new Entity("butterfly");
  engine.addEntity(butterfly);
  butterfly.setParent(_scene);
  const transform137 = new Transform({
    position: new Vector3(56, 0, 76),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  butterfly.addComponentOrReplace(transform137);
  const gltfShape32 = new GLTFShape(
    "74cfbf03-70ca-4348-a95b-18b3a53a5ddd/Butterfly_02.glb"
  );
  gltfShape32.withCollisions = true;
  gltfShape32.isPointerBlocker = true;
  gltfShape32.visible = true;
  butterfly.addComponentOrReplace(gltfShape32);

  const butterfly2 = new Entity("butterfly2");
  engine.addEntity(butterfly2);
  butterfly2.setParent(_scene);
  const transform138 = new Transform({
    position: new Vector3(
      89.70023345947266,
      8.088528633117676,
      33.962867736816406
    ),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  butterfly2.addComponentOrReplace(transform138);
  const gltfShape33 = new GLTFShape(
    "d833610c-c31b-4bba-84d6-06bf849e4cff/Butterfly_10.glb"
  );
  gltfShape33.withCollisions = true;
  gltfShape33.isPointerBlocker = true;
  gltfShape33.visible = true;
  butterfly2.addComponentOrReplace(gltfShape33);

  const butterfly3 = new Entity("butterfly3");
  engine.addEntity(butterfly3);
  butterfly3.setParent(_scene);
  butterfly3.addComponentOrReplace(gltfShape33);
  const transform139 = new Transform({
    position: new Vector3(
      99.71182250976562,
      8.088528633117676,
      33.962867736816406
    ),
    rotation: new Quaternion(
      5.3739937575913305e-15,
      0.19855597615242004,
      -2.3669723958619215e-8,
      0.9800896048545837
    ),
    scale: new Vector3(1, 1, 1),
  });
  butterfly3.addComponentOrReplace(transform139);

  const butterfly4 = new Entity("butterfly4");
  engine.addEntity(butterfly4);
  butterfly4.setParent(_scene);
  const transform140 = new Transform({
    position: new Vector3(61, 0, 65.5),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  butterfly4.addComponentOrReplace(transform140);
  const gltfShape34 = new GLTFShape(
    "ccf1d157-46ce-41fc-b680-5d68fc59133a/Butterfly_07.glb"
  );
  gltfShape34.withCollisions = true;
  gltfShape34.isPointerBlocker = true;
  gltfShape34.visible = true;
  butterfly4.addComponentOrReplace(gltfShape34);

  const butterfly5 = new Entity("butterfly5");
  engine.addEntity(butterfly5);
  butterfly5.setParent(_scene);
  const transform141 = new Transform({
    position: new Vector3(60.5, 0, 63.4268798828125),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  butterfly5.addComponentOrReplace(transform141);
  butterfly5.addComponentOrReplace(gltfShape32);

  const butterfly6 = new Entity("butterfly6");
  engine.addEntity(butterfly6);
  butterfly6.setParent(_scene);
  const transform142 = new Transform({
    position: new Vector3(90, 0, 83.5),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  butterfly6.addComponentOrReplace(transform142);
  const gltfShape35 = new GLTFShape(
    "f00c452f-3425-43ed-997c-17febf88f3b5/Butterfly_05.glb"
  );
  gltfShape35.withCollisions = true;
  gltfShape35.isPointerBlocker = true;
  gltfShape35.visible = true;
  butterfly6.addComponentOrReplace(gltfShape35);

  const butterfly7 = new Entity("butterfly7");
  engine.addEntity(butterfly7);
  butterfly7.setParent(_scene);
  butterfly7.addComponentOrReplace(gltfShape34);
  const transform143 = new Transform({
    position: new Vector3(61, 0, 94.83777618408203),
    rotation: new Quaternion(
      1.3646213235199867e-14,
      -0.20114149153232574,
      2.3977927199325677e-8,
      0.9795622229576111
    ),
    scale: new Vector3(1.0000007152557373, 1, 1.0000007152557373),
  });
  butterfly7.addComponentOrReplace(transform143);

  const butterfly8 = new Entity("butterfly8");
  engine.addEntity(butterfly8);
  butterfly8.setParent(_scene);
  butterfly8.addComponentOrReplace(gltfShape35);
  const transform144 = new Transform({
    position: new Vector3(41.5, 0, 73),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  butterfly8.addComponentOrReplace(transform144);

  const butterfly9 = new Entity("butterfly9");
  engine.addEntity(butterfly9);
  butterfly9.setParent(_scene);
  butterfly9.addComponentOrReplace(gltfShape34);
  const transform145 = new Transform({
    position: new Vector3(82.5, 0, 40),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  butterfly9.addComponentOrReplace(transform145);

  const lightstick2 = new Entity("lightstick2");
  engine.addEntity(lightstick2);
  lightstick2.setParent(_scene);
  lightstick2.addComponentOrReplace(gltfShape10);
  const transform146 = new Transform({
    position: new Vector3(
      12.82904052734375,
      0.17571449279785156,
      23.625499725341797
    ),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  lightstick2.addComponentOrReplace(transform146);

  const lightstick3 = new Entity("lightstick3");
  engine.addEntity(lightstick3);
  lightstick3.setParent(_scene);
  lightstick3.addComponentOrReplace(gltfShape10);
  const transform147 = new Transform({
    position: new Vector3(
      16.26980209350586,
      0.17571449279785156,
      82.88793182373047
    ),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  lightstick3.addComponentOrReplace(transform147);

  const lightstick4 = new Entity("lightstick4");
  engine.addEntity(lightstick4);
  lightstick4.setParent(_scene);
  lightstick4.addComponentOrReplace(gltfShape10);
  const transform148 = new Transform({
    position: new Vector3(
      7.205621719360352,
      0.17571449279785156,
      93.21353912353516
    ),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  lightstick4.addComponentOrReplace(transform148);

  const lightstick5 = new Entity("lightstick5");
  engine.addEntity(lightstick5);
  lightstick5.setParent(_scene);
  lightstick5.addComponentOrReplace(gltfShape10);
  const transform149 = new Transform({
    position: new Vector3(
      21.847394943237305,
      0.3388667106628418,
      117.36053466796875
    ),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  lightstick5.addComponentOrReplace(transform149);

  const lightstick6 = new Entity("lightstick6");
  engine.addEntity(lightstick6);
  lightstick6.setParent(_scene);
  lightstick6.addComponentOrReplace(gltfShape10);
  const transform150 = new Transform({
    position: new Vector3(54, 0.42612624168395996, 110.5),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  lightstick6.addComponentOrReplace(transform150);

  const lightstick7 = new Entity("lightstick7");
  engine.addEntity(lightstick7);
  lightstick7.setParent(_scene);
  lightstick7.addComponentOrReplace(gltfShape10);
  const transform151 = new Transform({
    position: new Vector3(
      94.0964584350586,
      0.7106651663780212,
      108.60797882080078
    ),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  lightstick7.addComponentOrReplace(transform151);

  const lightstick8 = new Entity("lightstick8");
  engine.addEntity(lightstick8);
  lightstick8.setParent(_scene);
  lightstick8.addComponentOrReplace(gltfShape10);
  const transform152 = new Transform({
    position: new Vector3(
      78.00144958496094,
      0.16823500394821167,
      115.01297760009766
    ),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  lightstick8.addComponentOrReplace(transform152);

  const hometemplateTerrain = new Entity("hometemplateTerrain");
  engine.addEntity(hometemplateTerrain);
  hometemplateTerrain.setParent(_scene);
  const transform153 = new Transform({
    position: new Vector3(64, 0, 64),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  hometemplateTerrain.addComponentOrReplace(transform153);
  const gltfShape36 = new GLTFShape(
    "e6b5d5e9-0a2b-4049-90bc-b4aee9873f12/HomeTemplate_Terrain.glb"
  );
  gltfShape36.withCollisions = true;
  gltfShape36.isPointerBlocker = true;
  gltfShape36.visible = true;
  hometemplateTerrain.addComponentOrReplace(gltfShape36);

  const hometemplateMainStructure = new Entity("hometemplateMainStructure");
  engine.addEntity(hometemplateMainStructure);
  hometemplateMainStructure.setParent(_scene);
  const transform154 = new Transform({
    position: new Vector3(64, 0, 64),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(1, 1, 1),
  });
  hometemplateMainStructure.addComponentOrReplace(transform154);
  const gltfShape37 = new GLTFShape(
    "62db698d-212f-4a1a-b257-740b42e7987d/HomeTemplate_MainStructure.glb"
  );
  gltfShape37.withCollisions = true;
  gltfShape37.isPointerBlocker = true;
  gltfShape37.visible = true;
  hometemplateMainStructure.addComponentOrReplace(gltfShape37);

  const channelId = Math.random().toString(16).slice(2);
  const channelBus = new MessageBus();
  const inventory = createInventory(UICanvas, UIContainerStack, UIImage);
  const options = { inventory };

  const script1 = new Script1();
  const script2 = new Script2();
  const script3 = new Script3();
  const script4 = new Script4();
  const script5 = new Script5();
  const script6 = new Script6();
  const script7 = new Script7();
  const script8 = new Script8();
  const script9 = new Script9();
  script1.init();
  script2.init();
  script3.init();
  script4.init();
  script5.init();
  script6.init();
  script7.init();
  script8.init();
  script9.init();
  script1.spawn(
    twitterLink,
    { url: "decentraland", bnw: false },
    createChannel(channelId, twitterLink, channelBus)
  );
  script2.spawn(
    instagramLink,
    { url: "decentraland_art", bnw: false },
    createChannel(channelId, instagramLink, channelBus)
  );
  script3.spawn(
    discordLink,
    { url: "/channels/417796904760639509/433376431603580970", bnw: false },
    createChannel(channelId, discordLink, channelBus)
  );
  script4.spawn(
    youtubeLink,
    { url: "UCLXcTgzr05cFZaN972nuEXw", bnw: false },
    createChannel(channelId, youtubeLink, channelBus)
  );
  script5.spawn(
    imageFromURL2,
    { image: "https://i.imgur.com/d25gO61.jpg" },
    createChannel(channelId, imageFromURL2, channelBus)
  );
  script5.spawn(
    imageFromURL3,
    { image: "https://i.imgur.com/d25gO61.jpg" },
    createChannel(channelId, imageFromURL3, channelBus)
  );
  script5.spawn(
    imageFromURL4,
    { image: "https://i.imgur.com/d25gO61.jpg" },
    createChannel(channelId, imageFromURL4, channelBus)
  );
  script5.spawn(
    imageFromURL5,
    { image: "https://i.imgur.com/d25gO61.jpg" },
    createChannel(channelId, imageFromURL5, channelBus)
  );
  script5.spawn(
    imageFromURL6,
    { image: "https://i.imgur.com/d25gO61.jpg" },
    createChannel(channelId, imageFromURL6, channelBus)
  );
  script5.spawn(
    imageFromURL7,
    { image: "https://i.imgur.com/d25gO61.jpg" },
    createChannel(channelId, imageFromURL7, channelBus)
  );
  script6.spawn(
    videoStream,
    {
      startOn: "false",
      onClickText: "Play video",
      volume: 1,
      onClick: [{ entityName: "videoStream", actionId: "toggle", values: {} }],
      station: "https://theuniverse.club/live/consensys/index.m3u8",
      onActivate: [],
      onDeactivate: [],
    },
    createChannel(channelId, videoStream, channelBus)
  );
  script7.spawn(
    radio,
    {
      startOn: true,
      volume: 1,
      onClickText: "Radio On/Off",
      onClick: [{ entityName: "radio", actionId: "toggle", values: {} }],
      onActivate: [
        {
          entityName: "toolbox",
          actionId: "animate",
          values: {
            target: "djdecktable2",
            animAction: "play",
            speed: 1,
            loop: true,
          },
        },
      ],
      onDeactivate: [
        {
          entityName: "toolbox",
          actionId: "animate",
          values: {
            target: "djdecktable2",
            animAction: "stop",
            speed: 1.05,
            loop: false,
          },
        },
      ],
      customStation:
        "https://soundcloud.com/lofi_girl/soothing-breeze?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing",
    },
    createChannel(channelId, radio, channelBus)
  );
  script8.spawn(
    clickArea,
    {
      enabled: true,
      onClickText: "Turn On",
      button: "POINTER",
      onClick: [
        {
          entityName: "toolbox",
          actionId: "scale",
          values: {
            x: 0.5,
            y: 0.5,
            z: 0.5,
            curve: "easeinoutsine",
            speed: 10,
            onComplete: [],
            target: "fireparticles2",
          },
        },
        {
          entityName: "toolbox",
          actionId: "scale",
          values: {
            target: "clickArea",
            x: 0,
            y: 0,
            z: 0,
            curve: "linear",
            speed: 20,
            onComplete: [],
          },
        },
        {
          entityName: "toolbox",
          actionId: "scale",
          values: {
            x: 2,
            y: 2,
            z: 2,
            curve: "linear",
            speed: 20,
            onComplete: [],
            target: "clickArea2",
          },
        },
      ],
    },
    createChannel(channelId, clickArea, channelBus)
  );
  script9.spawn(toolbox, {}, createChannel(channelId, toolbox, channelBus));
  script8.spawn(
    clickArea2,
    {
      enabled: true,
      onClickText: "Turn Off",
      button: "POINTER",
      onClick: [
        {
          entityName: "toolbox",
          actionId: "scale",
          values: {
            x: 0,
            y: 0,
            z: 0,
            curve: "easeinoutsine",
            speed: 10,
            onComplete: [],
            target: "fireparticles2",
          },
        },
        {
          entityName: "toolbox",
          actionId: "scale",
          values: {
            x: 0,
            y: 0,
            z: 0,
            curve: "linear",
            speed: 20,
            onComplete: [],
            target: "clickArea2",
          },
        },
        {
          entityName: "toolbox",
          actionId: "scale",
          values: {
            target: "clickArea",
            x: 2,
            y: 2,
            z: 2,
            curve: "linear",
            speed: 20,
            onComplete: [],
          },
        },
      ],
    },
    createChannel(channelId, clickArea2, channelBus)
  );
  script8.spawn(
    clickArea3,
    {
      enabled: true,
      onClickText: "Turn On",
      button: "POINTER",
      onClick: [
        {
          entityName: "toolbox",
          actionId: "scale",
          values: {
            x: 0.5,
            y: 0.5,
            z: 0.5,
            curve: "easeinoutsine",
            speed: 10,
            onComplete: [],
            target: "fireparticles",
          },
        },
        {
          entityName: "toolbox",
          actionId: "scale",
          values: {
            target: "clickArea3",
            x: 0,
            y: 0,
            z: 0,
            curve: "linear",
            speed: 20,
            onComplete: [],
          },
        },
        {
          entityName: "toolbox",
          actionId: "scale",
          values: {
            x: 1,
            y: 1,
            z: 1,
            curve: "linear",
            speed: 20,
            onComplete: [],
            target: "clickArea4",
          },
        },
      ],
    },
    createChannel(channelId, clickArea3, channelBus)
  );
  script8.spawn(
    clickArea4,
    {
      enabled: true,
      onClickText: "Turn Off",
      button: "POINTER",
      onClick: [
        {
          entityName: "toolbox",
          actionId: "scale",
          values: {
            x: 0,
            y: 0,
            z: 0,
            curve: "easeinoutsine",
            speed: 10,
            onComplete: [],
            target: "fireparticles",
          },
        },
        {
          entityName: "toolbox",
          actionId: "scale",
          values: {
            x: 0,
            y: 0,
            z: 0,
            curve: "linear",
            speed: 20,
            onComplete: [],
            target: "clickArea4",
          },
        },
        {
          entityName: "toolbox",
          actionId: "scale",
          values: {
            target: "clickArea3",
            x: 1,
            y: 1,
            z: 1,
            curve: "linear",
            speed: 20,
            onComplete: [],
          },
        },
      ],
    },
    createChannel(channelId, clickArea4, channelBus)
  );
  script8.spawn(
    clickArea5,
    {
      enabled: true,
      onClickText: "Party Mode On",
      button: "POINTER",
      onClick: [
        {
          entityName: "toolbox",
          actionId: "scale",
          values: {
            x: 1,
            y: 1,
            z: 1,
            curve: "easeoutbounce",
            speed: 18,
            onComplete: [],
            target: "discoball",
          },
        },
        {
          entityName: "toolbox",
          actionId: "scale",
          values: {
            target: "clickArea5",
            x: 0,
            y: 0,
            z: 0,
            curve: "linear",
            speed: 20,
            onComplete: [],
          },
        },
        {
          entityName: "toolbox",
          actionId: "scale",
          values: {
            x: 0.5,
            y: 0.5,
            z: 0.5,
            curve: "linear",
            speed: 20,
            onComplete: [],
            target: "clickArea6",
          },
        },
        {
          entityName: "toolbox",
          actionId: "animate",
          values: {
            target: "partybutton2",
            animAction: "play",
            animation: "ButtonSwitch",
            speed: 1,
            loop: false,
          },
        },
        {
          entityName: "toolbox",
          actionId: "animate",
          values: {
            target: "partylight2",
            animAction: "play",
            animation: "C5",
            speed: 1,
            loop: true,
          },
        },
        {
          entityName: "toolbox",
          actionId: "animate",
          values: {
            target: "partylight",
            animAction: "play",
            animation: "C5",
            speed: 1,
            loop: true,
          },
        },
      ],
    },
    createChannel(channelId, clickArea5, channelBus)
  );
  script8.spawn(
    clickArea6,
    {
      enabled: true,
      onClickText: "Party Mode Off",
      button: "POINTER",
      onClick: [
        {
          entityName: "toolbox",
          actionId: "scale",
          values: {
            x: 0,
            y: 0,
            z: 0,
            curve: "easeinbounce",
            speed: 18,
            onComplete: [],
            target: "discoball",
          },
        },
        {
          entityName: "toolbox",
          actionId: "scale",
          values: {
            target: "clickArea6",
            x: 0,
            y: 0,
            z: 0,
            curve: "linear",
            speed: 20,
            onComplete: [],
          },
        },
        {
          entityName: "toolbox",
          actionId: "scale",
          values: {
            x: 0.5,
            y: 0.5,
            z: 0.5,
            curve: "linear",
            speed: 20,
            onComplete: [],
            target: "clickArea5",
          },
        },
        {
          entityName: "toolbox",
          actionId: "animate",
          values: {
            target: "partylight",
            animAction: "play",
            animation: "C0",
            speed: 1.05,
            loop: false,
          },
        },
        {
          entityName: "toolbox",
          actionId: "animate",
          values: {
            target: "partybutton2",
            animAction: "play",
            animation: "ButtonSwitch",
            speed: 1,
            loop: false,
          },
        },
        {
          entityName: "toolbox",
          actionId: "animate",
          values: {
            target: "partylight2",
            animAction: "play",
            animation: "C0",
            speed: 1,
            loop: true,
          },
        },
      ],
    },
    createChannel(channelId, clickArea6, channelBus)
  );
}
