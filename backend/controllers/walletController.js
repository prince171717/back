import Wallet from "../models/Wallet.js";
import Ledger from "../models/Ledger.js";

/* ========================
   CREDIT WALLET
======================== */

export const creditWallet = async (req, res) => {
  try {
    const { client_id, amount } = req.body;

    // Validation
    if (!client_id || !amount || amount <= 0) {
      return res.status(400).json({
        error: "client_id and valid amount are required",
      });
    }

    let wallet = await Wallet.findOne({ clientId: client_id });

    // Create wallet if not exists
    if (!wallet) {
      wallet = await Wallet.create({
        clientId: client_id,
        balance: 0,
      });
    }

    // Update balance
    wallet.balance += Number(amount);
    await wallet.save();

    // Create ledger entry
    await Ledger.create({
      clientId: client_id,
      amount: Number(amount),
      type: "credit",
    });

    return res.status(200).json({
      message: "Wallet credited successfully",
      wallet,
    });
  } catch (error) {
    console.error("Credit Error:", error);

    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

/* ========================
   DEBIT WALLET
======================== */

export const debitWallet = async (req, res) => {
  try {
    const { client_id, amount } = req.body;

    // Validation
    if (!client_id || !amount || amount <= 0) {
      return res.status(400).json({
        error: "client_id and valid amount are required",
      });
    }

    const wallet = await Wallet.findOne({ clientId: client_id });

    // Check wallet existence
    if (!wallet) {
      return res.status(404).json({
        error: "Wallet not found",
      });
    }

    // Check balance
    if (wallet.balance < amount) {
      return res.status(400).json({
        error: "Insufficient balance",
      });
    }

    // Deduct amount
    wallet.balance -= Number(amount);
    await wallet.save();

    // Create ledger entry
    await Ledger.create({
      clientId: client_id,
      amount: Number(amount),
      type: "debit",
    });

    return res.status(200).json({
      message: "Wallet debited successfully",
      wallet,
    });
  } catch (error) {
    console.error("Debit Error:", error);

    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

/* ========================
   GET BALANCE
======================== */

export const getBalance = async (req, res) => {
  try {
    const clientId = req.headers["client-id"];

    // Check header
    if (!clientId) {
      return res.status(400).json({
        error: "client-id header is required",
      });
    }

    const wallet = await Wallet.findOne({ clientId });

    return res.status(200).json({
      balance: wallet ? wallet.balance : 0,
    });
  } catch (error) {
    console.error("Balance Error:", error);

    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};
