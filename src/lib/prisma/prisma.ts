import { PrismaClient } from '@prisma/client';

declare global {
  // Allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  // production環境では新しいPrismaClientインスタンスを作成
  prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });
} else {
  // 開発環境では、グローバル変数にPrismaClientインスタンスをキャッシュ
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
  }
  // キャッシュされたインスタンスを再利用
  prisma = global.prisma;
}

console.log('Prisma Client initialized with DATABASE_URL');

export default prisma;
