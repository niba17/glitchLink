import bcrypt from "bcrypt";
import { RegisterDTO } from "../dtos/register.dto";
import { UserRepository } from "../repositories/user.repository";
import { CustomError } from "../errors/CustomError";

export class AuthService {
  private userRepo = new UserRepository();

  async register(data: RegisterDTO) {
    const existing = await this.userRepo.findByEmail(data.email);
    if (existing) {
      throw new CustomError("Validation failed", 400, [
        { path: "email", message: "Email already in use" },
      ]);
    }

    const hashed = await bcrypt.hash(data.password, 10);
    const user = await this.userRepo.createUser({
      email: data.email,
      password: hashed,
    });

    return user;
  }
}
