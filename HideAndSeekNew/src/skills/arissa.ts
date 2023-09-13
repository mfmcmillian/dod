import * as utils from "@dcl/ecs-scene-utils"
import { setTimeout } from "@dcl/ecs-scene-utils"
import { getUserData } from "@decentraland/Identity"

const input = Input.instance

export class AvatarModel extends Entity {
    attackClip: AnimationState
    impactClip: AnimationState
    constructor(model: GLTFShape, transform: Transform) {
        super()
        engine.addEntity(this)
        this.addComponent(model)
        this.addComponent(transform)

        this.setupAnimation()
        this.playAttack = this.playAttack.bind(this)

        // Removing till we tweak animation
        // input.subscribe('BUTTON_DOWN', ActionButton.JUMP, false, () => {
        //     log('jump');
        //     this.playJump()
        // })
    }

    setupAnimation() {
        this.addComponentOrReplace(new Animator())
        this.getComponent(Animator).addClip(
            new AnimationState("run", { looping: true, layer: 0, weight: 0.1 })
        )
        this.getComponent(Animator).addClip(
            new AnimationState("idle", { looping: true, layer: 0, weight: 0.1 })
        )

        this.getComponent(Animator).addClip(
            new AnimationState("jump", {
                looping: false,
                layer: 3,
                weight: 0.5,
            })
        )

        this.attackClip = new AnimationState("attack", {
            looping: false,
            layer: 1,
            weight: 1,
        })
        this.getComponent(Animator).addClip(this.attackClip)

        this.impactClip = new AnimationState("impact", {
            looping: false,
            layer: 1,
            weight: 1,
        })
        this.getComponent(Animator).addClip(this.impactClip)
    }
    // Play running animation
    playRunning(reset= true) {
        const isPlaying = this.getComponent(Animator).getClip("run").playing
        if (!isPlaying) {
            this.getComponent(Animator).getClip("run").play(reset)
        }
    }

    playJump() {
        log("play jump")
        this.getComponent(Animator).getClip("jump").play(true)
    }
    // Play idle animation
    playIdle(reset = true) {
        this.getComponent(Animator).getClip("idle").play(reset)
        //this.getComponent(Animator).getClip("run").stop()
    }
    // Play idle animation
    playAttack() {
        this.attackClip.play(true)
        setTimeout(3000, () => this.attackClip.stop())
    }
    playImpact() {
        this.impactClip.play(true)

        setTimeout(3000, () => this.impactClip.stop())
    }
    isRunning() {
        return this.getComponent(Animator).getClip("run").playing
    }

    isIdle() {
        return this.getComponent(Animator).getClip("idle").playing
    }
}

