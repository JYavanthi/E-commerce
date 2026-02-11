import express from "express";
import axios from "axios";
import crypto from "crypto";
import { PHONEPE_CONFIG } from "../config/phonepe.js";

const router = express.Router();

/* ================= CREATE PAYMENT ================= */
router.post("/create", async (req, res) => {
  try {
    const { amount, orderId, userId } = req.body;

    const merchantTransactionId = `TXN_${Date.now()}`;

    const payload = {
      merchantId: PHONEPE_CONFIG.MERCHANT_ID,
      merchantTransactionId,
      merchantUserId: String(userId),
      amount: amount * 100, // paise
      redirectUrl: PHONEPE_CONFIG.REDIRECT_URL,
      redirectMode: "POST",
      callbackUrl: PHONEPE_CONFIG.CALLBACK_URL,
      mobileNumber: "9999999999",
      paymentInstrument: {
        type: "PAY_PAGE"
      }
    };

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");

    const stringToSign = base64Payload + "/pg/v1/pay" + PHONEPE_CONFIG.SALT_KEY;

    const checksum =
      crypto.createHash("sha256").update(stringToSign).digest("hex") +
      "###" +
      PHONEPE_CONFIG.SALT_INDEX;

    const response = await axios.post(
      `${PHONEPE_CONFIG.BASE_URL}/pg/v1/pay`,
      { request: base64Payload },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": checksum
        }
      }
    );

    const redirectUrl =
      response.data.data.instrumentResponse.redirectInfo.url;

    res.json({ success: true, redirectUrl });

  } catch (err) {
    console.error("PhonePe Error:", err.response?.data || err.message);
    res.status(500).json({ error: "PhonePe payment creation failed" });
  }
});

/* ================= CALLBACK ================= */
router.post("/callback", (req, res) => {
  console.log("PhonePe Callback:", req.body);

  // TODO: update order status in DB

  res.sendStatus(200);
});

/* ================= REDIRECT ================= */
router.post("/redirect", (req, res) => {
  const { merchantTransactionId } = req.body;

  res.redirect(`http://localhost:4000/payment-result?txn=${merchantTransactionId}`);
});

export default router;
