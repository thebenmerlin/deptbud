import { useState, useEffect } from "react";
import axios from "axios";
import { Logger } from "@/lib/logger";

export function useDashboard(budgetId?: string) {
  const [stats, setStats] = useState<any>(null);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [activityWise, setActivityWise] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const [budgetRes, trendRes, categoryRes, activityRes] =
        await Promise.all([
          axios.get(`/api/budget/${id}`),
          axios.get(`/api/budget/${id}/monthly-trend`),
          axios.get(`/api/budget/${id}/category-breakdown`),
          axios.get(`/api/budget/${id}/activity-wise`),
        ]);

      const budget = budgetRes.data;
      const totalSpent = budget.expenses.reduce(
        (sum: number, exp: any) => sum + exp.amount,
        0
      );

      setStats({
        totalBudget: budget.allottedAmount,
        totalSpent,
        remaining: budget.allottedAmount - totalSpent,
        budgetUtilization: Math.round(
          (totalSpent / budget.allottedAmount) * 100
        ),
        pendingApprovals: budget.expenses.filter(
          (e: any) => e.status === "PENDING"
        ).length,
        overBudgetCategories: 0, // Calculate from categories
      });

      setMonthlyTrend(trendRes.data);
      setCategoryBreakdown(categoryRes.data);
      setActivityWise(activityRes.data);
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.error || err.message
        : "Failed to fetch dashboard data";
      setError(message);
      Logger.error("useDashboard error", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (budgetId) {
      fetchDashboardData(budgetId);
    }
  }, [budgetId]);

  return {
    stats,
    monthlyTrend,
    categoryBreakdown,
    activityWise,
    isLoading,
    error,
    refetch: () => budgetId && fetchDashboardData(budgetId),
  };
}
