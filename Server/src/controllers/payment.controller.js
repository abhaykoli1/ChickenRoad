// import { instance } from "../app.js";
import { UPIPayment } from "../models/upiPayment.model.js";
import { User } from "../models/user.model.js";
import { WalletTransaction } from "../models/walletTransaction.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import crypto from "crypto"

const checkout = asyncHandler(async (req, res) => {
    const options = {
        amount: Number(req.body.amount * 100),  // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
    };
    instance.orders.create(options);

    res.status(200).json({
        success: true
    })
})

const paymentVerification = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, amount } = req.body

    const body = razorpay_order_id + "|" + razorpay_payment_id

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
        .update(body.toString())
        .digest("hex");

    const isAuthanticated = expectedSignature === razorpay_signature

    if (isAuthanticated) {
        const user = await User.findById(userId);
        if (!user) {
            throw new apiError(404, "User not found");
        }

        await WalletTransaction.create({
            userId,
            type: "deposit",
            amount,
            method: "UPI",
            status: "approved",
            adminVerified: true,
            remark: "Payment successful"
        });

        user.walletBalance += amount;
        await user.save();

        await UPIPayment.create({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        })

        res.redirect(
            `process.env.FRONTEND_URL/paymentsuccess?reference=${razorpay_payment_id}`
        )
    } else {
        res.status(400).json({
            success: false
        })
    }
})

export {
    checkout,
    paymentVerification
}