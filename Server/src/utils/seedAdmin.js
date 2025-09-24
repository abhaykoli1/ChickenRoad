import { AdminAccess } from "../models/adminAccess.model.js";
import { User } from "../models/user.model.js"

export const seedDefaultAdmin = async () => {
    const defaultAdminEmail = process.env.DEFAULT_ADMIN_EMAIL;

    // Check if the admin already exists
    const existingUser = await User.findOne({ email: defaultAdminEmail });
    if (existingUser) {
        const existingAdminAccess = await AdminAccess.findOne({ user: existingUser._id });
        if (existingAdminAccess) {
            console.log("✅ Default admin already exists.");
            return;
        }

        // Create admin access for the existing user
        await AdminAccess.create({
            user: existingUser._id,
            role: "admin",
            accessPages: ["transaction", "games", "withdraw-requests", "telegram", "admin-management", "deposite"]
        });

        console.log("✅ Admin access added to existing user.");
        return;
    }

    // Create the default admin user
    const newUser = await User.create({
        fullName: "Default Admin",
        email: defaultAdminEmail,
        phoneNumber: "+911234567890",
        password: process.env.DEFAULT_ADMIN_PASSWORD,
        isVerified: true,
        role: "admin"
    });

    // Create AdminAccess
    await AdminAccess.create({
        user: newUser._id,
        role: "admin",
        accessPages: ["transaction", "games", "withdraw-requests", "telegram", "admin-management", "deposite"]
    });

    console.log("✅ Default admin created successfully.");
};
