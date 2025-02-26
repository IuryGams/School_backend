import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

declare global {
  // Isso previne que o prisma seja recriado em cada recarregamento em ambientes de desenvolvimento.
  var __prisma: PrismaClient | undefined;
}

// Verifica se já existe uma instância de PrismaClient em produção ou cria uma nova em desenvolvimento.
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient();
  }
  prisma = global.__prisma;
}

export default prisma;