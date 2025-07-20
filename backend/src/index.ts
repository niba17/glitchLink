// src/index.ts
import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route";
import linkRoutes from "./routes/link.route";
import redirectRoutes from "./routes/redirect.route";
import qrcodeRoutes from "./routes/qrcode.route";
import "dotenv/config";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // hanya izinkan Next.js lokal
    credentials: true, // jika nanti kamu pakai cookie
  })
);

app.use("/api/auth", authRoutes);
app.use("/api", linkRoutes);
app.use("/", redirectRoutes);
app.use("/api/links", linkRoutes);
app.use("/", redirectRoutes);
app.use("/api/qrcode", qrcodeRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server ready at http://localhost:${PORT}`));
