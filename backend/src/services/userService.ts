// src/services/userService.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/userRepository";
import { RegisterUserDto, LoginUserDto } from "../DTOs/userDTO";
import type { User } from "@prisma/client";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/errors";

type UserWithoutPassword = Pick<User, "id" | "email">;

export class UserService {
  private userRepository = new UserRepository();
  private jwtSecret = process.env.JWT_SECRET as string;

  async registerUser(userData: RegisterUserDto): Promise<UserWithoutPassword> {
    const { email, password } = userData;

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictError("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.userRepository.create({
      email,
      password: hashedPassword,
    });

    return this.excludePassword(newUser);
  }

  async loginUser(
    userData: LoginUserDto
  ): Promise<{ token: string; user: UserWithoutPassword }> {
    const { email, password } = userData;

    const user = await this.userRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      this.jwtSecret,
      { expiresIn: "1h" }
    );

    return { token, user: this.excludePassword(user) };
  }

  async getUserById(id: number): Promise<UserWithoutPassword> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError("User");
    }
    return this.excludePassword(user);
  }

  async deleteUser(userId: number): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User");
    }
    await this.userRepository.delete(userId);
  }

  private excludePassword(user: User): UserWithoutPassword {
    const { password: _, ...rest } = user;
    return rest;
  }
}
