import express from "express";
import {
  creditWallet,
  debitWallet,
} from "../controllers/walletController.js";

const router = express.Router();

router.post("/wallet/credit", creditWallet);
router.post("/wallet/debit", debitWallet);

export default router;