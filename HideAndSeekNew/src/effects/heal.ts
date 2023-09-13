import { setTimeout } from "@dcl/ecs-scene-utils"

export const applyHealToLocation = (position: Vector3) => {
    const area = new Entity("area")
    const transform60 = new Transform({
        position,
        rotation: new Quaternion(0, 0, 0, 1),
        scale: new Vector3(1, 1, 1),
    })
    area.addComponentOrReplace(transform60)
    const gltfShape20 = new GLTFShape("models/Skill_FX/heal.glb")
    gltfShape20.visible = true
    area.addComponentOrReplace(gltfShape20)

    const clip = new AudioClip("sounds/Heal.mp3")
    const healSound = new AudioSource(clip)
    area.addComponent(healSound)
    healSound.volume = 0.8

    let d2animator = new Animator()

    // Add animator component to the entity
    area.addComponent(d2animator)

    // Instance animation clip object
    const idleClip = new AnimationState("idle", { looping: true })
    const healClip = new AnimationState("heal", { looping: false })

    // Add animation clip to Animator component
    d2animator.addClip(idleClip)
    d2animator.addClip(healClip)

    // Add entity to engine
    engine.addEntity(area)

    healClip.play()
    healSound.playOnce()
    setTimeout(10000, () => engine.removeEntity(area))
}
