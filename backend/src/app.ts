// src/app.ts
import express from "express";
import userRoutes from "./routes/userRoutes";
import dotenv from "dotenv";
// import { errorMiddleware } from './middleware/errorMiddleware'; // Kita akan buat ini nanti

dotenv.config(); // Muat variabel lingkungan dari .env

const app = express();

app.use(express.json()); // Middleware untuk parsing body JSON dari permintaan

// Rute aplikasi
app.use("/api/users", userRoutes);

// Middleware penanganan error (sementara, akan dipindahkan ke src/middleware/errorMiddleware.ts)
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack); // Log error stack ke konsol server

    const statusCode = err.status || 500;
    const message = err.message || "An unexpected error occurred";

    res.status(statusCode).json({
      message: message,
      // Di lingkungan produksi, jangan sertakan stack trace untuk keamanan
      // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  }
);

export default app;
