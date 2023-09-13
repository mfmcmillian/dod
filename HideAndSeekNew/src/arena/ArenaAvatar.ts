import { setTimeout } from "@dcl/ecs-scene-utils"

export enum AvatarActiveMode {
    SWORD = "sword",
    BOW = "bow",
}

type AnimationTypes = "run" | "attack" | "impact" | "idle"

export class ArenaAvatarModel extends Entity {
    attackClip: AnimationState
    impactClip: AnimationState
    activeMode?: AvatarActiveMode
    private healthBar?: Entity
    constructor(model: GLTFShape, transform: Transform) {
        super()
        engine.addEntity(this)
        this.addComponent(model)
        this.addComponent(transform)

        this.setupAnimation()
        this.playAttack = this.playAttack.bind(this)
        this.activeMode = AvatarActiveMode.BOW
    }

    setupAnimation() {
        this.addComponentOrReplace(new Animator())
        this.getComponent(Animator).addClip(
            new AnimationState(`${AvatarActiveMode.BOW}_run`, {
                looping: true,
                layer: 0,
                weight: 0.5,
            })
        )
        this.getComponent(Animator).addClip(
            new AnimationState(`${AvatarActiveMode.SWORD}_run`, {
                looping: true,
                layer: 0,
                weight: 0.5,
            })
        )

        this.getComponent(Animator).addClip(
            new AnimationState(`${AvatarActiveMode.BOW}_idle`, {
                looping: true,
                layer: 0,
                weight: 0.1,
            })
        )

        this.getComponent(Animator).addClip(
            new AnimationState(`${AvatarActiveMode.SWORD}_idle`, {
                looping: true,
                layer: 0,
                weight: 0.1,
            })
        )

        this.getComponent(Animator).addClip(
            new AnimationState(`${AvatarActiveMode.BOW}_attack`, {
                looping: false,
                layer: 1,
                weight: 1,
            })
        )

        this.getComponent(Animator).addClip(
            new AnimationState(`${AvatarActiveMode.SWORD}_attack`, {
                looping: false,
                layer: 1,
                weight: 1,
            })
        )

        this.getComponent(Animator).addClip(
            new AnimationState(`${AvatarActiveMode.BOW}_impact`, {
                looping: false,
                layer: 1,
                weight: 1,
            })
        )

        this.getComponent(Animator).addClip(
            new AnimationState(`${AvatarActiveMode.SWORD}_impact`, {
                looping: false,
                layer: 1,
                weight: 1,
            })
        )
    }

    getAnimation = (name: AnimationTypes) => {
        return this.getComponent(Animator).getClip(`${this.activeMode}_${name}`)
    }

    playAnimation = (animation: AnimationTypes, reset = false) => {
        this.getAnimation(animation).play(reset)
    }

    stopAnimation = (animation: AnimationTypes) => {
        this.getAnimation(animation).stop()
    }

    // Play running animation
    playRunning(reset = true) {
        const isPlaying = this.getAnimation("run").playing

        if (!isPlaying) {
            this.playAnimation("run", reset)
        }
    }

    // Play idle animation
    playIdle(reset = true) {
        this.playAnimation("idle", reset)
    }

    playAttack() {
        this.playAnimation("attack", true)
        setTimeout(2500, () => this.stopAnimation("attack"))
    }
    playImpact() {
        this.playAnimation("impact", true)
        setTimeout(3000, () => this.stopAnimation("impact"))
    }

    isRunning() {
        return this.getAnimation("run").playing
    }

    isIdle() {
        return this.getAnimation("idle").playing
    }

    switchActiveMode(activeMode: AvatarActiveMode) {
        this.activeMode = activeMode
    }

    createHealthBar(health: number = 100, maxHealth: number = 100) {
        let hb = new Entity()
        hb.addComponentOrReplace(
            new Transform({
                scale: new Vector3(health / maxHealth, 0.1, 0.1),
                position: new Vector3(0, 2.5, 0),
            })
        )
        const myMaterial = new Material()
        myMaterial.albedoColor = Color4.FromColor3(Color3.Red(), 0.5)
        myMaterial.metallic = 0.9
        myMaterial.roughness = 0.1
        myMaterial.roughness = 1
        myMaterial.specularIntensity = 0
        myMaterial.metallic = 0
        myMaterial.emissiveColor = Color3.Red()
        myMaterial.emissiveIntensity = 0.8

        hb.addComponentOrReplace(myMaterial)
        hb.addComponentOrReplace(new BoxShape())

        hb.setParent(this)
        this.healthBar = hb
    }

    updateHealthBar(health: number, maxHealth: number) {
        if (this.healthBar) {
            this.healthBar.getComponent(Transform).scale.x = health / maxHealth
        }
    }
}

export function playerArenaModeFactory(
    shape: GLTFShape,
    onEnable?: () => void,
    onDisable?: () => void
) {
    const avatarModel = new ArenaAvatarModel(
        shape,
        new Transform({
            position: new Vector3(0, 0, 0),
            scale: new Vector3(1, 1, 1),
        })
    )

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

    const hideAvatarsPassportEntity = new Entity("AvatarHider")
    hideAvatarsPassportEntity.addComponent(
        new AvatarModifierArea({
            area: { box: new Vector3(16000, 600, 16000) },
            modifiers: [AvatarModifiers.DISABLE_PASSPORTS],
        })
    )
    hideAvatarsPassportEntity.addComponent(
        new Transform({ position: new Vector3(8, 0, 10.5) })
    )
    // Check if player is moving
    const currentPosition = new Vector3().copyFrom(Camera.instance.position)
    avatarModel.playIdle()

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
                    this.playIdle = true
                    Attachable.AVATAR
                }
            } else if (!currentPosition.equals(Camera.instance.position)) {
                currentPosition.copyFrom(Camera.instance.position)
                this.dt = 300
                //log("im running")
                this.playIdle = false
                avatarModel.playRunning()
                avatarModel.getComponent(Transform).position.set(0, -0.8, 0)
            }
        }
    }

    const system = new CheckPlayerIsMovingSystem()

    return {
        enableMode: () => {
            engine.addEntity(avatarModel)
            //engine.addEntity(hideAvatarsEntity)
            engine.addEntity(hideAvatarsPassportEntity)
            engine.addSystem(system)
            avatarModel.setParent(Attachable.AVATAR)

            onEnable?.()
        },
        disableMode: () => {
            engine.removeEntity(avatarModel)
            //engine.removeEntity(hideAvatarsEntity)
            engine.removeEntity(hideAvatarsPassportEntity)
            engine.removeSystem(system)
            onDisable?.()
        },
        playAttackAnimation: () => {
            //log("before attack animation")
            avatarModel.playAttack()
            //log("after attack animation")
        },
        playIdle: () => {
            //log("before attack animation")
            avatarModel.playIdle()
            //log("after attack animation")
        },
        playImpactAnimation: () => {
            //log("before attack animation")
            avatarModel.playImpact()
            //log("after attack animation")
        },
        switchActiveMode: (activeMode: AvatarActiveMode) => {
            avatarModel.switchActiveMode(activeMode)
        },
        getActiveMode: () => {
            return avatarModel.activeMode
        },
        avatar: avatarModel,
    }
}
