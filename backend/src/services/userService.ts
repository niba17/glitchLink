// backend/src/services/userService.ts
import bcrypt from "bcryptjs";
import { UserRepository } from "../repositories/userRepository";
import { RegisterUserDto, LoginUserDto } from "../DTOs/userDTO";
import type { User } from "@prisma/client";
import {
  CredentialError,
  NotFoundError,
  ValidationError,
} from "../utils/errors";
import { generateJwt } from "../utils/jwt"; // <--- pakai helper

type UserWithoutPassword = Pick<User, "id" | "email">;

export class UserService {
  private userRepository = new UserRepository();

  async registerUser(userData: RegisterUserDto): Promise<UserWithoutPassword> {
    const { email, password, confirmPassword } = userData;

    const validationErrors: { path: string; message: string }[] = [];

    if (password !== confirmPassword) {
      validationErrors.push({
        path: "confirmPassword",
        message: "Passwords do not match",
      });
    }

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      validationErrors.push({
        path: "email",
        message: "User with this email already exists",
      });
    }

    if (validationErrors.length > 0) {
      throw new ValidationError(validationErrors);
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
    const passwordValid =
      user && (await bcrypt.compare(password, user.password));

    if (!user || !passwordValid) {
      throw new CredentialError("Invalid credential", ["email", "password"]);
    }

    // Gunakan helper generateJwt
    const token = generateJwt(user);

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
