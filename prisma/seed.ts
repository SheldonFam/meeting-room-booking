import { PrismaClient } from "../generated/prisma";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "changeme",
    10
  );
  const employeePassword = await bcrypt.hash(
    process.env.EMPLOYEE_PASSWORD || "changeme",
    10
  );
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

  // Seed rooms with facilities as an array
  await prisma.room.createMany({
    data: [
      {
        name: "Conference Room A",
        capacity: 10,
        location: "Floor 1, West Wing",
        roomDescription:
          "A spacious room suitable for team meetings and presentations.",
        facilities: ["Projector", "Whiteboard", "Video Conferencing"],
        status: "available",
        imageUrl: "/images/room1.jpg",
      },
      {
        name: "Meeting Room B",
        capacity: 6,
        location: "Floor 1, West Wing",
        roomDescription: "Perfect for small team meetings.",
        facilities: ["TV Screen", "Whiteboard"],
        status: "available",
        imageUrl: "/images/room2.jpg",
      },
      // Add more rooms as needed
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
