// src/server.ts
import app from "./app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

async function main() {
  try {
    // Koneksi ke database sebelum server dimulai
    await prisma.$connect();
    console.log("Database connected successfully!");

    // Mulai server Express
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(
        `Endpoint Register: http://localhost:${PORT}/api/users/register`
      );
    });
  } catch (error) {
    console.error("Failed to connect to the database or start server:", error);
    process.exit(1); // Keluar dari proses jika ada masalah startup
  }
}

// Pastikan koneksi Prisma ditutup saat aplikasi berhenti
main().finally(async () => {
  await prisma.$disconnect();
});
