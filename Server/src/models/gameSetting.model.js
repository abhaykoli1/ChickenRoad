import mongoose from "mongoose"

const gameSettingSchema = new mongoose.Schema({
    gameType: {
        type: String,
        enum: ["chicken", "aviator", "color", "mining"]
    },
    isActive: {
        type: Boolean,
        default: true
    },
    currentState: {
        type: Object
    },
    controlledByBot: {
        type: Boolean,
        default: true
    },
}, {timestamps: true})

export const GameSetting = new mongoose.model("GameSetting", gameSettingSchema)