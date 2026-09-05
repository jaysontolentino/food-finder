import type { User } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";

export interface IUserRepository {
  findById(userId: string): Promise<User | null>;

  findByStripeCustomerId(stripeCustomerId: string): Promise<User | null>;

  updateStripeCustomerId(
    userId: string,
    stripeCustomerId: string,
  ): Promise<User>;
}

export class UserRepository implements IUserRepository {
  async findById(userId: string) {
    return prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  async findByStripeCustomerId(stripeCustomerId: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { stripeCustomerId },
    });
  }

  async updateStripeCustomerId(userId: string, stripeCustomerId: string) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        stripeCustomerId,
      },
    });
  }
}
