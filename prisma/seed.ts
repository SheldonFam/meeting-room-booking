import { PrismaClient } from "../generated/prisma";
const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      {
        email: "admin@example.com",
        name: "Admin User",
        password: "admin123", // In production, use hashed passwords!
        role: "ADMIN",
      },
      {
        email: "employee@example.com",
        name: "Employee User",
        password: "employee123",
        role: "USER",
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
