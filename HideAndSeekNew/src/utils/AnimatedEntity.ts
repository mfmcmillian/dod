export class AnimatedEntity extends Entity {
    removed: boolean
    onRemove?: () => void

    constructor(model: GLTFShape, transform: Transform) {
        super()
        engine.addEntity(this)
        this.addComponent(model)
        this.addComponent(transform)
        this.removed = false

        this.addComponent(new Animator())
        this.getComponent(Animator).addClip(
            new AnimationState("walk", { looping: true })
        )
        this.getComponent(Animator).addClip(
            new AnimationState("attack", { looping: true })
        )
        this.getComponent(Animator).getClip("walk").play()
    }

    // Play attacking animation
    attack() {
        this.getComponent(Animator).getClip("attack").play()
    }
    fly() {
        this.getComponent(Animator).getClip("fly").play()
    }

    idle() {
        this.getComponent(Animator).getClip("idle").play()
    }

    // Play walking animation
    walk() {
        this.getComponent(Animator).getClip("walk").play()
    }

    run() {
        this.getComponent(Animator).getClip("run").play()
    }

    // Bug workaround: otherwise the next animation clip won't play
    stopAnimations() {
        this.getComponent(Animator).getClip("walk").stop()
        this.getComponent(Animator).getClip("attack").stop()
    }
    remove() {
        if (!this.removed) {
            engine.removeEntity(this)
            this.removed = true
            if (this.onRemove) {
                this.onRemove()
            }
        }
    }
}
