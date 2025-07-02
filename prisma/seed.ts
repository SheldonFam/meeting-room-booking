import { PrismaClient } from "../generated/prisma";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const employeePassword = await bcrypt.hash("employee123", 10);
  await prisma.user.createMany({
    data: [
      {
        email: "admin@example.com",
        name: "Admin",
        password: adminPassword, // Hashed password
        role: "ADMIN",
      },
      {
        email: "employee@example.com",
        name: "Employee",
        password: employeePassword, // Hashed password
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
