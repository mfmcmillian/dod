

export class UIBarManager {
    frame: UIImage;
    barImage: UIImage;
    width = 200;

    constructor(canvas: UIShape, positionX: number, positionY: number, barTexture?: Texture, percent = 1) {
        this.frame = new UIImage(
            canvas,
            new Texture("images/Status_barredfrrame.png")
        )
        this.frame.width = "200px"
        this.frame.height = "21px"
        this.frame.sourceWidth = this.width
        this.frame.sourceHeight = 21
        this.frame.isPointerBlocker = true
        this.frame.positionX = positionX
        this.frame.positionY = positionY
        this.frame.visible = true

        this.barImage = new UIImage(
            this.frame,
            barTexture || new Texture("images/Status_barred.png")
        )
        this.barImage.hAlign = "left"
        this.barImage.height = "21px"
        this.barImage.sourceHeight = 21
        this.barImage.isPointerBlocker = true
        this.barImage.positionX = 0
        this.barImage.positionY = 0
        this.barImage.visible = true
        this.update(percent);
    }

    update(percent: number) {
        this.barImage.width = `${this.width * percent}px`;
        this.barImage.sourceWidth = this.width * percent
    }

    hide() {
        this.frame.visible = false
        this.barImage.visible = false
    }

    show() {
        this.frame.visible = true
        this.barImage.visible = true
    }
}
