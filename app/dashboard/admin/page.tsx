// app/dashboard/admin/page.tsx

"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/shared/Card";
import { Badge } from "@/components/shared/Badge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { BarChart } from "@/components/charts/BarChart";
import { PieChart } from "@/components/charts/PieChart";
import { LineChart } from "@/components/charts/LineChart";
import { Users, DollarSign, FolderOpen, AlertCircle } from "lucide-react";

interface AdminStats {
  totalBudgets: number;
  totalExpenses: number;
  totalUsers: number;
  pendingApprovals: number;
  monthlyData: Array<{ name: string; value: number }>;
  departmentSpend: Array<{ name: string; value: number }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/analytics/admin");
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-900/20 dark:text-red-200">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          System overview and management
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Budgets
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {stats?.totalBudgets || 0}
              </p>
            </div>
            <FolderOpen className="h-10 w-10 text-blue-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Expenses
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                ₹{(stats?.totalExpenses || 0).toLocaleString()}
              </p>
            </div>
            <DollarSign className="h-10 w-10 text-green-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Users
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {stats?.totalUsers || 0}
              </p>
            </div>
            <Users className="h-10 w-10 text-purple-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Pending Approvals
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {stats?.pendingApprovals || 0}
              </p>
            </div>
            <Badge variant="warning" className="h-fit">
              {stats?.pendingApprovals || 0}
            </Badge>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          {stats?.monthlyData && (
            <LineChart
              data={stats.monthlyData}
              title="Monthly Expense Trend"
              dataKey="value"
            />
          )}
        </Card>

        <Card>
          {stats?.departmentSpend && (
            <PieChart
              data={stats.departmentSpend}
              title="Department-wise Spending"
            />
          )}
        </Card>
      </div>

      <Card>
        {stats?.monthlyData && (
          <BarChart
            data={stats.monthlyData}
            title="Monthly Budget Utilization"
            dataKey="value"
          />
        )}
      </Card>
    </div>
  );
}
