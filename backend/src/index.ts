import express from "express";
import authRouter from "./routes/auth.route";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();
app.use(express.json());

app.use("/api/auth", authRouter);
app.use(errorHandler);

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
