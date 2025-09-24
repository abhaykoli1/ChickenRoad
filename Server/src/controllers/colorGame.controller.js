import ColorGameRound from "../models/ColorGameRound.model.js";
import Bet from "../models/Bet.model.js";
import { User } from "../models/user.model.js";
import { GameHistory } from "../models/gameHistory.model.js";
import { GameRound } from "../models/gameRound.model.js";

let currentRound = null;
let gameTimer = null;
const ROUND_DURATION = 60000; // 1 minute in milliseconds

// Game rules
const colorRules = {
  green: [1, 3, 7, 9],
  red: [2, 4, 6, 8],
  violet: [0, 5],
};

function getColorByNumber(number) {
  for (const [color, numbers] of Object.entries(colorRules)) {
    if (numbers.includes(number)) {
      return color;
    }
  }
  return "violet"; // fallback
}

function getSizeByNumber(number) {
  return number >= 5 ? "big" : "small";
}

// Generate period based on a specific date
function generatePeriod(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  const second = String(date.getSeconds()).padStart(2, "0");

  return `${year}${month}${day}${hour}${minute}32`;
}

// Create a new round
export async function createNewRound() {
  try {
    const startTime = new Date();
    const period = generatePeriod(startTime); // use startTime for period
    const endTime = new Date(startTime.getTime() + ROUND_DURATION);

    currentRound = new ColorGameRound({
      period,
      winningNumber: 0,
      winningColor: "violet",
      size: "small",
      startTime,
      endTime,
      isCompleted: false,
    });

    await currentRound.save();
    return currentRound;
  } catch (error) {
    console.error("Error creating new round:", error);
    throw error;
  }
}

// Get current round info
export async function getCurrentRound() {
  if (!currentRound) return null;

  const now = new Date();
  const timeLeft = Math.max(0, Math.floor((currentRound.endTime - now) / 1000));

  return {
    period: currentRound.period,
    startTime: currentRound.startTime,
    endTime: currentRound.endTime,
    timeLeft,
    isActive: timeLeft > 0,
  };
}

// Get current + next 20 rounds
export async function getPeriodsColor() {
  try {
    const current = await getCurrentRound();
    if (!current) return { error: "No current round" };

    const periods = [];

    // Add current round
    periods.push({
      type: "current",
      period: current.period,
      startTime: current.startTime,
      endTime: current.endTime,
    });

    // Generate next 20 rounds
    let lastEndTime = new Date(current.endTime);
    for (let i = 0; i < 20; i++) {
      const startTime = new Date(lastEndTime.getTime() + i * ROUND_DURATION);
      const endTime = new Date(startTime.getTime() + ROUND_DURATION);
      periods.push({
        type: "future",
        period: generatePeriod(startTime),
        startTime,
        endTime,
      });
    }

    return periods;
  } catch (error) {
    console.error("Error in getPeriodsColor:", error);
    throw error;
  }
}

// Complete current round
export async function completeCurrentRound() {
  if (!currentRound) return null;

  try {
    let winningNumber = Math.floor(Math.random() * 10);
    const now = new Date();

    const scheduledRound = await GameRound.findOne({
      gameType: "color",
      startTime: { $lte: now },
      endTime: { $gt: now },
      status: { $in: ["scheduled", "active"] },
    }).sort({ startTime: -1 });

    if (scheduledRound) {
      winningNumber = scheduledRound.multipliers[0];
    }

    const winningColor = getColorByNumber(winningNumber);
    const size = getSizeByNumber(winningNumber);

    currentRound.winningNumber = winningNumber;
    currentRound.winningColor = winningColor;
    currentRound.size = size;
    currentRound.isCompleted = true;

    await currentRound.save();

    await processBets(currentRound);

    return currentRound;
  } catch (error) {
    console.error("Error completing round:", error);
    throw error;
  }
}

