import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = [
    {
      name: "Work",
      color: "#3b82f6", // blue
    },
    {
      name: "Study",
      color: "#10b981", // green
    },
    {
      name: "Exercise",
      color: "#f59e0b", // amber
    },
  ];

  for (const category of categories) {
    const existing = await prisma.category.findFirst({
      where: { name: category.name },
    });

    if (!existing) {
      await prisma.category.create({
        data: category,
      });
      console.log(`✓ Created category: ${category.name}`);
    } else {
      console.log(`✓ Category already exists: ${category.name}`);
    }
  }

  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
