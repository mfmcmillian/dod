import getRandomInt from "./utils/getRandomInt"
import getRandomIntRange from "./utils/randomIntRange"

export class Character extends Entity {
    health: number
    attack: number
    xp: number
    level: number
    baseDefense: number
    maxHealth: number
    minLuck: number = 0

    constructor(
        attack: number,
        xp: number,
        level: number,
        health: number = 1,
        baseDefense: number = 0.01
    ) {
        super()
        this.attack = attack
        this.health = health
        this.xp = xp
        this.level = level
        this.baseDefense = baseDefense
        this.maxHealth = health
    }

    reduceHealth(attack: number) {
        log('reducehealth', attack)
        if (this.health - attack >= 0) {
            this.health -= Math.round(attack)
        } else {
            this.health = 0
        }
        log(this.health, this.getHealthScaled())
    }

    getHealthScaled() {
        return this.health / this.maxHealth
    }
    rollDice() {
        const max = 20 + this.level / 2
        const min = (this.minLuck / 100) * max
        const randomNumber = getRandomIntRange(Math.round(min), Math.round(max))
        return randomNumber
    }
    // rollDice() {
    //     const randomNumber = getRandomIntRange(
    //         this.minLuck,
    //         this.getLuckRange()
    //     )
    //     return randomNumber
    // }
    getLuckRange() {
        return this.level
    }
    getDefensePercent() {
        const def = this.baseDefense * getRandomInt(Math.round(this.level / 2))
        return def >= 1 ? 0.99 : def
    }
}
