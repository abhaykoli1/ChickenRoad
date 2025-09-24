import { UserGameSession } from "../models/userGameSession.model.js";
import { GameHistory } from "../models/gameHistory.model.js";

const handlePreviousUnfinishedSession = async (req, res, next) => {
    try {
        const userId = req.userId;

        const session = await UserGameSession.findOne({
            userId,
            isStopped: false,
            isCrashed: false,
        });

        if (session) {
            // Crash the previous unfinished session
            session.isCrashed = true;
            session.payoutAmount = 0;
            await session.save();

            // Log the loss in GameHistory
            await GameHistory.create({
                userId,
                gameType: session.gameType,
                result: "loss",
                betAmount: session.betAmount,
                payoutAmount: 0,
                win: false,
                roundId: session.roundId?.toString() || null,
            });
        }

        next();
    } catch (error) {
        next(error); // pass to global error handler
    }
};

export { handlePreviousUnfinishedSession };
