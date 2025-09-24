import { GameRound } from "../models/gameRound.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { createInterface } from "readline";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import { Api } from "telegram";
import config from "../utils/config.js";

// const apiId = 23416733;
// const apiHash = "e87f3e11b9917aa1cb3c0cd4f9a3c63c";
const apiId = config.telegramApiid;
const apiHash = config.telegramApiHash;
const stringSession = new StringSession(process.env.TELEGRAM_SESSION || "");

const setgameround = asyncHandler(async (req, res) => {
  const { gameType, multipliers, startTime, endTime, channelId, period } =
    req.body;
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });
  await client.connect();
  // ✅ Validate required fields
  if (
    !gameType ||
    !Array.isArray(multipliers) ||
    multipliers.length === 0 ||
    !startTime ||
    !endTime
  ) {
    throw new apiError(
      400,
      "All fields (gameType, multipliers[], startTime, endTime) are required"
    );
  }

  // ✅ Create the game round
  const newGameRound = await GameRound.create({
    gameType,
    multipliers,
    period,
    startTime,
    endTime,
    status: "scheduled",
    createdByBot: false,
    createdByAdmin: true,
    messageSent: false,
  });

  const channel = await client.getEntity(channelId);
  await client.sendMessage(channel, {
    message: `New game round scheduled!\n\nGame: Chicken Road \n\nStart Time: ${new Date(
      startTime
    ).toLocaleString()}\nEnd Time: ${new Date(
      endTime
    ).toLocaleString()}\nPrediction: ${multipliers.join(", ")}`,
  });

  // ✅ Respond with success
  return res
    .status(201)
    .json(
      new apiResponse(201, newGameRound, "✅ Game round scheduled successfully")
    );
});

const getAllGameRounds = asyncHandler(async (req, res) => {
  const { gameType, status } = req.query;

  // Optional filters
  const filter = {};
  if (gameType) filter.gameType = gameType;
  if (status) filter.status = status;

  const rounds = await GameRound.find(filter).sort({ startTime: -1 });

  return res
    .status(200)
    .json(
      new apiResponse(200, rounds, "🎮 All game rounds fetched successfully")
    );
});

const deleteGameRound = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if the ID is provided
  if (!id) {
    throw new apiError(400, "❌ Game round ID is required");
  }

  // Find and delete the game round
  const deleted = await GameRound.findByIdAndDelete(id);

  if (!deleted) {
    throw new apiError(404, "❌ Game round not found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, deleted, "🗑️ Game round deleted successfully"));
});

const updateGameRound = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { gameType, multipliers, startTime, endTime, status, period } =
    req.body;

  // ✅ Validation
  if (
    !gameType ||
    !multipliers ||
    !Array.isArray(multipliers) ||
    !startTime ||
    !endTime
  ) {
    throw new apiError(
      400,
      "All fields (gameType, multipliers[], startTime, endTime) are required"
    );
  }

  // ✅ Find and update
  const updatedRound = await GameRound.findByIdAndUpdate(
    id,
    {
      gameType,
      multipliers,
      startTime,
      endTime,
      status,
      period,
      updatedAt: new Date(),
    },
    { new: true } // return the updated document
  );

  if (!updatedRound) {
    throw new apiError(404, "Game round not found");
  }

  return res
    .status(200)
    .json(
      new apiResponse(200, updatedRound, "✅ Game round updated successfully")
    );
});

export { setgameround, getAllGameRounds, deleteGameRound, updateGameRound };
