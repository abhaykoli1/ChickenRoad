import { User } from "../models/user.model.js";
import { GameHistory } from "../models/gameHistory.model.js";
import { UserGameSession } from "../models/userGameSession.model.js";

let currentMultiplier = 1.0;
let crashPoint = 0;
let isGameRunning = false;
let gameInterval;
let bets = []; // Active bets in current round

const generateCrashPoint = () => parseFloat((Math.random() * 5 + 1.1).toFixed(2));  

const aviatorSocketHandler = (io, socket) => {
  console.log("🎮 Aviator Socket Handler Initialized");

  // Start new round if not running
  if (!isGameRunning) startNewRound(io);

  // 🛠 Place bet
  socket.on("placeBet", async ({ userId, betAmount }) => {
    if (!isGameRunning || currentMultiplier > 1.05) {
      socket.emit("betRejected", { message: "Wait for next round" });
      return;
    }

    const user = await User.findById(userId);
    if (!user || user.walletBalance < betAmount) {
      socket.emit("betRejected", { message: "Insufficient balance" });
      return;
    }

    // Deduct balance
    user.walletBalance -= betAmount;
    await user.save();

    // Store bet in memory
    bets.push({
      userId,
      betAmount,
      cashedOut: false,
      cashOutMultiplier: null
    });

    io.emit("newBet", { userId, betAmount });
  });

  // 💰 Cash out
  socket.on("cashOut", async ({ userId }) => {
    const bet = bets.find(b => b.userId === userId && !b.cashedOut);
    if (!bet) {
      socket.emit("cashOutFailed", { message: "No active bet" });
      return;
    }

    if (currentMultiplier >= crashPoint) {
      socket.emit("cashOutFailed", { message: "Plane crashed" });
      return;
    }

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
      win: true
    });

    socket.emit("cashedOut", { winnings, multiplier: currentMultiplier });
  });
};

// 🚀 Start a new round
const startNewRound = (io) => {
  isGameRunning = true;
  currentMultiplier = 1.0;
  crashPoint = generateCrashPoint();
  bets = []; // Reset bets for new round

  console.log(`🚀 New Round Started! Crash at: ${crashPoint}x`);
  io.emit("roundStart", { crashPoint });

  gameInterval = setInterval(async () => {
    if (currentMultiplier >= crashPoint) {
      clearInterval(gameInterval);
      io.emit("roundCrash", { multiplier: crashPoint });

      // Process losses
      for (const bet of bets) {
        if (!bet.cashedOut) {
          await GameHistory.create({
            userId: bet.userId,
            gameType: "aviator",
            result: "loss",
            betAmount: bet.betAmount,
            payoutAmount: 0,
            win: false
          });
        }
      }

      isGameRunning = false;
      setTimeout(() => startNewRound(io), 5000); // Restart after 5s
    } else {
      currentMultiplier = parseFloat((currentMultiplier + 0.05).toFixed(2));
      io.emit("multiplierUpdate", { multiplier: currentMultiplier });
    }
  }, 200);
};

export default aviatorSocketHandler;