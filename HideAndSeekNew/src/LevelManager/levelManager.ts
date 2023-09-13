import { WriteXpToServer } from "../api/api"
import { LEVEL_TYPES } from "./types"
import * as ui from "@dcl/ui-scene-utils"
import { LEVEL_TYPE_CONFIG } from "./config"



interface LevelItem {
    type: LEVEL_TYPES;
    level: number;
    xp: number;
}

interface onUpdatePayload {
    type: LEVEL_TYPES;
    level: number;
    xp: number;
    total: number;
    levelChange?: boolean;
}

export class LevelManager {
    levels: Record<LEVEL_TYPES | string, LevelItem>;
    labelMap: Record<LEVEL_TYPES | string, ui.CornerLabel>;

    public onUpdate?: (payload: onUpdatePayload) => void

    constructor() {
        this.levels = {}
        this.labelMap = {};
    }

    static xpRequiredForNextLevel(level: number) {
        return 500 * Math.pow(level, 2) - 500 * level + 1000
    }

    static getLabelText(name: string, level: number, xp: number) {
        return `${name} Level: ${level} xp: ${xp}`
    }

    createOrUpdateLevelLabel(type: LEVEL_TYPES) {
        const { level, xp } = this.levels?.[type] || {}
        log(type)
        const { label, xOffset, yOffSet, noLabel } = LEVEL_TYPE_CONFIG?.[type] || { noLabel: true };

        if (!noLabel) {
            if (!this.labelMap[type]) {
                this.labelMap[type] = new ui.CornerLabel(
                    LevelManager.getLabelText(label, level, xp),
                    xOffset,
                    yOffSet,
                    Color4.White(),
                    13
                )
            } else {
                this.labelMap[type].set(LevelManager.getLabelText(label, level, xp))
            }
        }
    }

    updateItem(type: LEVEL_TYPES, item: LevelItem) {
        this.levels[type] = {
            type,
            ...(this.levels[type] || {}),
            ...item,
        }
        this.createOrUpdateLevelLabel(type)
    }

    static shouldLevelUp(level: number, xp: number) {
        return xp >= LevelManager.xpRequiredForNextLevel(level)
    }

    addXp(type: LEVEL_TYPES, xp: number) {
        const currentXp = this.levels[type]?.xp || 0
        let newXp = xp + currentXp
        const currentLevel = this.levels[type]?.level || 1
        const shouldLevelUp = LevelManager.shouldLevelUp(currentLevel, newXp)
        const increaseBy = (shouldLevelUp ? 1 : 0)
        const newLevel = currentLevel + increaseBy

        this.updateItem(type, {
            level: newLevel,
            xp: newXp,
            type
        })

        this.onUpdate?.({
            type: type,
            level: newLevel,
            xp: xp,
            total: newXp,
            levelChange: shouldLevelUp
        })
        WriteXpToServer(type, newLevel, xp, newXp)
    }

    getXp(type: LEVEL_TYPES) {
        return this.levels[type]?.xp || 0
    }

    getLevel(type: LEVEL_TYPES) {
        return this.levels[type]?.level || 1
    }

    setLevel(type: LEVEL_TYPES, level: number, xp: number = 0) {
        this.levels[type] = {
            type,
            level,
            xp,
        }
    }
}
