import mongoose from "mongoose";
import axios from "axios";
import Wallet from "../models/Wallet.js";
import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const clientId = req.headers["client-id"];
    const { amount } = req.body;

    session.startTransaction();

    const wallet = await Wallet.findOne(
      { clientId },
      null,
      { session }
    );

    if (!wallet || wallet.balance < amount) {
      throw new Error("Low balance");
    }

    wallet.balance -= amount;
    await wallet.save({ session });

    const order = await Order.create(
      [{ clientId, amount }],
      { session }
    );

    const response = await axios.post(
      "https://jsonplaceholder.typicode.com/posts",
      {
        userId: clientId,
        title: order[0]._id,
      }
    );

    order[0].fulfillmentId = response.data.id;
    order[0].status = "completed";

    await order[0].save({ session });

    await session.commitTransaction();

    res.json(order[0]);
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ error: err.message });
  }
};

export const getOrder = async (req, res) => {
  const clientId = req.headers["client-id"];

  const order = await Order.findOne({
    _id: req.params.id,
    clientId,
  });

  res.json(order);
};