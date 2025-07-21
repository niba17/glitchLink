// src/services/userService.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; // Import jsonwebtoken
import { UserRepository } from "../repositories/userRepository";
import { RegisterUserDto, LoginUserDto } from "../dtos/user.dto"; // Import LoginUserDto
import type { User } from "@prisma/client";

type UserWithoutPassword = Omit<
  Awaited<ReturnType<UserRepository["createUser"]>>,
  "password"
>;

export class UserService {
  private userRepository: UserRepository;
  private jwtSecret: string; // Tambahkan properti untuk JWT secret

  constructor() {
    this.userRepository = new UserRepository();
    // Pastikan JWT_SECRET tersedia di .env
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
    this.jwtSecret = process.env.JWT_SECRET;
  }

  async registerUser(userData: RegisterUserDto): Promise<UserWithoutPassword> {
    const { email, password } = userData;

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userRepository.createUser(email, hashedPassword);

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  // --- NEW CODE ---

  /**
   * Mengotentikasi pengguna dan menghasilkan JWT.
   * @param userData Data login pengguna (email, password).
   * @returns Objek yang berisi token JWT dan informasi pengguna (tanpa password).
   * @throws Error jika kredensial tidak valid.
   */
  async loginUser(
    userData: LoginUserDto
  ): Promise<{ token: string; user: UserWithoutPassword }> {
    const { email, password } = userData;

    // 1. Cari pengguna berdasarkan email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials"); // Jangan beri tahu apakah email atau password yang salah
    }

    // 2. Bandingkan password yang diberikan dengan password yang di-hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    // 3. Buat JSON Web Token (JWT)
    // Payload JWT biasanya berisi informasi non-sensitif yang diperlukan untuk identifikasi pengguna
    const tokenPayload = {
      id: user.id,
      email: user.email,
    };

    // Tanda tangan token dengan secret key dan atur masa berlaku
    const token = jwt.sign(tokenPayload, this.jwtSecret, { expiresIn: "1h" }); // Token berlaku 1 jam

    // 4. Exclude password dari objek pengguna yang dikembalikan
    const { password: _, ...userWithoutPassword } = user;

    return { token, user: userWithoutPassword };
  }
}
