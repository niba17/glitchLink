// src/app.ts
import express from "express";
import userRoutes from "./routes/userRoutes";
import linkRoutes from "./routes/linkRoutes";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { LinkController } from "./controllers/linkController";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/links", linkRoutes);

const linkController = new LinkController();

app.get(
  "/:shortCode",
  linkController.redirectToOriginalUrl.bind(linkController)
);

app.use(errorMiddleware);

export default app;
