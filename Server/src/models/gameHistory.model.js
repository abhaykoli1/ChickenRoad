import mongoose from "mongoose"

const gameHistorySchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    gameType: {
        type: String,
        required: true
    },
    result: {
        type: String,
        required: true
    },
    betAmount: {
        type: Number,
        required: true
    },
    payoutAmount: {
        type: Number,
        required: true,
        default: 0
    },
    win: {
        type: Boolean,
        default: false
    },
    roundId: {
        type: String,
    },
}, {timestamps: true})

export const GameHistory = new mongoose.model("GameHistory", gameHistorySchema)