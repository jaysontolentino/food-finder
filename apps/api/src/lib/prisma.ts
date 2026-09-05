import { env } from "../config/env";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaMariaDb({
  host: env.databaseHost,
  user: env.databaseUser,
  password: env.databasePassword,
  database: env.databaseName,
  connectionLimit: 5,
});
const prisma = new PrismaClient({ adapter });

export { prisma };
