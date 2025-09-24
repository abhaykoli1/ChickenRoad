// src/bots/telegramBot.js

import TelegramBot from "node-telegram-bot-api";
import cron from "node-cron";
import dotenv from "dotenv";
import { GameRound } from "../models/gameRound.model.js";

dotenv.config();

// 🟢 Setup bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });

// 🕐 Cron job: runs every minute
cron.schedule("* * * * *", async () => {
    const now = new Date();

    try {
        // 1. Activate upcoming round if time has come
        const activeRound = await GameRound.findOneAndUpdate(
            {
                startTime: { $lte: now },
                status: "scheduled"
            },
            { status: "active" },
            { new: true }
        );

        // 2. Send Telegram message if not already sent
        if (activeRound && !activeRound.messageSent) {
            const message = `
🎮 *${activeRound.gameType.toUpperCase()}* Round Activated!
⏱️ _Starts Now_
📈 Multipliers: ${activeRound.multipliers.join(" → ")}
🔁 Good luck!
      `;

            await bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message, {
                parse_mode: "Markdown"
            });

            activeRound.messageSent = true;
            await activeRound.save();
        }

        // 3. Complete expired rounds
        await GameRound.updateMany(
            {
                endTime: { $lte: now },
                status: "active"
            },
            { status: "completed" }
        );

    } catch (error) {
        console.error("❌ Cron job error:", error.message);
    }
});
