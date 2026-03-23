import dotenv from "dotenv";
import app from "./app.js";
import paymentRoutes from "./routes/payment";

dotenv.config();
app.use("/payment", paymentRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
