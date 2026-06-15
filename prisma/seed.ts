require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const bcrypt = require("bcryptjs");

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);
  
  // Create an admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@mssnyabatech.org" },
    update: {},
    create: {
      email: "admin@mssnyabatech.org",
      name: "Super Admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  // Create some resources
  await prisma.resource.createMany({
    data: [
      {
        title: "MTH 101 Past Questions",
        category: "Past Questions",
        type: "PDF",
        fileUrl: "/docs/mth101.pdf",
        authorId: admin.id,
      },
      {
        title: "Engineering Mathematics II",
        category: "Textbooks",
        type: "PDF",
        fileUrl: "/docs/eng_math_2.pdf",
        authorId: admin.id,
      },
      {
        title: "Path to Paradise - Lecture",
        category: "Lectures",
        type: "Audio",
        fileUrl: "/audio/paradise.mp3",
        authorId: admin.id,
      },
    ],
  });

  console.log("Seed data created!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
