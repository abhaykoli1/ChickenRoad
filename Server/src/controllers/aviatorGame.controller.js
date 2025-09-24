import AviatorRound from "../models/aviatorRound.model.js";
import { User } from "../models/user.model.js";
import { GameHistory } from "../models/gameHistory.model.js";
import Bet from "../models/Bet.model.js";
import { GameRound } from "../models/gameRound.model.js";
// import { getGameHistory } from './colorGame.controller.js';

// Game State
let currentRound = null;
let gameTimer = null;
let currentMultiplier = 1.0;
let crashPoint = 0;
let isGameRunning = false;
let bets = []; // Array to hold live bets

// Config
const TICK_INTERVAL = 200; // ms
const ROUND_GAP = 5000; // Gap between rounds in ms
const START_MULTIPLIER = 1.0;
const MULTIPLIER_INCREMENT = 0.05;

// Random crash point generator
function generateCrashPoint() {
  return parseFloat((Math.random() * 5 + 1.1).toFixed(2));
}

// Create a new round
export async function createNewRound() {
  try {
    const now = new Date();

    const scheduledRound = await GameRound.findOne({
      gameType: "aviator",
      startTime: { $lte: now },
      endTime: { $gt: now },
      status: { $in: ["scheduled", "active"] },
    }).sort({ startTime: -1 });
    if (scheduledRound) {
      crashPoint = scheduledRound.multipliers[0];
    } else {
      crashPoint = generateCrashPoint();
    }

    currentMultiplier = START_MULTIPLIER;
    bets = [];
    isGameRunning = true;

    const roundId = Date.now().toString();

    currentRound = new AviatorRound({
      roundId,
      crashPoint,
      startTime: new Date(),
      isCompleted: false,
    });

    await currentRound.save();
    return currentRound;
  } catch (error) {
    console.error("Error creating new Aviator round:", error);
    throw error;
  }
}

// Complete current round
export async function completeCurrentRound() {
  if (!currentRound) return null;

  try {
    currentRound.isCompleted = true;
    await currentRound.save();

    // Process losses for non-cashed-out bets
    for (const bet of bets) {
      if (!bet.cashedOut) {
        await GameHistory.create({
          userId: bet.userId,
          gameType: "aviator",
          result: "loss",
          betAmount: bet.betAmount,
          payoutAmount: 0,
          win: false,
          roundId: currentRound._id?.toString() || null,
        });

        const betDoc = new Bet({
          userId: bet.userId,
          roundId: currentRound._id,
          amount: bet.betAmount,
          multiplier: crashPoint,
          isWon: false,
          payout: 0,
        });
        await betDoc.save();
      }
    }

    return currentRound;
  } catch (error) {
    console.error("Error completing Aviator round:", error);
    throw error;
  }
}

// Process cash out for a player
export async function cashOut(userId, io) {
  const bet = bets.find((b) => b.userId === userId && !b.cashedOut);
  if (!bet) throw new Error("No active bet");

  if (currentMultiplier >= crashPoint) throw new Error("Plane crashed");

  const winnings = parseFloat((bet.betAmount * currentMultiplier).toFixed(2));

  const user = await User.findById(userId);
  if (user) {
    user.walletBalance += winnings;
    await user.save();
  }

  bet.cashedOut = true;
  bet.cashOutMultiplier = currentMultiplier;

  await GameHistory.create({
    userId,
    gameType: "aviator",
    result: "win",
    betAmount: bet.betAmount,
    payoutAmount: winnings,
    win: true,
    roundId: currentRound._id?.toString() || null,
  });

  const betDoc = new Bet({
    userId,
    roundId: currentRound._id,
    amount: bet.betAmount,
    multiplier: currentMultiplier,
    isWon: true,
    payout: winnings,
  });
  await betDoc.save();

  if (io) {
    io.emit("newLiveBet", getLiveBets());
  }

  return { winnings, multiplier: currentMultiplier };
}

// Place a bet
export async function placeBet(betData, io) {
  const { userId, amount } = betData;

  if (!isGameRunning) {
    throw new Error("Wait for next round");
  }

  const user = await User.findById(userId);
  if (!user || user.walletBalance < amount) {
    throw new Error("Insufficient wallet balance");
  }

  user.walletBalance -= amount;
  await user.save();

  const newBet = {
    userId,
    betAmount: amount,
    cashedOut: false,
    cashOutMultiplier: null,
  };

  bets.push(newBet);

  // Emit the new live bet to all connected clients
  if (io) {
    io.emit("newLiveBet", getLiveBets());
  }

  return { success: true };
}

// Get live bets for current round
export function getLiveBets() {
  return bets.map((bet) => ({
    userId: bet.userId,
    amount: bet.betAmount,
    cashedOut: bet.cashedOut,
    cashOutMultiplier: bet.cashOutMultiplier,
  }));
}

// Get top bets for current round (e.g., top 5 highest bets)
export function getTopBets() {
  const sortedBets = [...bets].sort((a, b) => b.betAmount - a.betAmount); // Sort descending
  return sortedBets.slice(0, 5); // Top 5 bets
}

// Game timer loop
export function initializeColorGameTimer(io) {
  async function startGameLoop() {
    try {
      const round = await createNewRound();
      bets = [];
      const allHistory = await getGameHistory();

      console.log(`🚀 Aviator round started! Crash at: ${round.crashPoint}x`);

      io.emit("roundStart", { crashPoint, history: allHistory });

      gameTimer = setInterval(async () => {
        if (currentMultiplier >= crashPoint) {
          clearInterval(gameTimer);
          io.emit("roundCrash", { multiplier: crashPoint });

          await completeCurrentRound();
          isGameRunning = false;

          setTimeout(startGameLoop, ROUND_GAP);
        } else {
          currentMultiplier = parseFloat(
            (currentMultiplier + MULTIPLIER_INCREMENT).toFixed(2)
          );
          io.emit("multiplierUpdate", { multiplier: currentMultiplier });
        }
      }, TICK_INTERVAL);
    } catch (error) {
      console.error("Error in Aviator game loop:", error);
      setTimeout(startGameLoop, ROUND_GAP);
    }
  }

  startGameLoop();
}

// Get current round info
export async function getCurrentRound() {
  if (!currentRound) return null;

  return {
    crashPoint,
    multiplier: currentMultiplier,
    isActive: isGameRunning,
    roundId: currentRound._id,
  };
}

// Get game history
export async function getGameHistory(limit = 50) {
  try {
    return await AviatorRound.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("crashPoint createdAt");
  } catch (error) {
    console.error("Error fetching Aviator game history:", error);
    throw error;
  }
}

// Get user bets
export async function getUserBets(userId, limit = 50) {
  try {
    return await GameHistory.find({ userId, gameType: "aviator" })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("roundId");
  } catch (error) {
    console.error("Error fetching Aviator user bets:", error);
    throw error;
  }
}
export async function fetchAllBetsAviator(limit = 50) {
  try {
    return await GameHistory.find({ gameType: "aviator" })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("roundId");
  } catch (error) {
    console.error("Error fetching Aviator user bets:", error);
    throw error;
  }
}
