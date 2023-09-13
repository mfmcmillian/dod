import { setTimeout } from "@dcl/ecs-scene-utils"

export const applyAttackedEnemyEffectToLocation = (
    position: Vector3,
    duration?: number
) => {
    const area = new Entity("area")
    const transform60 = new Transform({
        position,
        rotation: new Quaternion(0, 0, 0, 1),
        scale: new Vector3(1, 1, 1),
    })
    area.addComponentOrReplace(transform60)
    const gltfShape20 = new GLTFShape("models/Skill_FX/CharacterSelect.glb")
    gltfShape20.visible = true
    area.addComponentOrReplace(gltfShape20)

    const clip = new AudioClip("sounds/attack.mp3")
    const attackSound = new AudioSource(clip)
    area.addComponent(attackSound)
    attackSound.volume = 0.5

    let d2animator = new Animator()

    // Add animator component to the entity
    area.addComponent(d2animator)

    // Instance animation clip object
    const idleClip = new AnimationState("idle", { looping: true })
    const healClip = new AnimationState("action", { looping: false })

    // Add animation clip to Animator component
    d2animator.addClip(idleClip)
    d2animator.addClip(healClip)

    // Add entity to engine
    engine.addEntity(area)

    healClip.play()
    attackSound.playOnce()
    setTimeout(duration, () => engine.removeEntity(area))
}