// Process bets for a round
async function processBets(round) {
  try {
    const bets = await Bet.find({ period: round.period });

    for (const bet of bets) {
      let isWon = false;
      let payout = 0;

      switch (bet.betType) {
        case "color":
          isWon = bet.betValue === round.winningColor;
          payout = isWon
            ? bet.amount *
              bet.multiplier *
              (bet.betValue === "violet" ? 4.5 : 2)
            : 0;
          break;
        case "number":
          isWon = parseInt(bet.betValue) === round.winningNumber;
          payout = isWon ? bet.amount * bet.multiplier * 9 : 0;
          break;
        case "size":
          isWon = bet.betValue === round.size;
          payout = isWon ? bet.amount * bet.multiplier * 2 : 0;
          break;
      }

      const user = await User.findById(bet.userId);
      if (user && isWon && payout > 0) {
        user.walletBalance += payout;
        await user.save();
      }

      bet.isWon = isWon;
      bet.payout = payout;
      await bet.save();

      await GameHistory.create({
        userId: bet.userId,
        gameType: "color",
        result: isWon ? "win" : "loss",
        betAmount: bet.amount,
        payoutAmount: payout,
        win: isWon,
        roundId: round._id?.toString() || null,
      });
    }
  } catch (error) {
    console.error("Error processing bets:", error);
  }
}

// Initialize game timer loop
export function initializeGameTimer(io) {
  async function startGameLoop() {
    try {
      await createNewRound();
      console.log(`New round started: ${currentRound.period}`);

      io.emit("newRound", {
        period: currentRound.period,
        startTime: currentRound.startTime,
        endTime: currentRound.endTime,
        duration: ROUND_DURATION,
      });

      let timeLeft = ROUND_DURATION / 1000;
      const countdown = setInterval(() => {
        timeLeft--;
        io.emit("countdown", { timeLeft });
        if (timeLeft <= 0) clearInterval(countdown);
      }, 1000);

      gameTimer = setTimeout(async () => {
        try {
          const completedRound = await completeCurrentRound();
          console.log(
            `Round completed: ${completedRound.period}, Winner: ${completedRound.winningNumber}`
          );

          io.emit("roundResult", {
            period: completedRound.period,
            winningNumber: completedRound.winningNumber,
            winningColor: completedRound.winningColor,
            size: completedRound.size,
          });

          setTimeout(startGameLoop, 5000);
        } catch (error) {
          console.error("Error in game loop:", error);
          setTimeout(startGameLoop, 5000);
        }
      }, ROUND_DURATION);
    } catch (error) {
      console.error("Error starting game loop:", error);
      setTimeout(startGameLoop, 5000);
    }
  }

  startGameLoop();
}

// Place a bet
export async function placeBet(betData) {
  try {
    const user = await User.findById(betData.userId);
    if (!user) throw new Error("User not found");
    if (user.walletBalance < betData.amount)
      throw new Error("Insufficient wallet balance");

    user.walletBalance -= betData.amount;
    await user.save();

    const bet = new Bet(betData);
    await bet.save();
    return bet;
  } catch (error) {
    console.error("Error placing bet:", error);
    throw error;
  }
}

// Get game history
export async function getGameHistory(limit = 50) {
  try {
    const history = await ColorGameRound.find({ isCompleted: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("period winningNumber winningColor size createdAt");

    const latestColorRound = await GameRound.findOne({
      gameType: "color",
    }).sort({ createdAt: -1 });

    history.forEach(async (item) => {
      if (item.period === latestColorRound.period) {
        await ColorGameRound.findByIdAndUpdate(
          item.id,
          { $set: { winningNumber: 6 } },
          { new: true }
        );
      }
    });

    return history;
  } catch (error) {
    console.error("Error fetching game history:", error);
    throw error;
  }
}

// Get user bets
export async function getUserBets(userId, limit = 50) {
  try {
    const bets = await Bet.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("period");

    return bets;
  } catch (error) {
    console.error("Error fetching user bets:", error);
    throw error;
  }
}
