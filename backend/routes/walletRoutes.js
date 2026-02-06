import express from "express";
import { getBalance } from "../controllers/walletController.js";

const router = express.Router();

router.get("/balance", getBalance);

export default router;