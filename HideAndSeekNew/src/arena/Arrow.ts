import * as utils from '@dcl/ecs-scene-utils'

export class Arrow extends Entity {
    constructor(model: GLTFShape, time?: number) {
        super()
        engine.addEntity(this)
        this.addComponent(model)
        this.addComponent(new Transform())
        this.addComponent(new utils.ExpireIn(time * 1000)) // Disappears after x amount of seconds
    }
}
