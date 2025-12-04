import { prisma } from "@/lib/db";
import { Logger } from "@/lib/logger";

export class ExpenseService {
  static async getMonthlyTrend(budgetId: string) {
    try {
      const expenses = await prisma.expense.findMany({
        where: {
          budgetId,
          status: { not: "REJECTED" },
        },
      });

      const monthlyData: Record<string, number> = {};

      expenses.forEach((exp) => {
        const month = new Date(exp.transactionDate)
          .toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
          })
          .substring(0, 7);

        monthlyData[month] = (monthlyData[month] || 0) + exp.amount;
      });

      return Object.entries(monthlyData)
        .sort(
          (a, b) =>
            new Date(a).getTime() - new Date(b).getTime()
        )
        .map(([month, amount]) => ({
          month,
          amount: parseFloat(amount.toFixed(2)),
        }));
    } catch (error) {
      Logger.error("ExpenseService.getMonthlyTrend error", error);
      throw error;
    }
  }

  static async getCategoryBreakdown(budgetId: string) {
    try {
      const expenses = await prisma.expense.findMany({
        where: {
          budgetId,
          status: { not: "REJECTED" },
        },
        include: { category: true },
      });

      const categoryData: Record<string, number> = {};

      expenses.forEach((exp) => {
        const categoryName = exp.category.name;
        categoryData[categoryName] =
          (categoryData[categoryName] || 0) + exp.amount;
      });

      return Object.entries(categoryData).map(([name, value]) => ({
        name,
        value: parseFloat(value.toFixed(2)),
      }));
    } catch (error) {
      Logger.error("ExpenseService.getCategoryBreakdown error", error);
      throw error;
    }
  }

  static async getActivityWiseSpend(budgetId: string) {
    try {
      const expenses = await prisma.expense.findMany({
        where: {
          budgetId,
          status: { not: "REJECTED" },
        },
      });

      const activityData: Record<string, number> = {};

      expenses.forEach((exp) => {
        activityData[exp.activityName] =
          (activityData[exp.activityName] || 0) + exp.amount;
      });

      return Object.entries(activityData)
        .sort((a, b) => b - a)
        .map(([activity, amount]) => ({
          activity,
          amount: parseFloat(amount.toFixed(2)),
        }))
        .slice(0, 10);
    } catch (error) {
      Logger.error("ExpenseService.getActivityWiseSpend error", error);
      throw error;
    }
  }

  static async getPendingApprovals(department?: string) {
    try {
      const pending = await prisma.expense.count({
        where: {
          status: "PENDING",
          ...(department && {
            budget: { department },
          }),
        },
      });

      return pending;
    } catch (error) {
      Logger.error("ExpenseService.getPendingApprovals error", error);
      throw error;
    }
  }
}
