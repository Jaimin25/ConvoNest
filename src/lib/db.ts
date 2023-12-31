import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient | undefined;

export const db = prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  prisma = db;
}
