import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

declare global {
  // Isso previne que o prisma seja recriado em cada recarregamento em ambientes de desenvolvimento.
  var prisma__: PrismaClient | undefined;
}

// Verifica se já existe uma instância de PrismaClient em produção ou cria uma nova em desenvolvimento.
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma__) {
    global.prisma__ = new PrismaClient();
  }
  prisma = global.prisma__;
}

export default prisma;