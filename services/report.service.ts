// services/report.service.ts

import { prisma } from "@/lib/db";
import { Budget, Expense } from "@prisma/client";

export interface ReportFilters {
  budgetId?: string;
  departmentId?: string;
  startDate?: Date;
  endDate?: Date;
  status?: string;
  categoryId?: string;
}

export interface BudgetReport {
  budget: Budget;
  totalExpenses: number;
  approvedExpenses: number;
  pendingExpenses: number;
  rejectedExpenses: number;
  totalSpent: number;
  utilization: number;
  remaining: number;
  categoryBreakdown: Array<{
    categoryId: string;
    categoryName: string;
    allocated: number;
    spent: number;
    utilization: number;
  }>;
}

export class ReportService {
  /**
   * Get budget report
   */
  static async getBudgetReport(budgetId: string): Promise<BudgetReport> {
    const budget = await prisma.budget.findUniqueOrThrow({
      where: { id: budgetId },
      include: {
        expenses: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    const expenses = budget.expenses;
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const utilization = (totalSpent / budget.allottedAmount) * 100;

    const categoryBreakdown = budget.categories.map((bc) => {
      const categoryExpenses = expenses.filter((e) => e.categoryId === bc.categoryId);
      const spent = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);

      return {
        categoryId: bc.categoryId,
        categoryName: bc.category.name,
        allocated: bc.allocatedAmount,
        spent,
        utilization: (spent / bc.allocatedAmount) * 100,
      };
    });

    return {
      budget,
      totalExpenses: expenses.length,
      approvedExpenses: expenses.filter((e) => e.status === "APPROVED").length,
      pendingExpenses: expenses.filter((e) => e.status === "PENDING").length,
      rejectedExpenses: expenses.filter((e) => e.status === "REJECTED").length,
      totalSpent,
      utilization,
      remaining: budget.allottedAmount - totalSpent,
      categoryBreakdown,
    };
  }

  /**
   * Get department budget summary
   */
  static async getDepartmentSummary(department: string, fiscalYear?: string): Promise<{
    department: string;
    budgets: Array<{
      id: string;
      title: string;
      proposedAmount: number;
      allottedAmount: number;
      totalSpent: number;
      utilization: number;
    }>;
    totalProposed: number;
    totalAllotted: number;
    totalSpent: number;
    overallUtilization: number;
  }> {
    const budgets = await prisma.budget.findMany({
      where: {
        department,
        ...(fiscalYear && { fiscalYear }),
      },
      include: {
        expenses: true,
      },
    });

    let totalSpent = 0;
    const budgetSummaries = budgets.map((budget) => {
      const spent = budget.expenses.reduce((sum, exp) => sum + exp.amount, 0);
      totalSpent += spent;

      return {
        id: budget.id,
        title: budget.title,
        proposedAmount: budget.proposedAmount,
        allottedAmount: budget.allottedAmount,
        totalSpent: spent,
        utilization: (spent / budget.allottedAmount) * 100,
      };
    });

    const totalAllotted = budgets.reduce((sum, b) => sum + b.allottedAmount, 0);
    const totalProposed = budgets.reduce((sum, b) => sum + b.proposedAmount, 0);

    return {
      department,
      budgets: budgetSummaries,
      totalProposed,
      totalAllotted,
      totalSpent,
      overallUtilization: (totalSpent / totalAllotted) * 100,
    };
  }

  /**
   * Get monthly expense trend
   */
  static async getMonthlyTrend(
    budgetId: string
  ): Promise<Array<{ month: string; total: number; count: number }>> {
    const expenses = await prisma.expense.findMany({
      where: { budgetId },
    });

    const monthlyData: Record<string, { total: number; count: number }> = {};

    expenses.forEach((exp) => {
      const month = exp.transactionDate.toISOString().slice(0, 7);
      if (!monthlyData[month]) {
        monthlyData[month] = { total: 0, count: 0 };
      }
      monthlyData[month].total += exp.amount;
      monthlyData[month].count += 1;
    });

    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        ...data,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  /**
   * Get expense breakdown by category
   */
  static async getCategoryBreakdown(budgetId: string): Promise<
    Array<{
      categoryId: string;
      categoryName: string;
      total: number;
      count: number;
      percentage: number;
    }>
  > {
    const expenses = await prisma.expense.findMany({
      where: { budgetId },
      include: { category: true },
    });

    const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    const categoryMap: Record<
      string,
      { name: string; total: number; count: number }
    > = {};

    expenses.forEach((exp) => {
      const key = exp.categoryId;
      if (!categoryMap[key]) {
        categoryMap[key] = { name: exp.category.name, total: 0, count: 0 };
      }
      categoryMap[key].total += exp.amount;
      categoryMap[key].count += 1;
    });

    return Object.entries(categoryMap)
      .map(([categoryId, data]) => ({
        categoryId,
        categoryName: data.name,
        total: data.total,
        count: data.count,
        percentage: (data.total / totalAmount) * 100,
      }))
      .sort((a, b) => b.total - a.total);
  }

  /**
   * Get expense approval statistics
   */
  static async getApprovalStats(budgetId: string): Promise<{
    pending: number;
    approved: number;
    rejected: number;
    pendingAmount: number;
    approvedAmount: number;
    rejectedAmount: number;
  }> {
    const expenses = await prisma.expense.findMany({
      where: { budgetId },
    });

    return {
      pending: expenses.filter((e) => e.status === "PENDING").length,
      approved: expenses.filter((e) => e.status === "APPROVED").length,
      rejected: expenses.filter((e) => e.status === "REJECTED").length,
      pendingAmount: expenses
        .filter((e) => e.status === "PENDING")
        .reduce((sum, e) => sum + e.amount, 0),
      approvedAmount: expenses
        .filter((e) => e.status === "APPROVED")
        .reduce((sum, e) => sum + e.amount, 0),
      rejectedAmount: expenses
        .filter((e) => e.status === "REJECTED")
        .reduce((sum, e) => sum + e.amount, 0),
    };
  }

  /**
   * Get year-over-year comparison
   */
  static async getYOYComparison(
    department: string,
    currentYear: string,
    previousYear: string
  ): Promise<{
    currentYear: {
      total: number;
      count: number;
    };
    previousYear: {
      total: number;
      count: number;
    };
    changePercent: number;
  }> {
    const currentBudgets = await prisma.budget.findMany({
      where: { department, fiscalYear: currentYear },
      include: { expenses: true },
    });

    const previousBudgets = await prisma.budget.findMany({
      where: { department, fiscalYear: previousYear },
      include: { expenses: true },
    });

    const currentTotal = currentBudgets.reduce(
      (sum, b) => sum + b.expenses.reduce((s, e) => s + e.amount, 0),
      0
    );
    const currentCount = currentBudgets.reduce((sum, b) => sum + b.expenses.length, 0);

    const previousTotal = previousBudgets.reduce(
      (sum, b) => sum + b.expenses.reduce((s, e) => s + e.amount, 0),
      0
    );
    const previousCount = previousBudgets.reduce((sum, b) => sum + b.expenses.length, 0);

    const changePercent = previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal) * 100 : 0;

    return {
      currentYear: { total: currentTotal, count: currentCount },
      previousYear: { total: previousTotal, count: previousCount },
      changePercent,
    };
  }
}