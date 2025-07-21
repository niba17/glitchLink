// src/repositories/userRepository.ts
// Pastikan ini adalah satu-satunya impor PrismaClient di sini
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class UserRepository {
  /**
   * Mencari pengguna berdasarkan alamat email.
   * @param email Email pengguna yang dicari.
   * @returns Objek User jika ditemukan, null jika tidak.
   */
  async findByEmail(email: string) {
    // Hapus `: Promise<User | null>`
    return prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Membuat pengguna baru di database.
   * @param email Email pengguna.
   * @param hashedPassword Password pengguna yang sudah di-hash.
   * @returns Objek User yang baru dibuat.
   */
  async createUser(email: string, hashedPassword: string) {
    // Hapus `: Promise<User>`
    return prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
  }
}
