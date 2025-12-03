// app/dashboard/staff/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/shared/Card";
import { Badge } from "@/components/shared/Badge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle, DollarSign, FileText } from "lucide-react";

interface StaffStats {
  totalExpenses: number;
  totalAmount: number;
  approved: number;
  pending: number;
  rejected: number;
  recentExpenses: Array<{
    id: string;
    activity: string;
    amount: number;
    status: string;
    date: string;
  }>;
}

export default function StaffDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<StaffStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/analytics/staff");
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome, {session?.user?.name}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your expenses and track approvals
          </p>
        </div>
        <Link href="/expenses/new">
          <Button>+ New Expense</Button>
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Expenses
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {stats?.totalExpenses || 0}
              </p>
            </div>
            <FileText className="h-10 w-10 text-blue-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Amount
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                ₹{(stats?.totalAmount || 0).toLocaleString()}
              </p>
            </div>
            <DollarSign className="h-10 w-10 text-green-600" />
          </div>
        </Card>

        <Card>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Approved
            </p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {stats?.approved || 0}
            </p>
          </div>
        </Card>

        <Card>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Pending
            </p>
            <p className="mt-2 text-3xl font-bold text-orange-600">
              {stats?.pending || 0}
            </p>
          </div>
        </Card>
      </div>

      {/* Recent Expenses */}
      <Card>
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Recent Expenses
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                  Activity
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                  Amount
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentExpenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="border-b border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {expense.activity}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    ₹{expense.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Badge
                      variant={
                        expense.status === "APPROVED"
                          ? "success"
                          : expense.status === "REJECTED"
                          ? "danger"
                          : "warning"
                      }
                    >
                      {expense.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}