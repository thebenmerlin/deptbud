// app/dashboard/hod/page.tsx

"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/shared/Card";
import { Badge } from "@/components/shared/Badge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { BarChart } from "@/components/charts/BarChart";
import { PieChart } from "@/components/charts/PieChart";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HODStats {
  departmentBudget: number;
  allocated: number;
  spent: number;
  utilization: number;
  expenses: number;
  pendingApprovals: number;
  categoryData: Array<{ name: string; value: number }>;
}

export default function HODDashboard() {
  const [stats, setStats] = useState<HODStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/analytics/hod");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
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

  const utilizationPercentage = stats
    ? ((stats.spent / stats.allocated) * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Department Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Budget overview and expense tracking
          </p>
        </div>
        <Link href="/budget/new">
          <Button>+ New Budget</Button>
        </Link>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Allocated
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              ₹{(stats?.allocated || 0).toLocaleString()}
            </p>
          </div>
        </Card>

        <Card>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Spent
            </p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              ₹{(stats?.spent || 0).toLocaleString()}
            </p>
          </div>
        </Card>

        <Card>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Utilization
            </p>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {utilizationPercentage}%
            </p>
          </div>
        </Card>
      </div>

      {/* Pending Actions */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Pending Approvals
            </h3>
            <p className="mt-1 text-3xl font-bold text-orange-600">
              {stats?.pendingApprovals || 0}
            </p>
          </div>
          <Link href="/expenses/approve">
            <Button>Review</Button>
          </Link>
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          {stats?.categoryData && (
            <PieChart
              data={stats.categoryData}
              title="Spending by Category"
            />
          )}
        </Card>

        <Card>
          {stats?.categoryData && (
            <BarChart
              data={stats.categoryData}
              title="Category Breakdown"
              dataKey="value"
            />
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Link href="/expenses/new">
              <Button variant="outline" className="w-full">
                Create Expense
              </Button>
            </Link>
            <Link href="/reports">
              <Button variant="outline" className="w-full">
                View Reports
              </Button>
            </Link>
            <Link href="/budget">
              <Button variant="outline" className="w-full">
                View Budgets
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}