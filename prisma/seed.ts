import { PrismaClient } from "@prisma/client";
import { hashPassword } from "@/lib/auth";
import { EXPENSE_CATEGORIES } from "@/constants/categories";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create categories
  for (const category of EXPENSE_CATEGORIES) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: {
        name: category.name,
        description: category.description,
        icon: category.icon,
        color: category.color,
      },
    });
  }

  // Create admin user
  const adminPassword = await hashPassword("Admin@2024");
  const admin = await prisma.user.upsert({
    where: { email: "admin@budget.local" },
    update: {},
    create: {
      email: "admin@budget.local",
      name: "Administrator",
      password: adminPassword,
      role: "ADMIN",
      isActive: true,
      emailVerified: new Date(),
    },
  });

  // Create HOD user
  const hodPassword = await hashPassword("HOD@2024");
  const hod = await prisma.user.upsert({
    where: { email: "hod@budget.local" },
    update: {},
    create: {
      email: "hod@budget.local",
      name: "Head of Department",
      password: hodPassword,
      role: "HOD",
      department: "Computer Science",
      isActive: true,
      emailVerified: new Date(),
    },
  });

  // Create STAFF user
  const staffPassword = await hashPassword("Staff@2024");
  const staff = await prisma.user.upsert({
    where: { email: "staff@budget.local" },
    update: {},
    create: {
      email: "staff@budget.local",
      name: "Staff Member",
      password: staffPassword,
      role: "STAFF",
      department: "Computer Science",
      isActive: true,
      emailVerified: new Date(),
    },
  });

  // Create sample budget
  const budget = await prisma.budget.create({
    data: {
      title: "Computer Science Department 2024-2025",
      fiscalYear: "2024-2025",
      department: "Computer Science",
      proposedAmount: 500000,
      allottedAmount: 450000,
      description: "Annual budget for Computer Science department",
      createdBy: admin.id,
    },
  });

  // Assign categories to budget
  const categories = await prisma.category.findMany();
  for (const category of categories) {
    await prisma.budgetCategory.create({
      data: {
        budgetId: budget.id,
        categoryId: category.id,
        allocatedAmount: 450000 / categories.length,
        spent: 0,
      },
    });
  }

  console.log("✅ Seed completed successfully!");
  console.log("\nTest Credentials:");
  console.log("─────────────────────────────────────");
  console.log("Admin:  admin@budget.local / Admin@2024");
  console.log("HOD:    hod@budget.local / HOD@2024");
  console.log("Staff:  staff@budget.local / Staff@2024");
  console.log("─────────────────────────────────────\n");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
