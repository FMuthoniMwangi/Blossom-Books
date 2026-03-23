import { Router } from "express";
import { initiateStkPush } from "../services/mpesa.js";

const router = Router();

/**
 * TEMP ORDER STORE
 * This will be replaced by a database (Postgres / Prisma)
 */
const orders = {
  order_123: {
    total: 1200,
    status: "PENDING",
  },
};

router.post("/stk", async (req, res) => {
  try {
    const { phone, orderId } = req.body;

    if (!phone || !orderId) {
      return res.status(400).json({ error: "Missing phone or orderId" });
    }

    const order = orders[orderId];

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const stkResponse = await initiateStkPush({
      phone,
      amount: order.total,
      accountReference: orderId,
      transactionDesc: "Book purchase",
    });

    return res.json({
      message: "STK push sent",
      stkResponse,
    });
  } catch (err) {
    console.error("STK ERROR:", err?.response?.data || err);

    return res.status(500).json({
      error: "STK push failed",
    });
  }
});

export default router;
