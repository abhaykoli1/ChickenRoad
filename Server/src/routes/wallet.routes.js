import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addMoneyToWallet,
  getAllUsersTransactionHistory,
  getUserTransactionHistory,
  requestWithdrawal,
  getAllWithdrawalsHistory,
  updateWalletTransactionStatus,
  requestDeposite,
  getAllDepositeHistory,
  updateDepositeTransactionStatus,
  updateTelegramDepositeTransactionStatus,
} from "../controllers/wallet.controller.js";

const router = Router();

router.route("/add-money").post(verifyJWT, addMoneyToWallet);
router.route("/withraw").post(verifyJWT, requestWithdrawal);
router.route("/deposit").post(requestDeposite);
router.route("/history").get(verifyJWT, getUserTransactionHistory);
router.route("/history/users").get(getAllUsersTransactionHistory);
router.route("/history/withdrawals").get(getAllWithdrawalsHistory);
router.route("/history/deposit").get(getAllDepositeHistory);
router.route("/transaction/status").put(updateWalletTransactionStatus);
router.route("/update-transaction-status").put(updateWalletTransactionStatus);

router
  .route("/update-deposite-transaction-status")
  .put(updateDepositeTransactionStatus);

router
  .route("/telegram/update-deposite-transaction-status")
  .put(updateTelegramDepositeTransactionStatus);

export default router;
