const { PrismaClient } = requier("@prisma/client");
const prisma = new PrismaClient();
module.exports = prisma;