import mongoose from "mongoose"

const adminLogSchema = new mongoose.Schema({
    adminId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    action: {
        type: String,
        enum: ["edit_balance" , "manual_result", "user_ban", "promote_admin"]
    },
    targetUserId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    details: {
        type: Object
    }
}, {timestamps: true})

export const AdminLog = new mongoose.model("AdminLog", adminLogSchema)