import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Seeding database...');

  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Infrastructure',
        description: 'Lab setup, repairs, furniture',
        icon: '🏗️',
        color: '#3b82f6',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Hardware',
        description: 'Computers, equipment',
        icon: '🖥️',
        color: '#8b5cf6',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Software',
        description: 'Licenses, subscriptions',
        icon: '📦',
        color: '#ec4899',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Workshops & FDPs',
        description: 'Training and faculty development',
        icon: '📚',
        color: '#f59e0b',
      },
    }),
  ]);

  const hashedPassword = await bcrypt.hash('Password@123', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@budget.local',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
      department: 'Administration',
    },
  });

  const hodUser = await prisma.user.create({
    data: {
      email: 'hod@budget.local',
      password: hashedPassword,
      name: 'HOD - Computer Science',
      role: 'HOD',
      department: 'Computer Science',
    },
  });

  const staffUser = await prisma.user.create({
    data: {
      email: 'staff@budget.local',
      password: hashedPassword,
      name: 'Staff Member',
      role: 'STAFF',
      department: 'Computer Science',
    },
  });

  const budget = await prisma.budget.create({
    data: {
      title: 'CS Department 2024-2025',
      fiscalYear: '2024',
      department: 'Computer Science',
      proposedAmount: 500000,
      allottedAmount: 450000,
      status: 'ACTIVE',
      creator: {
        connect: { id: hodUser.id }
      },
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('📊 Created:', { categories: categories.length, users: 3, budgets: 1 });
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
