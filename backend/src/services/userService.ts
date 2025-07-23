// src/services/userService.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/userRepository";
import { RegisterUserDto, LoginUserDto } from "../dtos/user.dto";
import type { User } from "@prisma/client";
import {
  UserAlreadyExistsError,
  InvalidCredentialsError,
  UserNotFoundByIdError,
  MissingJwtSecretError,
} from "../utils/errors";

type UserWithoutPassword = Pick<User, "id" | "email">;

export class UserService {
  private userRepository: UserRepository;
  private jwtSecret: string;

  constructor() {
    this.userRepository = new UserRepository();
    if (!process.env.JWT_SECRET) {
      throw new MissingJwtSecretError();
    }
    this.jwtSecret = process.env.JWT_SECRET;
  }

  async registerUser(userData: RegisterUserDto): Promise<UserWithoutPassword> {
    const { email, password } = userData;

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new UserAlreadyExistsError();
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userRepository.create({
      email,
      password: hashedPassword,
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async loginUser(
    userData: LoginUserDto
  ): Promise<{ token: string; user: UserWithoutPassword }> {
    const { email, password } = userData;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    const tokenPayload = {
      userId: user.id,
      email: user.email,
    };

    const token = jwt.sign(tokenPayload, this.jwtSecret, { expiresIn: "1h" });

    const { password: _, ...userWithoutPassword } = user;

    return { token, user: userWithoutPassword };
  }

  async getUserById(id: number): Promise<UserWithoutPassword> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundByIdError();
    }
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async deleteUser(userId: number): Promise<void> {
    const userToDelete = await this.userRepository.findById(userId);
    if (!userToDelete) {
      throw new UserNotFoundByIdError();
    }
    await this.userRepository.delete(userId);
  }
}
