import express from "express";
import cors from "cors";
import booksRoutes from "./routes/books.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Blossom Books API running");
});

app.use("/books", booksRoutes);

export default app;
