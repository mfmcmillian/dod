import { Dash_TriggerZone } from "dcldash";

interface CombatZoneParams {
  onEnter: () => void;
  onLeave: () => void;
}
export const CreateCombatZone = ({
  onEnter = () => null,
  onLeave = () => null,
}: CombatZoneParams) => {
  const myTriggerZone = new Dash_TriggerZone();

  // myTriggerZone.addComponent(
  //     new Transform({
  //         position: new Vector3(-44.49, 60, 63.34),
  //         scale: new Vector3(39, 25, 65),
  //     })
  // )

  myTriggerZone.addComponent(
    new Transform({
      position: new Vector3(63.55, 0, 63.94),
      scale: new Vector3(127, 40, 127),
    })
  );

  // myTriggerZone.setParent(_scene)

  // Make it visible while debugging
  myTriggerZone.enableDebug();

  // Turn the trigger events on
  myTriggerZone.enable();

  // Turn the trigger events off
  // testTriggerZone.disable()
  myTriggerZone.onEnter = onEnter;

  myTriggerZone.onExit = onLeave;

  return myTriggerZone;
};
