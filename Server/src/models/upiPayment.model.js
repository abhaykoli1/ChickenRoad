import mongoose from "mongoose";

const upiPaymentSchema = new mongoose.Schema({
    razorpay_order_id: {
        type: String,
        required: true
    },
    razorpay_payment_id: {
        type: String,
        required: true
    },
    razorpay_signature: {
        type: String,
        required: true
    }
},)

export const UPIPayment = new mongoose.model("UPIPayment", upiPaymentSchema)