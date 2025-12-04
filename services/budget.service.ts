import { prisma } from "@/lib/db";
import { Logger } from "@/lib/logger";

export class BudgetService {
  static async getBudgetStats(budgetId: string) {
    try {
      const budget = await prisma.budget.findUnique({
        where: { id: budgetId },
        include: {
          expenses: {
            where: { status: { not: "REJECTED" } },
          },
          categories: {
            include: { category: true },
          },
        },
      });

      if (!budget) return null;

      const totalSpent = budget.expenses.reduce(
        (sum, exp) => sum + exp.amount,
        0
      );

      const variance = budget.allottedAmount - budget.proposedAmount;
      const utilization = (
        (totalSpent / budget.allottedAmount) *
        100
      ).toFixed(2);

      return {
        ...budget,
        totalSpent,
        remaining: budget.allottedAmount - totalSpent,
        variance,
        utilization: parseFloat(utilization),
        categoryBreakdown: budget.categories.map((cat) => ({
          ...cat,
          categoryName: cat.category.name,
        })),
      };
    } catch (error) {
      Logger.error("BudgetService.getBudgetStats error", error);
      throw error;
    }
  }

  static async getDepartmentStats(department: string) {
    try {
      const budgets = await prisma.budget.findMany({
        where: { department },
        include: {
          expenses: {
            where: { status: { not: "REJECTED" } },
          },
        },
      });

      const totalProposed = budgets.reduce(
        (sum, b) => sum + b.proposedAmount,
        0
      );
      const totalAllotted = budgets.reduce(
        (sum, b) => sum + b.allottedAmount,
        0
      );
      const totalSpent = budgets.reduce(
        (sum, b) =>
          sum +
          b.expenses.reduce((expSum, exp) => expSum + exp.amount, 0),
        0
      );

      return {
        department,
        totalProposed,
        totalAllotted,
        totalSpent,
        remaining: totalAllotted - totalSpent,
        variance: totalAllotted - totalProposed,
        utilization: ((totalSpent / totalAllotted) * 100).toFixed(2),
        budgetCount: budgets.length,
      };
    } catch (error) {
      Logger.error("BudgetService.getDepartmentStats error", error);
      throw error;
    }
  }
}
