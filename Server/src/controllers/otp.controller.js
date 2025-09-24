import { asyncHandler } from "../utils/asyncHandler.js";
import { otpLogs } from "../models/otpLogs.model.js";
import { User } from "../models/user.model.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { generateOTP, sendEmail } from "../utils/otpService.js";


const verifyUserOtp = asyncHandler(async (req, res) => {
    const { userId, emailOTP } = req.body;

    if (!emailOTP) {
        throw new apiError(400, "OTP is required.");
    }

    const otpRecord = await otpLogs.findOne({ userId });
    console.log(otpRecord)

    if (!otpRecord || otpRecord.verified) {
        throw new apiError(400, "OTP is invalid or already used.");
    }

    // if (otpRecord.expiresAt < Date.now()) {
    //     await otpLogs.deleteOne({ userId });
    //     await User.deleteOne({ _id: userId });
    //     throw new apiError(410, "OTP expired. Please register again.");
    // }

    const isEmailValid = emailOTP && otpRecord.emailOTP === emailOTP;

    if (!isEmailValid) {
        throw new apiError(400, "Incorrect OTP.");
    }

    // ✅ Verified through one correct OTP
    await User.findByIdAndUpdate(userId, { isVerified: true });
    await otpLogs.findByIdAndUpdate(otpRecord._id, { verified: true });

    return res.status(200).json(
        new apiResponse(200, null, "✅ Account verified successfully")
    );
});

const resendOTP = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        throw new apiError(400, "User ID is required.");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new apiError(404, "User not found.");
    }

    if (user.isVerified) {
        throw new apiError(400, "User is already verified.");
    }

    // Generate new OTP
    const newEmailOTP = generateOTP();

    // Upsert OTP (update if exists, else create)
    const otpRecord = await otpLogs.findOneAndUpdate(
        { userId },
        {
            emailOTP: newEmailOTP,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
            verified: false,
        },
        { upsert: true, new: true }
    );

    await sendEmail(email, `${emailOTP}`);

    return res.status(200).json(
        new apiResponse(200, null, "📩 OTP resent successfully")
    );
})

export {
    verifyUserOtp,
    resendOTP
}