export async function playerModeFactory(
    shape: GLTFShape,
    onEnable?: () => void,
    onDisable?: () => void
) {
    let parent = new Entity()
    // let child = new Entity()
    // child.addComponent(new ConeShape())
    // child.addComponent(
    //     new Transform({
    //         rotation: Quaternion.Euler(0, 0, 180),
    //         scale: new Vector3(0.2, 0.2, 0.2),
    //         position: new Vector3(0, 0.8, 0),
    //     })
    // )
    // child.setParent(parent)

    const avatarModel = new AvatarModel(
        shape,
        new Transform({
            position: new Vector3(0, 0.8, 0),
            scale: new Vector3(1, 1, 1),
        })
    )

    const AvatarSword = new AvatarModel(
        new GLTFShape("models/KnightAxe.glb"),
        new Transform({
            rotation: Quaternion.Euler(0, 0, 0),
            scale: new Vector3(1, 1, 1),
        })
    )

    AvatarSword.setParent(avatarModel)
    avatarModel.setParent(parent)

    const hideAvatarsEntity = new Entity("AvatarHider")
    hideAvatarsEntity.addComponent(
        new AvatarModifierArea({
            area: { box: new Vector3(16000, 600, 16000) },
            modifiers: [AvatarModifiers.HIDE_AVATARS],
        })
    )
    hideAvatarsEntity.addComponent(
        new Transform({ position: new Vector3(8, 0, 10.5) })
    )
    // Check if player is moving
    const currentPosition = new Vector3().copyFrom(Camera.instance.position)
    avatarModel.playIdle()
    AvatarSword.playIdle()
    class CheckPlayerIsMovingSystem implements ISystem {
        isRunning: boolean = false
        playIdle: boolean = false
        dt: number = 0

        update(dt) {
            //log("dt", dt * 1000, !this.playIdle, dt <= 0, this.dt)
            if (currentPosition.equals(Camera.instance.position)) {
                this.dt -= dt * 1000
                if (!this.playIdle && this.dt <= 0) {
                    avatarModel.playIdle()
                    AvatarSword.playIdle()
                    this.playIdle = true
                }
            } else if (!currentPosition.equals(Camera.instance.position)) {
                currentPosition.copyFrom(Camera.instance.position)
                this.dt = 300
                //log("im running")
                this.playIdle = false
                avatarModel.playRunning()
                AvatarSword.playAttack()
                avatarModel.getComponent(Transform).position.set(0, 0.8, 0)
            }
        }
    }

    const system = new CheckPlayerIsMovingSystem()
    const { userId } = await getUserData()

    // parent.addComponentOrReplace(
    //     new AttachToAvatar({
    //         avatarId: userId,
    //         anchorPointId: AttachToAvatarAnchorPointId.Position,
    //     })
    // )
    // omitCleanupEntities.addEntities(avatarModel.uuid)
    // omitCleanupEntities.addEntities(hideAvatarsEntity.uuid)
    return {
        enableMode: () => {
            engine.addEntity(parent)
            engine.addEntity(hideAvatarsEntity)
            engine.addSystem(system)
            // Create to show Arissa avatar
            // hideAvatarsEntity.addComponentOrReplace(
            //     new utils.TriggerComponent(
            //         new utils.TriggerBoxShape(
            //             new Vector3(16000, 600, 16000),
            //             Vector3.Zero()
            //         ),
            //         {
            //             onCameraEnter: () => {
            //                 engine.addEntity(avatarModel)
            //                 // avatarModel.getComponent(Transform).scale.setAll(1)
            //             },
            //             onCameraExit: () => {
            //                 engine.removeEntity(avatarModel)
            //             },
            //         }
            //     )
            // )
            onEnable?.()
        },
        disableMode: () => {
            engine.removeEntity(parent)
            // avatarModel.getParent().removeComponent(avatarModel)
            // avatarModel.getComponent(Transform).scale.setAll(0)
            engine.removeEntity(hideAvatarsEntity)
            engine.removeSystem(system)
            onDisable?.()
        },
        playAttackAnimation: () => {
            //log("before attack animation")
            avatarModel.playAttack()
            AvatarSword.playAttack()
            //log("after attack animation")
        },
        playImpactAnimation: () => {
            //log("before attack animation")
            avatarModel.playImpact()
            AvatarSword.playImpact()
            //log("after attack animation")
        },
    }
}

const KnightCache = new Entity()
KnightCache.addComponent(new GLTFShape("models/Knight.glb"))
KnightCache.addComponent(new Transform({ scale: new Vector3(0, 0, 0) }))

class CheckPlayerIsMovingSystem implements ISystem {
    isRunning: boolean = false
    isIdle: boolean = false
    dt: number = 0
    playIdle: () => void
    playWalk: () => void
    currentPosition: Vector3
    setLocation?: (pos: Vector3) => void

    constructor(
        currentPosition: Vector3,
        playIdle?: () => void,
        playWalk?: () => void,
        setLocation?: (pos: Vector3) => void
    ) {
        this.currentPosition = currentPosition
        this.playIdle = playIdle
        this.playWalk = playWalk
        this.setLocation = setLocation
    }

    update(dt) {
        //log("dt", dt * 1000, !this.playIdle, dt <= 0, this.dt)
        if (
            this.currentPosition.x === Camera.instance.position.x &&
            this.currentPosition.z === Camera.instance.position.z
        ) {
            this.dt -= dt * 1000
            if (!this.isIdle && this.dt <= 0) {
                this.playIdle?.()
                this.isIdle = true
            }
        } else if (
            this.currentPosition.x !== Camera.instance.position.x &&
            this.currentPosition.z !== Camera.instance.position.z
        ) {
            this.currentPosition.copyFrom(Camera.instance.position)
            this.dt = 300
            this.isIdle = false
            this.playWalk?.()
        }

        this.setLocation(this.currentPosition)
    }
}

