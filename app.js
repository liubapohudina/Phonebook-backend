import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import { configDotenv } from "dotenv";

import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/authRoutes.js";

configDotenv();

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/users", authRouter);
app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

mongoose.connect(process.env.DB_HOST)
  .then(() => {
  app.listen(process.env.PORT, () => {
    console.log("Database connection successful");
    console.log(`Server is running. Use our API on port: ${process.env.PORT}`)
});
  })
  .catch(error => {
    console.error(error.message)
    process.exit(1);
  })