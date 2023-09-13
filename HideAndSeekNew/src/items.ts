export enum itemTypes {
    SWORD = "sword",
    HELMET = "helmet",
    SHIELD = "shield",
}

export enum buffTypes {
    ATTACK = "attack",
    DEFENSE = "defense",
    LUCK = "luck",
}

export interface buffItem {
    type: buffTypes
    value: number
}

export class Item {
    id: number
    name: string
    type: itemTypes
    image: string
    buff: buffItem[] | buffItem
    needs?: number[]
    constructor(
        id: number,
        name: string,
        type: itemTypes,
        buff: buffItem | buffItem[],
        image: string = ""
    ) {
        this.id = id
        this.name = name
        this.type = type
        this.buff = buff
        this.image = image
    }
}
export const ItemTree = {
    0: {
        name: "wooden sword",
        type: itemTypes.SWORD,
        image: "images/woodensword.png",
        sprite: "woodensword.png",
        buff: {
            type: buffTypes.ATTACK,
            value: 2,
        },
        craftingMaterials: {
            wood: 50,
            chicken: 50,
            rock: 50,
            bone: 0,
        },
    },
    1: {
        name: "iron sword",
        type: itemTypes.SWORD,
        image: "images/ironsword.png",
        sprite: "ironsword.png",
        buff: {
            type: buffTypes.ATTACK,
            value: 6,
        },
        craftingMaterials: {
            wood: 4000,
            chicken: 5000,
            rock: 2500,
            bone: 500,
        },
        needs: [0],
    },
    2: {
        name: "gold sword",
        type: itemTypes.SWORD,
        image: "images/goldsword.png",
        sprite: "goldsword.png",
        buff: {
            type: buffTypes.ATTACK,
            value: 12,
        },
        craftingMaterials: {
            wood: 12000,
            chicken: 15000,
            rock: 7500,
            bone: 1500,
        },
        needs: [1],
    },
    3: {
        name: "wooden helmet",
        type: itemTypes.HELMET,
        image: "images/woodenhelm.png",
        sprite: "woodenhelm.png",
        buff: {
            type: buffTypes.LUCK,
            value: 1,
        },
        craftingMaterials: {
            wood: 50,
            chicken: 50,
            rock: 50,
            bone: 0,
        },
    },
    4: {
        name: "iron helmet",
        type: itemTypes.HELMET,
        image: "images/ironhelm.png",
        sprite: "ironhelm.png",
        buff: {
            type: buffTypes.LUCK,
            value: 2,
        },
        craftingMaterials: {
            wood: 4000,
            chicken: 5000,
            rock: 2500,
            bone: 500,
        },
        needs: [3],
    },
    5: {
        name: "gold helmet",
        type: itemTypes.HELMET,
        image: "images/goldhelm.png",
        sprite: "goldhelm.png",
        buff: {
            type: buffTypes.LUCK,
            value: 3,
        },
        craftingMaterials: {
            wood: 12000,
            chicken: 15000,
            rock: 7500,
            bone: 1500,
        },
        needs: [4],
    },
    6: {
        name: "wooden shield",
        type: itemTypes.SHIELD,
        image: "images/woodenshield.png",
        sprite: "woodenshield.png",
        buff: {
            type: buffTypes.DEFENSE,
            value: 0.05,
        },
        craftingMaterials: {
            wood: 50,
            chicken: 50,
            rock: 50,
            bone: 0,
        },
    },
    7: {
        name: "iron shield",
        type: itemTypes.SHIELD,
        image: "images/ironshield.png",
        sprite: "ironshield.png",
        buff: {
            type: buffTypes.DEFENSE,
            value: 0.1,
        },
        craftingMaterials: {
            wood: 4000,
            chicken: 5000,
            rock: 2500,
            bone: 500,
        },
        needs: [6],
    },
    8: {
        name: "gold shield",
        type: itemTypes.SHIELD,
        image: "images/goldshield.png",
        sprite: "goldshield.png",
        buff: {
            type: buffTypes.DEFENSE,
            value: 0.15,
        },
        craftingMaterials: {
            wood: 12000,
            chicken: 15000,
            rock: 7500,
            bone: 1500,
        },
        needs: [7],
    },
}

export const dailyRewards = [
    { image: "images/ore.png", name: "ore", value: 0 },
    { image: "images/chicken.png", name: "chicken", value: 0 },
    { image: "images/berries.png", name: "berries", value: 0 },
    { image: "images/tree.png", name: "tree", value: 0 },
    { image: "images/monster.png", name: "bone", value: 0 },
    { image: "images/coin.png", name: "coin", value: 0 },
    { image: "images/ore.png", name: "ore", value: 0 },
    { image: "images/chicken.png", name: "chicken", value: 0 },
    { image: "images/berries.png", name: "berries", value: 0 },
    { image: "images/tree.png", name: "tree", value: 0 },
    { image: "images/monster.png", name: "bone", value: 0 },
    { image: "images/coin.png", name: "coin", value: 0 },
    { image: "images/ore.png", name: "ore", value: 0 },
    { image: "images/chicken.png", name: "chicken", value: 0 },
    { image: "images/berries.png", name: "berries", value: 0 },
    { image: "images/tree.png", name: "tree", value: 0 },
    { image: "images/monster.png", name: "bone", value: 0 },
    { image: "images/coin.png", name: "coin", value: 0 },
    { image: "images/ore.png", name: "ore", value: 0 },
    { image: "images/chicken.png", name: "chicken", value: 0 },
    { image: "images/berries.png", name: "berries", value: 0 },
    { image: "images/tree.png", name: "tree", value: 0 },
    { image: "images/monster.png", name: "bone", value: 0 },
    { image: "images/coin.png", name: "coin", value: 0 },
    { image: "images/ore.png", name: "ore", value: 0 },
    { image: "images/chicken.png", name: "chicken", value: 0 },
    { image: "images/berries.png", name: "berries", value: 0 },
    { image: "images/tree.png", name: "tree", value: 0 },
    { image: "images/monster.png", name: "bone", value: 0 },
    { image: "images/coin.png", name: "coin", value: 0 },
    { image: "images/ore.png", name: "ore", value: 0 },
    { image: "images/chicken.png", name: "chicken", value: 0 },
    { image: "images/berries.png", name: "berries", value: 0 },
    { image: "images/tree.png", name: "tree", value: 0 },
    { image: "images/monster.png", name: "bone", value: 0 },
    { image: "images/coin.png", name: "coin", value: 0 },
]
