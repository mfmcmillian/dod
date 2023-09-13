export const enum InputType {
    UNKNOWN = -1,
    KEY_E, // Primary button
    KEY_F, // Secondary button
    KEY_1,
    KEY_2,
    KEY_3,
    KEY_4
}

export enum Alliance {
    DISCIPLES,
    REBELS,
    NONE,
}

export enum Race {
    UNDEAD,
    ORC,
    HUMAN,
    ELF,
    NONE,
}

export enum Class {
    CLERIC,
    MAGE,
    THIEF,
    RANGER,
    BERSERKER,
    NONE,
}

export enum PetType {
    OWL,
    DRAGON,
    PHOENIX
}

export enum ButtonType {
    DEFAULT, // off to on
    REVERSE, // on to off
    TOGGLE
}