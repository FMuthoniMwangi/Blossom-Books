
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export async function getAccessToken() {
  // Safaricom OAuth URL (fixed, public)
  const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

  // Create Base64 consumerKey:consumerSecret
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString("base64");

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    return response.data.access_token;
  } catch (err) {
    console.error("Failed to generate access token:", err.response?.data || err);
    throw new Error("Token generation failed");
  }
}
