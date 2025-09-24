import { asyncHandler } from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js"
import { apiResponse } from "../utils/apiResponse.js"
import { GameRound } from "../models/gameRound.model.js";
import { GameVisibility } from "../models/gameVisibility.model.js"
import { User } from "../models/user.model.js";
import { AdminAccess } from "../models/adminAccess.model.js";
import { GameHistory } from "../models/gameHistory.model.js";

const createGameRound = asyncHandler(async (req, res) => {
  const { gameType, multipliers, startTime, endTime } = req.body;

  if (!gameType || !multipliers || !startTime || !endTime) {
    throw new apiError(400, "All fields are required");
  }

  const round = await GameRound.create({
    gameType,
    multipliers,
    startTime,
    endTime,
    status: "scheduled",
    createdByAdmin: true,
    createdByBot: false
  });

  return res.status(201).json(new apiResponse(201, round, "✅ Game round created successfully"));
});

const getAllGameRounds = asyncHandler(async (req, res) => {
  const rounds = await GameRound.find().sort({ startTime: -1 });
  return res.status(200).json(new apiResponse(200, rounds, "📋 All scheduled rounds fetched"));
});

const updateGameRound = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const updatedRound = await GameRound.findByIdAndUpdate(id, updates, { new: true });

  if (!updatedRound) {
    throw new apiError(404, "Game round not found");
  }

  return res.status(200).json(new apiResponse(200, updatedRound, "🛠 Round updated successfully"));
});

const deleteGameRound = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deleted = await GameRound.findByIdAndDelete(id);

  if (!deleted) {
    throw new apiError(404, "Game round not found");
  }

  return res.status(200).json(new apiResponse(200, null, "🗑️ Round deleted successfully"));
});

const updateGameVisibility = asyncHandler(async (req, res) => {
  const { gameType, isVisible } = req.body;

  if (!["chicken", "aviator", "color", "mining"].includes(gameType)) {
    throw new apiError(400, "Invalid game type");
  }

  const result = await GameVisibility.findOneAndUpdate(
    { gameType },
    { isVisible },
    { upsert: true, new: true }
  );

  return res.status(200).json(
    new apiResponse(200, result, `✅ Visibility updated for ${gameType}`)
  );
});

const addAdmin = asyncHandler(async (req, res) => {
  const { name, email, phone, password, accessPages = [] } = req.body

  const existedUser = await User.findOne({
    $or: [{ phone }, { email }]
  })

  if (existedUser) {
    throw new apiError(409, "User with email or username already exists")
  }

  const user = await User.create({
    fullName: name,
    email,
    password,
    phoneNumber: phone,
    isVerified: true,
    role: "admin"
  })

  await AdminAccess.create({
    user: user._id,
    role: "admin",
    accessPages
  });

  return res.status(201).json(
    new apiResponse(200, user, "✅ Admin created Successfully")
  )

})

const updateAdmin = asyncHandler(async (req, res) => {
  const { email, fullName, password, phoneNumber, accessPages = [] } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.role !== "admin") {
    throw new apiError(404, "Admin user not found");
  }

  user.fullName = fullName || user.fullName;
  user.email = email || user.email;
  user.phoneNumber = phoneNumber || user.phoneNumber;
  user.password = password || user.password;
  await user.save();

  await AdminAccess.findOneAndUpdate(
    { user: user._id },
    { accessPages },
    { new: true, upsert: true }
  );

  return res.status(200).json(
    new apiResponse(200, user, "✅ Admin updated successfully")
  );
});


const deleteAdmin = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.role !== "admin") {
    throw new apiError(404, "Admin user not found");
  }

  await AdminAccess.deleteOne({ user: user._id });
  await User.deleteOne({ _id: user._id });

  return res.status(200).json(
    new apiResponse(200, null, "✅ Admin deleted successfully")
  );
});

const getAllAdmins = asyncHandler(async (req, res) => {
  // Find all users with role "admin"
  const admins = await User.find({ role: "admin" })

  if (!admins.length) {
    throw new apiError(404, "No admins found");
  }

  // Get access pages for each admin
  const adminData = await Promise.all(
    admins.map(async (admin) => {
      const access = await AdminAccess.findOne({ user: admin._id });
      return {
        _id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        phoneNumber: admin.phoneNumber,
        isVerified: admin.isVerified,
        createdAt: admin.createdAt,
        accessPages: access?.accessPages || [],
      };
    })
  );

  return res.status(200).json(
    new apiResponse(200, adminData, "✅ All admins fetched successfully")
  );
});

const getAdminAccessPages = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new apiError(401, "Unauthorized access");
  }

  const accessRecord = await AdminAccess.findOne({ user: userId });

  if (!accessRecord) {
    throw new apiError(404, "Admin access record not found");
  }

  return res.status(200).json(
    new apiResponse(200, accessRecord.accessPages, "✅ Access pages retrieved")
  );
});

const getGameHistoryByUserAndType  = async (req, res) => {
    const { userId, gameType } = req.params; // Extract userId and gameType from the request parameters

    try {
        // Find game history by userId and gameType
        const history = await GameHistory.find({ 
            userId, 
            gameType 
        });

        // Send the found history data
        return res.status(200).json({
            message: "Game history retrieved successfully",
            data: history
        });
    } catch (error) {
        // Handle any errors and send a 500 response
        return res.status(500).json({
            message: "An error occurred while fetching game history",
            error: error.message
        });
    }
};

export {
  createGameRound,
  getAllGameRounds,
  updateGameRound,
  deleteGameRound,
  updateGameVisibility,
  addAdmin,
  updateAdmin,
  deleteAdmin,
  getAllAdmins,
  getAdminAccessPages,
  getGameHistoryByUserAndType 
}