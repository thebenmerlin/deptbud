// services/category.service.ts

import { prisma } from "@/lib/db";
import { Category } from "@prisma/client";

export interface CreateCategoryInput {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive?: boolean;
}

export class CategoryService {
  /**
   * Get all categories
   */
  static async getAll(includeInactive: boolean = false): Promise<Category[]> {
    return prisma.category.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { name: "asc" },
    });
  }

  /**
   * Get category by ID
   */
  static async getById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { id },
    });
  }

  /**
   * Get category by name
   */
  static async getByName(name: string): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { name },
    });
  }

  /**
   * Create a new category
   */
  static async create(input: CreateCategoryInput): Promise<Category> {
    // Check if category already exists
    const existing = await this.getByName(input.name);
    if (existing) {
      throw new Error(`Category "${input.name}" already exists`);
    }

    return prisma.category.create({
      data: {
        name: input.name,
        description: input.description,
        icon: input.icon,
        color: input.color,
      },
    });
  }

  /**
   * Update a category
   */
  static async update(id: string, input: UpdateCategoryInput): Promise<Category> {
    return prisma.category.update({
      where: { id },
      data: input,
    });
  }

  /**
   * Delete a category (soft delete)
   */
  static async delete(id: string): Promise<Category> {
    return prisma.category.update({
      where: { id },
      data: { isActive: false },
    });
  }

  /**
   * Hard delete a category
   */
  static async hardDelete(id: string): Promise<void> {
    // Check if category is used in expenses
    const expenseCount = await prisma.expense.count({
      where: { categoryId: id },
    });

    if (expenseCount > 0) {
      throw new Error("Cannot delete category that has associated expenses");
    }

    await prisma.category.delete({
      where: { id },
    });
  }

  /**
   * Get category usage statistics
   */
  static async getUsageStats(categoryId: string): Promise<{
    expenseCount: number;
    totalAmount: number;
    budgetCount: number;
  }> {
    const expenses = await prisma.expense.findMany({
      where: { categoryId },
    });

    const budgets = await prisma.budgetCategory.findMany({
      where: { categoryId },
    });

    const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    return {
      expenseCount: expenses.length,
      totalAmount,
      budgetCount: budgets.length,
    };
  }

  /**
   * Get all categories with usage info
   */
  static async getAllWithStats(): Promise<
    Array<Category & { expenseCount: number; totalAmount: number }>
  > {
    const categories = await this.getAll();

    const categoryStats = await Promise.all(
      categories.map(async (cat) => {
        const stats = await this.getUsageStats(cat.id);
        return {
          ...cat,
          expenseCount: stats.expenseCount,
          totalAmount: stats.totalAmount,
        };
      })
    );

    return categoryStats;
  }

  /**
   * Bulk create categories
   */
  static async bulkCreate(categories: CreateCategoryInput[]): Promise<Category[]> {
    const created: Category[] = [];

    for (const cat of categories) {
      try {
        const result = await this.create(cat);
        created.push(result);
      } catch (error) {
        console.error(`Failed to create category ${cat.name}:`, error);
      }
    }

    return created;
  }
}