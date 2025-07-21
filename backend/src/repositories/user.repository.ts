import { prisma } from "../prisma/client";

export class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async createUser(data: { email: string; password: string }) {
    return prisma.user.create({ data });
  }
}
