import { InputType } from "./enums"

class _InputManager {
    listeners: { [input: number]: { (value?): void }[] } = {}

    constructor() {
        this.init()
        const input = Input.instance
        // 'E' key
        input.subscribe("BUTTON_DOWN", ActionButton.PRIMARY, false, (e) => {
            log("E button down", this.listeners[InputType.KEY_E].length)
            for (let i = 0; i < this.listeners[InputType.KEY_E].length; i++) {
                this.listeners[InputType.KEY_E][i]()
            }
        })
        // 'F' key
        input.subscribe("BUTTON_DOWN", ActionButton.SECONDARY, false, (e) => {
            log("F button down", this.listeners[InputType.KEY_F].length)
            for (let i = 0; i < this.listeners[InputType.KEY_F].length; i++) {
                this.listeners[InputType.KEY_F][i]()
            }
        })

        // '1' on PC
        input.subscribe("BUTTON_DOWN", ActionButton.ACTION_3, false, (e) => {
            log("1 button down", this.listeners[InputType.KEY_1].length)
            for (let i = 0; i < this.listeners[InputType.KEY_1].length; i++) {
                this.listeners[InputType.KEY_1][i]()
            }
        })

        // '2' on PC
        input.subscribe("BUTTON_DOWN", ActionButton.ACTION_4, false, (e) => {
            log("2 button down", this.listeners[InputType.KEY_2].length)
            for (let i = 0; i < this.listeners[InputType.KEY_2].length; i++) {
                this.listeners[InputType.KEY_2][i]()
            }
        })

        // '3' on PC
        input.subscribe("BUTTON_DOWN", ActionButton.ACTION_5, false, (e) => {
            log("3 button down", this.listeners[InputType.KEY_3].length)
            for (let i = 0; i < this.listeners[InputType.KEY_3].length; i++) {
                this.listeners[InputType.KEY_3][i]()
            }
        })

        // '4' on PC
        input.subscribe("BUTTON_DOWN", ActionButton.ACTION_6, false, (e) => {
            log("4 button down", this.listeners[InputType.KEY_4].length)
            for (let i = 0; i < this.listeners[InputType.KEY_4].length; i++) {
                this.listeners[InputType.KEY_4][i]()
            }
        })
    }

    init() {
        this.listeners[InputType.KEY_E] = []
        this.listeners[InputType.KEY_F] = []
        this.listeners[InputType.KEY_1] = []
        this.listeners[InputType.KEY_2] = []
        this.listeners[InputType.KEY_3] = []
        this.listeners[InputType.KEY_4] = []
    }

    addListener(event: { (value?): void }, type: InputType) {
        // log("InputManager > addListener > " + type)
        this.listeners[type].push(event)
    }

    removeListener(event: { (value?): void }, type: InputType) {
        // log("InputerManager > removeListener > " + type)
        let index = this.listeners[type].indexOf(event)
        if (index > -1) {
            this.listeners[type].splice(index, 1)
        } else {
            // log("InputManager > removeListener > Listener does not exist!")
        }
    }

    removeAllListeners(type: InputType = InputType.UNKNOWN) {
        if (type != InputType.UNKNOWN) {
            this.listeners[type] = []
        } else {
            this.init()
        }
    }
}

export const InputManager = new _InputManager()