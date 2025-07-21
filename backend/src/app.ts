// src/app.ts
import express from "express";
import userRoutes from "./routes/userRoutes";
import dotenv from "dotenv";
import { errorMiddleware } from "./middleware/errorMiddleware"; // Import middleware error

dotenv.config();

const app = express();

app.use(express.json());

// Rute aplikasi
app.use("/api/users", userRoutes);

// Middleware penanganan error harus selalu diletakkan PALING AKHIR
// setelah semua rute dan middleware lainnya
app.use(errorMiddleware);

export default app;