type EquipableMap = { [key: string]: AvatarModel }

export class PlayerAvatar {
    body: AvatarModel
    equipableMap?: EquipableMap
    hiderEntity: Entity
    movementSystem: ISystem
    parent: Entity

    constructor(
        uuid: string,
        bodyShape: GLTFShape,
        equipableMap: EquipableMap = {}
    ) {
        this.equipableMap = equipableMap
        this.parent = new Entity()

        this.body = new AvatarModel(
            bodyShape,
            new Transform({
                position: new Vector3(0, -1, 0),
                scale: new Vector3(1, 1, 1),
            })
        )

        this.body.setParent(this.parent)

        // this.parent.addComponentOrReplace(
        //     new AttachToAvatar({
        //         avatarId: uuid,
        //         anchorPointId: AttachToAvatarAnchorPointId.NameTag,
        //     })
        // )

        if (this.equipableMap) {
            Object.keys(this.equipableMap).forEach((key) => {
                this.equipableMap[key].setParent(this.body)
                this.equipableMap[key]?.playIdle()
            })
        }

        this.hiderEntity = new Entity("AvatarHider")
        this.hiderEntity.addComponent(
            new AvatarModifierArea({
                area: { box: new Vector3(16000, 600, 16000) },
                modifiers: [AvatarModifiers.HIDE_AVATARS],
            })
        )
        this.hiderEntity.addComponent(
            new Transform({ position: new Vector3(8, 0, 10.5) })
        )

        const currentPosition = new Vector3().copyFrom(Camera.instance.position)
        this.movementSystem = new CheckPlayerIsMovingSystem(
            currentPosition,
            () => this.playIdle(),
            () => this.playWalk(),
            (pos) => {
                // this.parent.getComponent(Transform).position.copyFrom(Camera.instance.position)
                // this.parent.getComponent(Transform).rotation.copyFrom(Camera.instance.rotation)
            }
        )
    }

    playIdle() {
        this.body.playIdle()

        Object.keys(this.equipableMap).forEach((i) => {
            this.equipableMap[i].playIdle()
        })
    }

    playWalk() {
        this.body.playRunning()

        Object.keys(this.equipableMap).forEach((i) => {
            this.equipableMap[i].playRunning()
        })
    }

    playImpact() {
        this.body.playImpact()

        Object.keys(this.equipableMap).forEach((i) => {
            this.equipableMap[i].playImpact()
        })
    }

    playAttack() {
        this.body.playAttack()

        Object.keys(this.equipableMap).forEach((i) => {
            this.equipableMap[i].playImpact()
        })
    }

    swapModel(shape: GLTFShape) {
        this.body.setParent(null)
        this.disable()

        this.body = new AvatarModel(
            shape,
            new Transform({
                position: new Vector3(0, -1, 0),
                scale: new Vector3(1, 1, 1),
            })
        )

        this.body.setParent(this.parent)

        this.enable()
    }

    equipItem(key: string, shape: GLTFShape) {
        if (this.equipableMap[key]?.isAddedToEngine()) {
            engine.removeEntity(this.equipableMap[key])
        }

        this.equipableMap[key] = new AvatarModel(
            shape,
            new Transform({
                position: new Vector3(0, 0, 0),
                scale: new Vector3(1, 1, 1),
            })
        )

        this.equipableMap[key].setParent(this.body)
        this.equipableMap[key].playIdle()
    }

    enable() {
        engine.addEntity(this.parent)
        this.parent.setParent(Attachable.AVATAR)
        engine.addEntity(this.hiderEntity)
        engine.addSystem(this.movementSystem)
        this.body.playIdle()
    }

    disable() {
        engine.removeEntity(this.parent)
        engine.removeEntity(this.hiderEntity)
        engine.removeSystem(this.movementSystem)
    }

    isRunning() {
        return this.body?.isRunning()
    }

    isIdle() {
        return this.body?.isIdle()
    }
}
